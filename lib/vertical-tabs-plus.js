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
        default: 'right',
        enum:    [
          {value: 'left', description: 'Left'},
          {value: 'right', description: 'Right'},
          {value: 'tree-view', description: 'Over tree view (beta)'},
        ],
        order:   2,
      },
      normalizeTooltips: {
        title:       'Fix Tooltips Placement (Experimental)',
        type:        'boolean',
        default:     false,
        description: 'Moves tab tooltips to side. This option is experimental because there\'s no way to inject into the "tabs" package and change behaivor of tooltips. This option tries to intercept tooltips before they\'re displayed instead.',
        order:       3,
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
        default:     '2.9em',
        enum:    [
          {value: '2em', description: 'Dense (2em)'},
          {value: '2.5em', description: 'Compact (2.5em)'},
          {value: '2.9em', description: 'Medium (2.9em)'},
          {value: '3.25em', description: 'Spacious (3.25em)'},
          {value: 'custom', description: 'Custom'},
        ],
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
        description: 'Tab left and right indents are calculated the following way: `tab-height / coefficient`. This options allows to set the `coefficient` value. For example, `2` means intends equal to half of tab height (`1.5em` indents for `3em` tab height). The default value for every stock tab height is equal to 4, for `Dense` is 2',
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
  'general.normalizeTooltips'(enable) {
    if (enable)
      GUI.wrapper.addEventListener('mouseover', Common.watchTooltips);
    else {
      GUI.wrapper.removeEventListener('mouseover', Common.watchTooltips);
      Common.watchTooltips({ cancel: true });
    }
  },

  /* --------------- */
  'general.tabsPlacement'(value, oldValue) {
    let
      className = 'right-sided-tabs';

    GUI.atomPane.dataset.tabsPosition = value;
    if (value == 'tree-view') {
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
        Helper
          .waitForProjectTreePanel()
          .then(moveTabsOverProjectTree);
      }

    } else if (oldValue == 'tree-view') {
      GUI.treeView.classList.remove(ROOT_CLASS);
      GUI.atomPane.classList.add(ROOT_CLASS);
      GUI.atomPane.insertAdjacentElement('afterBegin', GUI.wrapper);
    }
  },

  /* --------------- */
  'tab.height'(value) {
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
    // Finds a main pane
    GUI.atomPane = atom.workspace.getPanes()[0].element;

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
  // When package is deactivated
  deactivate() {
    GUI.atomPane.classList.remove(ROOT_CLASS);
    if (GUI.treeView)
      GUI.treeView.classList.remove(ROOT_CLASS);
    Controller['general.scrollTabs'](false);
    Controller['general.normalizeTooltips'](false);
    GUI.atomPane.insertAdjacentElement('afterBegin', GUI.tabContainer);
    GUI.wrapper.remove();
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
  // Tabs scroll
  scrollTabs(ev) {
    // Prevents scroll if tab scrolling is enabled and they don't fit the screen
    ev.preventDefault();

    // Defines the scroll direction
    let command = ev.deltaY > 0 ? 'pane:show-next-item' : 'pane:show-previous-item';
    atom.commands.dispatch(atom.views.getView(atom.workspace), command);
  },

  /* -------------------------------------------------------------------------------------------- */
  // Monitors tooltips and corrects their placement
  watchTooltips({target: el, cancel}) {

    console.log(el, cancel);

    // If cancel == true, cancelling everything and setting 'bottom' placement again;
    if (cancel) {
      let tabs = [...GUI.wrapper.querySelectorAll('li')];
      tabs.forEach(el => {
        let tooltip = atom.tooltips.findTooltips(el)[0];
        if (tooltip) tooltip.options.placement = 'bottom';
      });
      return;
    }

    // Looks for root tab element
    if (el.tagName != 'LI') {
      let closest = el.closest('LI');
      if (closest) el = closest; else return;
    }

    // Tabs without .texteditor class can't have tooltips
    if (!el.classList.contains('texteditor')) return;

    let
      getTooltips = () => atom.tooltips.findTooltips(el),
      hasTooltip = () => getTooltips().length > 0,
      isUpdateNeeded = true,
      tooltipPlacement;

    // Find the right tooltip direction
    {
      let tabsPlacement = atom.config.get(`vertical-tabs-plus.general.tabsPlacement`);
      if (tabsPlacement == 'tree-view') {
        let hasTabs = (side) => atom.workspace[side]().element.querySelector(`.${ROOT_CLASS}`);
        tabsPlacement = (hasTabs('getLeftDock'))
          ? 'left'
          : (hasTabs('getRightDock'))
            ? 'right'
            : false;
      }
      tooltipPlacement = (tabsPlacement == 'left')
        ? 'right'
        : (tabsPlacement == 'right')
          ? 'left'
          : 'bottom';
    }

    if (hasTooltip()) {
      let [tooltip] = atom.tooltips.findTooltips(el);
      isUpdateNeeded = (tooltip.options.placement != tooltipPlacement);
    }

    if (isUpdateNeeded) {
      Helper.waitForResult({
        pauseBetweenAttempts: 20,
        attemptCount:         100,
      }, (done, next) => {
        // Looking for tooltip
        if (hasTooltip()) done(); else next();
      }, () => {
        // When tooltip is found, change its position
        let [tooltip] = atom.tooltips.findTooltips(el);
        tooltip.options.placement = tooltipPlacement;
      });
    }
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
    let isCustomHeight = (atom.config.get(`vertical-tabs-plus.tab.height`) == 'custom');
    return isCustomHeight;
  },

  /* --------------- */
  waitForProjectTreePanel(callback) {
    return new Promise((resolveMainPromise, rejectMainPromise) => {
      // Forces project tree to appear
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');

      Helper.waitForResult({
        attemptCount:         10,
        pauseBetweenAttempts: 50,
      }, (done, next) => {
        // Looks for panel
        GUI.treeView = document.querySelector('.tool-panel.tree-view');

        if (GUI.treeView) done(); else next();
      }, () => {
        resolveMainPromise();
      }, () => {

        // Sets default tab placement
        atom.config.set(
          'vertical-tabs-plus.general.tabsPlacement',
          atomConfig.tabsPlacement.default
        );

        atom.notifications.addError(
          'Failed to move tabs',
          { detail: 'Can\'t move tabs to the project tree' }
        );

        rejectMainPromise();
      });

    });
  },

  /* --------------- */
  waitForResult(options, func, onSuccess, onFail) {
    let
      curr = 0,
      interval = setInterval(() => {

        return new Promise(func)

          // If func resolves promise, clear timer and call onSuccess()
          .then(() => {
            clearInterval(interval);
            if (typeof onSuccess == 'function') onSuccess();
          })

          // If func rejects promise, try again or (when the attemps limit is reached) call onFail()
          .catch(() => {
            if (curr == options.attemptCount) {
              clearInterval(interval);
              if (typeof onFail == 'function') onFail();
            }
            curr++;
          });

      }, options.pauseBetweenAttempts);

  },
};

/* =============================================================================================== */

export default {
  config:     atomConfig,
  activate:   Common.activate,
  deactivate: Common.deactivate,
};
