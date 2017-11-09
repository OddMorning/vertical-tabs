'use babel';

const
  ROOT_CLASS = 'vertical-tabs-plus';

let
  GUI = {}, Common, Controller, atomConfig, Helper;

/* =============================================================================================== */

atomConfig = {
  switchTabsByScrolling: {
    type:        'boolean',
    default:     true,
    description: 'Move cursor over tabs and use scroll wheel to switch between them',
    order:       1,
  },
  tabsPlacement: {
    type:    'string',
    default: 'Right',
    enum:    ['Left', 'Right', 'Over tree view (beta)'],
    order:   2,
  },
  tabHeight: {
    type:        'string',
    default:     'Medium (2.9em)',
    enum:        ['Dense (2em)', 'Compact (2.5em)', 'Medium (2.9em)', 'Spacious (3.25em)', 'Custom'],
    description: 'Atom before version 1.17 had `Spacious` tabs and with 1.17 they became `Compact`',
    order:       3,
  },
  minTabWidth: {
    type:        'string',
    default:     '11',
    description: 'Any valid CSS value is allowed. Number without any unit is considered as `em` (`11` == `11em`). Use `initial` to disable limit (not recommended)',
    order:       4,
  },
  maxTabWidth: {
    type:        'string',
    default:     '14',
    description: 'Note that these values are ignored when the `Over tree view` tabs placement is chosen',
    order:       5,
  },
  customTabHeight: {
    type:        'string',
    default:     '2.5',
    description: 'Any valid CSS value is allowed. Number without any unit is considered as `em`. You have to chose `Custom` tab height to make custom options work',
    order:       6,
  },
  customTabIndent: {
    title:       'Custom Tab Indent Factor',
    type:        'number',
    default:     '4',
    description: 'Tab left and right indents are calculated the following way: `tab-height / tab-indent-factor`. This options allows to set `tab-indent-factor`. In other words, value `1` means huge indents because they\'re equal to tab height. `2` means half of tab height (e.g. `1.5em` indents for `3em` tab height) and so on. The default value for every stock tab height is equal to 4, for `Dense` is 2',
    order:       7,
  },
};

/* ============================================================================================= */

Controller = {
  switchTabsByScrolling(enable) {
    if (enable)
      GUI.wrapper.addEventListener('wheel', Common.switchTabsByScrolling);
    else
      GUI.wrapper.removeEventListener('wheel', Common.switchTabsByScrolling);
  },

  /* --------------- */
  tabsPlacement(optionID, oldOptionID) {
    let
      className = 'right-sided-tabs',
      getVal = (optID) => ['left', 'right', 'over-tree'][
        atomConfig.tabsPlacement.enum.indexOf(optID)
      ],
      [value, oldValue] = [getVal(optionID), getVal(oldOptionID)];

    GUI.atomPane.dataset.tabsPosition = value;
    if (value == 'over-tree') {
      delete GUI.atomPane.dataset.tabsPosition;
      GUI.atomPane.classList.remove(ROOT_CLASS);
      GUI.treeView.classList.add(ROOT_CLASS);
      GUI.treeView.insertAdjacentElement('afterBegin', GUI.wrapper);
    } else if (oldValue == 'over-tree') {
      GUI.treeView.classList.remove(ROOT_CLASS);
      GUI.atomPane.classList.add(ROOT_CLASS);
      GUI.atomPane.insertAdjacentElement('afterBegin', GUI.wrapper);
    }
  },

  /* --------------- */
  tabHeight(optionID) {
    let
      value = ['2em', '2.5em', '2.9em', '3.25em', 'custom'][
        atomConfig.tabHeight.enum.indexOf(optionID)
      ];

    if (value == 'custom') {
      let get = param => atom.config.get(`vertical-tabs-plus.${param}`);
      Controller.customTabHeight(get('customTabHeight'));
      Controller.customTabIndent(get('customTabIndent'));
    } else {
      Helper.CSSvar(GUI.wrapper, 'tab-height', value);

      // Чуть уменьшенное значение отступов для плотных вкладок.
      let extraPadding = (value == '2em') ? '2' : false;
      Helper.CSSvar(GUI.wrapper, 'tab-padding-multiplier', extraPadding);
    }
  },

  /* --------------- */
  minTabWidth(value) {
    Helper.CSSvar(GUI.wrapper, 'min-tab-width', Helper.normalizeNumber(value));
  },

  /* --------------- */
  maxTabWidth(value) {
    Helper.CSSvar(GUI.wrapper, 'max-tab-width', Helper.normalizeNumber(value));
  },

  /* --------------- */
  customTabHeight(value) {
    if (Helper.isCustomHeightEnabled())
      Helper.CSSvar(GUI.wrapper, 'tab-height', Helper.normalizeNumber(value));
  },

  /* --------------- */
  customTabIndent(value) {
    if (Helper.isCustomHeightEnabled())
      Helper.CSSvar(GUI.wrapper, 'tab-padding-multiplier', value);
  },
};

/* =============================================================================================== */

Common = {
  // При активации расширения
  activate() {
    // Поиск окна с панелькой. Первый запрос гарантированно находит, если есть хоть один открытый файл. Второй запрос взят из оригинального расширения и работает не очень хорошо.
    GUI.atomPane = document.querySelector('atom-text-editor.editor:not(.mini)');
    GUI.atomPane
      = GUI.atomPane
        ? GUI.atomPane.closest('atom-pane')
        : document.querySelector('.vertical atom-pane');

    // Ищет сами вкладки, чтобы повесить событие скролла
    GUI.tabBar = GUI.atomPane.querySelector('.tab-bar');

    // Дерево проекта на случай, если вкладки будут расположены там
    GUI.treeView = document.querySelector('.tool-panel.tree-view');

    // Создание обёртки и помещение в неё вкладок для удобства перемещения вкладок в другое место)
    GUI.wrapper = document.createElement('div');
    GUI.wrapper.classList.add('vtabs-wrapper');
    GUI.wrapper.appendChild(GUI.tabBar);
    GUI.atomPane.insertAdjacentElement('afterBegin', GUI.wrapper);

    // Оживляет настройки
    Common.makeSettingsAlive();

    // Вешает свой класс
    GUI.atomPane.classList.add(ROOT_CLASS);
  },

  /* -------------------------------------------------------------------------------------------- */
  // Оживляет настройки (подгружает настройки и делает их рабочими)
  makeSettingsAlive() {
    for (let option in Controller) {
      if (!Controller.hasOwnProperty(option)) continue;

      // ID настройки, сокращение для удобства
      let optionID = `vertical-tabs-plus.${option}`;

      // Автматически цепляет на все перечисленные в Controller настройки слушатели, по которым вызывается событие. Первым аргументом передаёт новую настройку, вторым - старую
      atom.config.onDidChange(optionID,
        ({newValue, oldValue}) => Controller[option](newValue, oldValue)
      );

      // Тут же вызывает код, который обрабатывает настройку впервые (читает конфиг атома и вызывает соответствующую функцию в Controller при инициализации приложения)
      Controller[option](atom.config.get(optionID), null);
    }
  },

  /* -------------------------------------------------------------------------------------------- */
  // При деактивации расширения
  deactivate() {
    GUI.atomPane.classList.remove(ROOT_CLASS);
    GUI.treeView.classList.remove(ROOT_CLASS);
    Controller.switchTabsByScrolling(false);
    GUI.atomPane.insertAdjacentElement('afterBegin', GUI.tabBar);
    GUI.wrapper.remove();
  },

  /* -------------------------------------------------------------------------------------------- */
  // Скролл вкладок, определяет направление
  switchTabsByScrolling(ev) {
    let command = ev.deltaY > 0 ? 'pane:show-next-item' : 'pane:show-previous-item';
    atom.commands.dispatch(atom.views.getView(atom.workspace), command);
  },
};

/* =============================================================================================== */

Helper = {
  // Задаёт элементу переменную CSS
  CSSvar(el, variable, value) {
    let str = `--${variable}`;
    if (!(typeof value !== typeof undefined && value !== null)) {
      let v = el.style.getPropertyValue(str)
           || window.getComputedStyle(el).getPropertyValue(str);
      if (v === '') v = false;
      return v;
    } else if (value === false)
      el.style.setProperty(str, '');
    else
      el.style.setProperty(str, value);
  },

  /* --------------- */
  normalizeNumber(value) {
    return Number.isNaN(+value) ? value : `${value}em`;
  },

  /* --------------- */
  isCustomHeightEnabled(value) {
    let isCustomHeight = (atom.config.get(`vertical-tabs-plus.tabHeight`) == 'Custom');
    return isCustomHeight;
  },
};

/* =============================================================================================== */

export default {
  config:     atomConfig,
  activate:   Common.activate,
  deactivate: Common.deactivate,
};
