'use babel';

const
  ROOT_CLASS = 'vertical-tabs-plus';

let
  GUI = {}, Common, Controller, atomConfig, Helper;

/* =============================================================================================== */

// Config
atomConfig = {
  general: {
    type:       'object',
    order:       1,
    properties: {
      scrollTabs: {
        title:       'Scroll Tabs',
        type:        'boolean',
        default:     false,
        description: 'Change active tab by mouse wheel over tabs',
        order:       1,
      },
      tabsPlacement: {
        title:   'Tabs Placement',
        type:    'string',
        default: 'Right',
        enum:    ['Left', 'Right', 'Over tree view (beta)'],
        order:   2,
      },
    },
  },
  tab: {
    type:       'object',
    order:       2,
    properties: {
      height: {
        title:       'Tab Height',
        type:        'string',
        default:     'Medium (2.9em)',
        enum:        ['Dense (2em)', 'Compact (2.5em)', 'Medium (2.9em)', 'Spacious (3.25em)', 'Custom'],
        description: 'Atom before version 1.17 had `Spacious` tabs and with 1.17 they became `Compact`',
        order:       1,
      },
      customHeight: {
        title:       'Custom Tab Height',
        type:        'string',
        default:     '2.5',
        description: 'Any valid CSS value is allowed. Number without any unit is considered as `em`. You have to chose `Custom` tab height to make custom options work',
        order:       2,
      },
      customIndent: {
        title:       'Custom Tab Indent Coefficient',
        type:        'number',
        default:     '4',
        description: 'Tab left and right indents are calculated the following way: `tab-height / coefficient`. This options allows to set the `coefficient` value. In other words, value `1` means huge indents because they\'re equal to tab height. `2` means half of tab height (e.g. `1.5em` indents for `3em` tab height) and so on. The default value for every stock tab height is equal to 4, for `Dense` is 2',
        order:       3,
      },
    },
  },
  tabContainer: {
    type:       'object',
    order:       3,
    properties: {
      minWidth: {
        title:       'Min Width',
        type:        'string',
        default:     '11',
        description: 'Any valid CSS value is allowed. Number without any unit is considered as `em` (`11` == `11em`). Use `initial` to disable limit (not recommended)',
        order:       1,
      },
      maxWidth: {
        title:       'Max Width',
        type:        'string',
        default:     '14',
        description: 'Note that these values are ignored when the `Over tree view` tabs placement is chosen',
        order:       2,
      },
      maxHeight: {
        title:       'Max Height',
        type:        'number',
        default:     60,
        description: "When placed above project tree, don't let tabs take more than % of dock height",
        order:       3,
      },
    },
  },
};

/* ============================================================================================= */

// Config controller (when options get enabled, disabled, or changed)
Controller = {
  'general.scrollTabs'(enable) {
    if (enable)
      GUI.wrapper.addEventListener('wheel', Common.scrollTabs);
    else
      GUI.wrapper.removeEventListener('wheel', Common.scrollTabs);
  },

  /* --------------- */
  'general.tabsPlacement'(optionID, oldOptionID) {
    let
      className = 'right-sided-tabs',
      getVal = (optID) => ['left', 'right', 'over-tree'][
        atomConfig.general.properties.tabsPlacement.enum.indexOf(optID)
      ],
      [value, oldValue] = [getVal(optionID), getVal(oldOptionID)];

    GUI.atomPane.dataset.tabsPosition = value;
    if (value == 'over-tree') {
      let moveTabsOverProjectTree = () => {
        delete GUI.atomPane.dataset.tabsPosition;
        GUI.atomPane.classList.remove(ROOT_CLASS);
        GUI.treeView.classList.add(ROOT_CLASS);
        GUI.treeView.insertAdjacentElement('afterBegin', GUI.wrapper);
      };

      // Project tree view in case if tabs are going to be placed there.
      // It's in init section not to make tabs blink when project tree is visible.
      // It's here too not to make package crash when new window is created
      // (Projcet tree is hidden there by default).
      if (GUI.treeView) {
        moveTabsOverProjectTree();
      } else {
        Helper.waitForProjectTreePanel()
          .then(moveTabsOverProjectTree);
      }

    } else if (oldValue == 'over-tree') {
      GUI.treeView.classList.remove(ROOT_CLASS);
      GUI.atomPane.classList.add(ROOT_CLASS);
      GUI.atomPane.insertAdjacentElement('afterBegin', GUI.wrapper);
    }
  },

  /* --------------- */
  'tab.height'(optionID) {
    let
      value = ['2em', '2.5em', '2.9em', '3.25em', 'custom'][
        atomConfig.tab.properties.height.enum.indexOf(optionID)
      ];

    if (value == 'custom') {
      let get = param => atom.config.get(`vertical-tabs-plus.${param}`);
      Controller['tab.customHeight'](get('tab.customHeight'));
      Controller['tab.customIndent'](get('tab.customIndent'));
    } else {
      Helper.CSSvar(GUI.wrapper, 'tab-height', value);

      // Bigger sides intent for dense tabs
      let extraPadding = (value == '2em') ? '2' : false;
      Helper.CSSvar(GUI.wrapper, 'tab-padding-multiplier', extraPadding);
    }
  },

  /* --------------- */
  'tab.customHeight'(value) {
    if (Helper.isCustomHeightEnabled())
      Helper.CSSvar(GUI.wrapper, 'tab-height', Helper.normalizeNumber(value));
  },

  /* --------------- */
  'tab.customIndent'(value) {
    if (Helper.isCustomHeightEnabled())
      Helper.CSSvar(GUI.wrapper, 'tab-padding-multiplier', value);
  },

  /* --------------- */
  'tabContainer.minWidth'(value) {
    Helper.CSSvar(GUI.wrapper, 'min-tab-width', Helper.normalizeNumber(value));
  },

  /* --------------- */
  'tabContainer.maxWidth'(value) {
    Helper.CSSvar(GUI.wrapper, 'max-tab-width', Helper.normalizeNumber(value));
  },

  /* --------------- */
  'tabContainer.maxHeight'(value) {
    Helper.CSSvar(GUI.wrapper, 'max-tab-container-height', `${value}%`);
  },
};

/* =============================================================================================== */

Common = {
  // When package is activated
  activate() {
    // Looks for a right pane.
    // The first query is guaranteed to find it but fails when no any file is opened
    // The second query is borrowed from the original package. Doesn't work well because can find tabs in docks instead of "our" tabs.
    GUI.atomPane = document.querySelector('atom-text-editor.editor:not(.mini)');
    GUI.atomPane
      = GUI.atomPane
        ? GUI.atomPane.closest('atom-pane')
        : document.querySelector('.vertical atom-pane');

    // Looks for the tabs container itself
    GUI.tabContainer = GUI.atomPane.querySelector('.tab-bar');

    // Tree view in case if we want to inject tabs there.
    GUI.treeView = document.querySelector('.tool-panel.tree-view');

    // Creating a wrapper for tab container to make them move through DOM with less problems
    GUI.wrapper = document.createElement('div');
    GUI.wrapper.classList.add('vtabs-wrapper');
    GUI.wrapper.appendChild(GUI.tabContainer);
    GUI.atomPane.insertAdjacentElement('afterBegin', GUI.wrapper);

    // Makes settings alive
    Common.makeSettingsAlive();

    // Sets own class
    GUI.atomPane.classList.add(ROOT_CLASS);
  },

  /* -------------------------------------------------------------------------------------------- */
  // Makes settings alive (they get loaded and react when they are changed)
  makeSettingsAlive() {
    for (let option in Controller) {
      if (!Controller.hasOwnProperty(option)) continue;

      // Option name, just shortening
      let optionID = `vertical-tabs-plus.${option}`;

      // Automatically sets actions for every package setting (if it's in Controller). First argument is a new value, the second is old value
      atom.config.onDidChange(optionID,
        ({newValue, oldValue}) => Controller[option](newValue, oldValue)
      );

      // Instantly executes the code that processes an option for the first time
      Controller[option](atom.config.get(optionID), null);
    }
  },

  /* -------------------------------------------------------------------------------------------- */
  // When package is deactivated
  deactivate() {
    GUI.atomPane.classList.remove(ROOT_CLASS);
    if (GUI.treeView)
      GUI.treeView.classList.remove(ROOT_CLASS);
    Controller['general.scrollTabs'](false);
    GUI.atomPane.insertAdjacentElement('afterBegin', GUI.tabContainer);
    GUI.wrapper.remove();
  },

  /* -------------------------------------------------------------------------------------------- */
  // Tabs scroll
  scrollTabs(ev) {
    // Prevents scroll if tab scrolling is enabled and they don't fit the screen
    ev.preventDefault();

    // Defines the scroll direction
    let command = ev.deltaY > 0 ? 'pane:show-next-item' : 'pane:show-previous-item';
    atom.commands.dispatch(atom.views.getView(atom.workspace), command);
  },
};

/* =============================================================================================== */

Helper = {
  // Sets CSS variable
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
    let isCustomHeight = (atom.config.get(`vertical-tabs-plus.tab.height`) == 'Custom');
    return isCustomHeight;
  },

  /* --------------- */
  waitForProjectTreePanel(callback) {
    return new Promise((resolve, reject) => {
      // Forces project tree to appear
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');

      let
        attemptCurrent = 0,
        attemptCount = 10,
        sleepms = 50,
        waitingForElement = setInterval(() => {
          // Looks for panel
          GUI.treeView = document.querySelector('.tool-panel.tree-view');

          // If found/not found
          if (GUI.treeView) {
            clearInterval(waitingForElement);
            resolve();
          } else {
            attemptCurrent++;
          }

          // If waits for too long time
          if (attemptCurrent == attemptCount) {
            clearInterval(waitingForElement);

            // Sets default tab placement
            atom.config.set(
              'vertical-tabs-plus.general.tabsPlacement',
              atomConfig.tabsPlacement.default
            );

            atom.notifications.addError(
              'Failed to move tabs',
              {
                detail: 'Can\'t move tabs to the project tree',
              }
            );

            reject();
          }

        }, sleepms);
    });
  },
};

/* =============================================================================================== */

export default {
  config:     atomConfig,
  activate:   Common.activate,
  deactivate: Common.deactivate,
};
