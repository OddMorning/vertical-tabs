'use babel';

const
  ROOT_CLASS = 'vertical-tabs-plus';

let
  GUI = {}, Common, Controller, atomConfig;

/* =============================================================================================== */

atomConfig = {
  switchTabsByScrolling: {
    type:        'boolean',
    default:     true,
    description: 'Move cursor over tabs and use scroll wheel to switch between them.',
    order:       1,
  },
  tabsPlacement: {
    type:    'string',
    default: 'Left',
    enum:    ['Left', 'Right', 'Over tree view (beta)'],
    order:   2,
  },
  tabHeight: {
    type:        'string',
    default:     'Medium',
    enum:        ['Dense', 'Compact', 'Medium', 'Spacious'],
    description: 'Atom before version 1.17 had `Spacious` tabs and with 1.17 they became `Compact`',
    order:       3,
  },
  minTabWidth: {
    type:        'string',
    default:     '11em',
    description: 'Any valid CSS value is allowed. Number without any unit is considered as `em`. Use `initial` to disable limit (not recommended)',
    order:       4,
  },
  maxTabWidth: {
    type:        'string',
    default:     '14em',
    description: 'Note that these values are ignored when the `Over tree view` tabs placement is chosen',
    order:       5,
  },
};

/* ============================================================================================= */

Controller = {
  switchTabsByScrolling(enable) {
    console.log('Ee,', enable);
    if (enable)
      GUI.wrapper.addEventListener('wheel', Common.switchTabsByScrolling);
    else
      GUI.wrapper.removeEventListener('wheel', Common.switchTabsByScrolling);
  },
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
  tabHeight(optionID) {
    let
      value = ['2em', '2.5em', '2.9em', '3.25em'][
        atomConfig.tabHeight.enum.indexOf(optionID)
      ],
      extraPadding = (value == '2em') ? '2' : false;
    Common.CSSvar(GUI.wrapper, 'tab-height', value);

    // Чуть уменьшенное значение отступов для плотных вкладок. Костыль, потом нужно будет продумать его получше.
    Common.CSSvar(GUI.wrapper, 'tab-padding-multiplier', extraPadding);
  },
  minTabWidth(value) {
    let
      isNum = Number.isInteger(+value);

    if (isNum)
      value = `${value}em`;

    Common.CSSvar(GUI.wrapper, 'min-tab-width', value);
  },
  maxTabWidth(value) {
    let
      isNum = Number.isInteger(+value);

    if (isNum)
      value = `${value}em`;

    Common.CSSvar(GUI.wrapper, 'max-tab-width', value);
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
    GUI.wrapper.classList.add('wrapper');
    GUI.wrapper.appendChild(GUI.tabBar);

    // GUI.wrapper.classList.add('wrapper');
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

  /* -------------------------------------------------------------------------------------------- */
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
};

/* =============================================================================================== */

export default {
  config:     atomConfig,
  activate:   Common.activate,
  deactivate: Common.deactivate,
};
