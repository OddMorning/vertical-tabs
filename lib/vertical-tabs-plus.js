'use babel';

const
  ROOT_CLASS = 'vertical-tabs-plus',
  WRAPPER_CLASS = 'vtabs-wrapper';

let
  GUI, Data, Common, Controller, Helper;

import {default as atomConfig} from './config';

/* ============================================================================================= */

// Config controller (when options get enabled, disabled, or changed)
Controller = {
  'general.scrollTabs'(enable) {
    Helper.forEachWrapper(wrapper => {
      if (enable)
        wrapper.addEventListener('wheel', Common.scrollTabs);
      else
        wrapper.removeEventListener('wheel', Common.scrollTabs);
    });
  },

  /* --------------- */
  'general.normalizeTooltips'(enable) {
    Helper.forEachWrapper(wrapper => {
      if (enable)
        wrapper.addEventListener('mouseover', Common.watchTooltips);
      else {
        wrapper.removeEventListener('mouseover', Common.watchTooltips);
        Common.watchTooltips({ cancel: true });
      }
    });
  },

  // /* --------------- */
  // // Experiments with horizontal panes
  // 'general.tabsPlacement'(value, oldValue) {
  //   let
  //     className = 'right-sided-tabs',
  //     isPaneHorizontal = pane => pane.matches('.horizontal > .pane');
  // 
  //     // moveTab, moveTabsOverProjectTree, enableProjectTreeMode;
  // 
  //   if (value == 'tree-view') {
  //     GUI.treeView.classList.add(ROOT_CLASS);
  // 
  //     Helper.forEachPane((pane, id) => {
  //       let moveTabsOverProjectTree = () => {
  //         delete pane.dataset.tabsPosition;
  //         pane.classList.remove(ROOT_CLASS);
  //         GUI.treeView.lastElementChild.insertAdjacentElement('beforeBegin', GUI.wrappers[id]);
  //       };
  // 
  //       if (GUI.treeView) {
  //         moveTabsOverProjectTree();
  //       } else {
  //         Helper
  //           .waitForProjectTreePanel()
  //           .then(moveTabsOverProjectTree);
  //       }
  //     });
  //   } else if (oldValue == 'tree-view') {
  //     GUI.treeView.classList.remove(ROOT_CLASS);
  // 
  //     Helper.forEachPane((pane, id) => {
  //       pane.classList.add(ROOT_CLASS);
  //       pane.insertAdjacentElement('afterBegin', GUI.wrappers[id]);
  //     });
  //   }
  // 
  // 
  // 
  // 
  // 
  // 
  //   enableProjectTreeMode = (enable) => {
  //     if (enable) {
  //       GUI.treeView.classList.add(ROOT_CLASS);
  //     } else {
  //       GUI.treeView.classList.remove(ROOT_CLASS);
  // 
  //       Helper.forEachPane((pane, id) => {
  //         pane.classList.add(ROOT_CLASS);
  //         pane.insertAdjacentElement('afterBegin', GUI.wrappers[id]);
  //       });
  //     }
  //   };
  // 
  //   movePaneTabsOverProjectTree = (pane, toProjectTree) => {
  //     if (toProjectTree) {
  //       delete pane.dataset.tabsPosition;
  //       pane.classList.remove(ROOT_CLASS);
  // 
  //       // lastElementChild needs for multi panes. Last child is the tree-view itself
  //       // Not Helper.forEachWrapper because of tabs order.
  //       // ForEachPane uses API, forEachWrapper uses the package storage.
  //       GUI.treeView.lastElementChild.insertAdjacentElement('beforeBegin', GUI.wrappers[id]);
  //     } else {
  //       pane.classList.add(ROOT_CLASS);
  //       pane.insertAdjacentElement('afterBegin', GUI.wrappers[id]);
  //     }
  //   };
  // 
  //   moveTab = (direction) => {
  //     if (value == 'tree-view') {
  //     }
  // 
  //   };
  // 
  //   Helper.forEachPane(pane => {
  //     pane.dataset.tabsPosition = value;
  //   });
  // 
  //   if (value == 'tree-view') {
  //     let moveTabsOverProjectTree = () => {
  //       Helper.forEachPane((pane, id) => {
  //         delete pane.dataset.tabsPosition;
  //         pane.classList.remove(ROOT_CLASS);
  // 
  //         if (isPaneHorizontal(pane))
  //           return;
  // 
  //         // lastElementChild needs for multi panes. Last child is the tree-view itself
  //         // Not Helper.forEachWrapper because of tabs order.
  //         // ForEachPane uses API, forEachWrapper uses the package storage.
  //         GUI.treeView.lastElementChild.insertAdjacentElement('beforeBegin', GUI.wrappers[id]);
  //       });
  // 
  //       GUI.treeView.classList.add(ROOT_CLASS);
  //     };
  // 
  //     // Project tree view in case if tabs are going to be placed there.
  //     // It's in init section not to make tabs blink when project tree is visible.
  //     // It's here too not to make package crash when new window is created
  //     // (Projcet tree is hidden there by default).
  //     if (GUI.treeView) {
  //       moveTabsOverProjectTree();
  //     } else {
  //       Helper
  //         .waitForProjectTreePanel()
  //         .then(moveTabsOverProjectTree);
  //     }
  // 
  //   } else if (oldValue == 'tree-view') {
  //     GUI.treeView.classList.remove(ROOT_CLASS);
  // 
  //     Helper.forEachPane((pane, id) => {
  //       pane.classList.add(ROOT_CLASS);
  //       pane.insertAdjacentElement('afterBegin', GUI.wrappers[id]);
  //     });
  //   }
  // },


  /* --------------- */
  'general.tabsPlacement'(value, oldValue) {
    let
      className = 'right-sided-tabs',
      isPaneHorizontal = pane => pane.matches('.horizontal > .pane');

    Helper.forEachPane(pane => {
      pane.dataset.tabsPosition = value;
    });

    if (value == 'tree-view') {
      let moveTabsOverProjectTree = () => {
        Helper.forEachPane((pane, id) => {
          let wrapper = GUI.wrappers[id];
          delete pane.dataset.tabsPosition;
          pane.classList.remove(ROOT_CLASS);

          // Detects tab moving when tabs are over project tree
          if (!wrapper._hasClickListener) {
            GUI.wrappers[id].addEventListener('mousedown', Common.onWrapperClick);
            wrapper._hasClickListener = true;
          }

          // lastElementChild needs for multi panes. Last child is the tree-view itself
          GUI.treeView.lastElementChild.insertAdjacentElement('beforeBegin', GUI.wrappers[id]);
        });

        GUI.treeView.classList.add(ROOT_CLASS);
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

      Helper.forEachPane((pane, id) => {
        pane.classList.add(ROOT_CLASS);
        pane.insertAdjacentElement('afterBegin', GUI.wrappers[id]);

        // Removes the click listener
        GUI.wrappers[id].removeEventListener('mousedown', Common.onWrapperClick);
        delete GUI.wrappers[id]._hasClickListener;
      });
    }
  },

  /* --------------- */
  'tab.height'(value) {
    if (value == 'custom') {
      let get = param => atom.config.get(`vertical-tabs-plus.${param}`);
      Controller['tab.customHeight'](get('tab.customHeight'));
      Controller['tab.customIndent'](get('tab.customIndent'));
    } else {
      Helper.forEachWrapper(wrapper => {
        Helper.CSSvar(wrapper, 'tab-height', value);

        // Bigger sides intent for dense tabs
        let extraPadding = (value == '2em') ? '2' : false;
        Helper.CSSvar(wrapper, 'tab-padding-multiplier', extraPadding);
      });
    }
  },

  /* --------------- */
  'tab.customHeight'(value) {
    if (Helper.isCustomHeightEnabled())
      Helper.forEachWrapper(wrapper => {
        Helper.CSSvar(wrapper, 'tab-height', Helper.normalizeNumber(value));
      });
  },

  /* --------------- */
  'tab.customIndent'(value) {
    if (Helper.isCustomHeightEnabled())
      Helper.forEachWrapper(wrapper => {
        Helper.CSSvar(wrapper, 'tab-padding-multiplier', value);
      });
  },

  /* --------------- */
  'tabContainer.minWidth'(value) {
    Helper.forEachWrapper(wrapper => {
      Helper.CSSvar(wrapper, 'min-tab-width', Helper.normalizeNumber(value));
    });
  },

  /* --------------- */
  'tabContainer.maxWidth'(value) {
    Helper.forEachWrapper(wrapper => {
      Helper.CSSvar(wrapper, 'max-tab-width', Helper.normalizeNumber(value));
    });
  },

  /* --------------- */
  'tabContainer.maxHeight'(value) {
    Helper.forEachWrapper(wrapper => {
      Helper.CSSvar(wrapper, 'max-tab-container-height', `${value}%`);
    });
  },
};

/* =============================================================================================== */

Data = {
  listeners: {},
};

GUI = {
  treeView: null,
  panes:    {},
  wrappers: {},
};

/* =============================================================================================== */

Common = {
  // When package is activated
  activate() {
    let ws = atom.workspace.getCenter();

    // Get current panes
    ws.getPanes().forEach(pane => Common.onNewPane(pane, true));

    // Add and store pane listeners
    Data.listeners = {
      onNewPane:     ws.onDidAddPane(ev => Common.onNewPane(ev.pane)),
      onDestroyPane: ws.onWillDestroyPane(ev => Common.onWillDestroyPane(ev.pane)),
    };

    // Tree view in case if tabs should be injected there
    GUI.treeView = document.querySelector('.tool-panel.tree-view');

    // Makes settings alive
    Common.makeSettingsAlive();
  },

  /* -------------------------------------------------------------------------------------------- */
  // When package is deactivated
  deactivate() {
    Data.listeners.onNewPane.dispose();
    Data.listeners.onDestroyPane.dispose();

    if (GUI.treeView)
      GUI.treeView.classList.remove(ROOT_CLASS);

    Controller['general.scrollTabs'](false);
    Controller['general.normalizeTooltips'](false);

    // Common.reloadTooltips('bottom');

    Helper.forEachPane((pane, id) => {
      let tabContainer = GUI.wrappers[id].querySelector('.tab-bar');
      pane.classList.remove(ROOT_CLASS);
      pane.insertAdjacentElement('afterBegin', tabContainer);
      Common.onWillDestroyPane({id});
    });
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
  // When new text editor pane is added
  onNewPane(paneData, areWrappersNotReady) {
    let
      {id} = paneData,
      pane = paneData.element,
      tabContainer = pane.querySelector('.tab-bar'),
      wrapper;

    GUI.panes[id] = paneData;

    // Creating a wrapper for tab container to manupulate them in DOM with less problems
    wrapper = document.createElement('div');
    wrapper.classList.add(WRAPPER_CLASS);
    wrapper.appendChild(tabContainer);
    wrapper.dataset.paneId = id;
    pane.insertAdjacentElement('afterBegin', wrapper);
    GUI.wrappers[id] = wrapper;

    // Sets own class
    pane.classList.add(ROOT_CLASS);

    // Fixes tooltips direction
    // Common.reloadTooltips();

    // Reprocess all tab containers
    if (!areWrappersNotReady)
      Helper.reloadConfig();
  },

  /* -------------------------------------------------------------------------------------------- */
  // When a pane is going to be destroyed
  onWillDestroyPane({id}) {
    let wrapper = GUI.wrappers[id];
    wrapper.remove();
    if (wrapper._placeholder)
      wrapper._placeholder.remove();
    delete GUI.wrappers[id];
    delete GUI.panes[id];
  },

  /* -------------------------------------------------------------------------------------------- */
  // Tabs scroll
  scrollTabs(ev) {
    ev.preventDefault();

    let
      wrapper = ev.target.closest(`.${WRAPPER_CLASS}`),
      pane = GUI.panes[+wrapper.dataset.paneId],
      scrollUp = ev.deltaY < 0;

    if (scrollUp)
      pane.activatePreviousItem();
    else
      pane.activateNextItem();
  },

  /* -------------------------------------------------------------------------------------------- */
  // // Controls tooltips (a bunch of wasted time because this code doesn't hide stock tooltips :( )
  // reloadTooltips(forcedDirection) {
  //   let
  //     ws = atom.workspace.getCenter(),
  //     panes = ws.getPanes(),
  //     tabsPlacement = Helper.getAbsoluteTabsPlacement(),
  //     tabsSide = {
  //       left:  (tabsPlacement == 'left'),
  //       right: (tabsPlacement == 'right'),
  //     },
  //     tooltipDirection
  //       = forcedDirection || (tabsSide.left ? 'right' : tabsSide.right ? 'left' : 'bottom');
  // 
  //   // Helper.forEachWrapper(wrapper => {
  //   //   let
  //   //     id = +wrapper.dataset.paneId,
  //   //     tabs = [...wrapper.querySelectorAll('.tab')];
  //   // 
  //   //   tabs.forEach((tab, tabID) => {
  //   //     let tooltips = atom.tooltips.findTooltips(tab);
  //   // 
  //   //     if (tooltips.length) {
  //   //       tooltips[0].options.placement = tooltipDirection;
  //   //       console.log('Existing tooltip:', tooltips[0]);
  //   //     } else {
  //   //       console.log('New tooltip! --', tab);
  //   //       let
  //   //         [pane] = panes.filter(pane => pane.id == id),
  //   //         textEditor = pane.items[tabID],
  //   //         title = textEditor.getPath ? textEditor.getPath() : null;
  //   // 
  //   //       atom.tooltips.add(tab, {
  //   //         placement: tooltipDirection,
  //   //         html:      false,
  //   //         delay:     {
  //   //           show: 1000,
  //   //           hide: 100,
  //   //         },
  //   //         title,
  //   //       });
  //   //       console.log('New tooltip!', title, textEditor);
  //   //     }
  //   //   });
  //   // });
  // },

  /* -------------------------------------------------------------------------------------------- */
  // On tab click when it's above project tree.
  // Generally it just allows to sort tabs like Settings, Timecop and so on.
  onWrapperClick(ev) {
    // Looks for the clicked tab element
    let el = ev.target.matches('.tab') ? ev.target : ev.target.closest('.tab');
    if (!el) return;

    let
      isTabSafe = (el.dataset.type == 'TextEditor'),
      isDragging = false,
      onDragStart,
      onDragEnd,
      writeFixedPosition,
      applyFixedPosition,
      removalTabWatcher;

    // Do this trick for dockable tabs only. TextEditor are already "safe" for dragging
    if (isTabSafe) return;

    // Store position to temporary variables
    writeFixedPosition = (el) => {
      let {top, left, width, height} = el.getBoundingClientRect();
      el._vtabs_top = `${top}px`;
      el._vtabs_left = `${left}px`;
      el._vtabs_width = `${width}px`;
      el._vtabs_height = `${height}px`;
    };

    // Applies positions
    applyFixedPosition = (el) => {
      el.style.top = el._vtabs_top;
      el.style.left = el._vtabs_left;
      el.style.width = el._vtabs_width;
      el.style.height = el._vtabs_height;
      el.style.position = 'fixed';
      delete el._vtabs_top;
      delete el._vtabs_left;
      delete el._vtabs_width;
      delete el._vtabs_height;
    };

    // When tab statred to be dragged
    onDragStart = (tabEl) => {
      let
        treeViewRoot = GUI.treeView.querySelector('.tree-view-root'),
        tempWrapper = document.createElement('div');

      // Make temporary wrapper that's placed outside docks
      tempWrapper.classList.add(ROOT_CLASS);
      tempWrapper.classList.add('tree-view');
      tempWrapper.classList.add('tree-view-emulation');
      atom.workspace.element.insertAdjacentElement('beforeEnd', tempWrapper);
      GUI.tempWrapper = tempWrapper;

      // Store positions to temporary variables
      writeFixedPosition(treeViewRoot);
      Helper.forEachWrapper(wrapper => {
        writeFixedPosition(wrapper);
      });

      // Makes everything fixed
      // forEachPane instead of forEachWrapper for the right order
      applyFixedPosition(treeViewRoot);
      Helper.forEachPane((pane, id) => {
        let
          wrapper = GUI.wrappers[id],
          placeholder = document.createComment('');

        // Placeholder
        wrapper._placeholder = placeholder;
        wrapper.replaceWith(placeholder);

        // Move wrapper to temporary wrapper
        // tempWrapper.insertAdjacentElement('afterBegin', wrapper);
        tempWrapper.appendChild(wrapper);

        // Makes wrapper fixed
        applyFixedPosition(wrapper);
      });

      // When a tab is moved from one tab wrapper to another, its element gets removed,
      // will never lose the .is-dragging class and and the onDragEnd event will never be called.
      // So we have to watch tab removal for that case.
      removalTabWatcher = Helper.onNodeRemoved(tabEl, onDragEnd);
    };

    // When tab stopped being dragged
    onDragEnd = () => {
      let timeout = 10;

      // A little pause is needed to make sure the tab is "landed"
      setTimeout(() => {
        let
          treeViewRoot = GUI.treeView.querySelector('.tree-view-root'),
          unfixElement;

        // Removes styles
        unfixElement = (el) => {
          el.style.top = null;
          el.style.left = null;
          el.style.width = null;
          el.style.height = null;
          el.style.position = null;
        };

        // Restores styles of wrappers and tree-view
        unfixElement(treeViewRoot);
        Helper.forEachWrapper(wrapper => {
          let placeholder = wrapper._placeholder;

          if (placeholder) {
            // When tab is moved outside tab wrapper, it automatically moves to the "home"
            // so placeholder is not needed as it ruins the wrappers order
            if (placeholder.parentElement != wrapper.parentElement)
              placeholder.replaceWith(wrapper);

            // Remove placeholder
            placeholder.remove();
            delete wrapper._placeholder;
          }

          // Remove fixed element positioning
          unfixElement(wrapper);
        });

        // Removes temp wrapper
        if (GUI.tempWrapper) {
          GUI.tempWrapper.remove();
          delete GUI.tempWrapper;
        }
      }, timeout);
    };

    // mousedown, mousemove, and mouseup don't work good. So doing weird stuff.
    // It calls onDragStart() when ".is-dragging" class is added and onDragEnd() when removed.
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName != 'class') return;

        let hasDraggingClass = mutation.target.classList.contains('is-dragging');

        if (!isDragging && hasDraggingClass) {
          isDragging = true;
          onDragStart(mutation.target);
        } else if (isDragging && !hasDraggingClass) {
          // Tab is successfully moved, no need to watch its removal
          removalTabWatcher.disconnect();
          isDragging = false;
          onDragEnd(mutation.target);
          observer.disconnect();
        }
      });
    });

    observer.observe(el, { attributes: true });
  },

  /* -------------------------------------------------------------------------------------------- */
  // Monitors tooltips and corrects their placement
  watchTooltips({target: el, cancel}) {

    // If cancel == true, cancelling everything and setting 'bottom' placement again;
    if (cancel) {
      Helper.forEachWrapper(wrapper => {
        let tabs = [...wrapper.querySelectorAll('li')];
        tabs.forEach(el => {
          let tooltip = atom.tooltips.findTooltips(el)[0];
          if (tooltip) tooltip.options.placement = 'bottom';
        });
      });
      return;
    }

    // Looks for root tab element
    if (el.tagName != 'LI') {
      let closest = el.closest('LI');
      if (closest) el = closest; else return;
    }

    let
      getTooltips = () => atom.tooltips.findTooltips(el),
      hasTooltip = () => getTooltips().length > 0,
      isUpdateNeeded = true,
      tooltipDirection;

    // Finds the right tooltip direction
    {
      let
        tabsPlacement = Helper.getAbsoluteTabsPlacement(),
        tabsSide = {
          left:  (tabsPlacement == 'left'),
          right: (tabsPlacement == 'right'),
        };

      tooltipDirection = tabsSide.left ? 'right' : tabsSide.right ? 'left' : 'bottom';
    }

    if (hasTooltip()) {
      let [tooltip] = atom.tooltips.findTooltips(el);
      isUpdateNeeded = (tooltip.options.placement != tooltipDirection);
    }

    if (isUpdateNeeded) {
      Helper.waitForResult({
        pauseBetweenAttempts: 20,
        attemptCount:         100,
      }, (done, next) => {
        // Looking for a tooltip
        if (hasTooltip()) done(); else next();
      }, () => {
        // When tooltip is found, change its position
        let [tooltip] = atom.tooltips.findTooltips(el);
        tooltip.options.placement = tooltipDirection;
      });
    }
  },
};


/* =============================================================================================== */

Helper = {
  // Sets and gets CSS variables
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
  // Turns numbers into "em"s
  normalizeNumber(value) {
    return Number.isNaN(+value) ? value : `${value}em`;
  },

  /* --------------- */
  // "forEach" for object
  forEachOf(e, callback, includeHidden) {
    if (includeHidden) Object.getOwnPropertyNames(e).forEach(key => { callback(key, e[key], e); });
    else for (let key in e) if (e.hasOwnProperty(key)) callback(key, e[key], e);
  },

  /* --------------- */
  // Calls onSuccess when func is resolved after N attempts
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

  /* --------------- */
  // Calls onDetachCallback when element is removed from DOM.
  // Improved version of https://stackoverflow.com/a/32726412
  onNodeRemoved(element, onDetachCallback) {
    let observer = new MutationObserver(() => {
      let isDetached = el => {
        let parent = el.parentNode;
        return (parent === document) ? false
          : (parent === null) ? true
            : isDetached(parent);
      };
      if (isDetached(element)) {
        observer.disconnect();
        onDetachCallback();
      }
    });

    observer.observe(document, { childList: true, subtree: true });
    return observer;
  },

  /* =============== */

  /* --------------- */
  // Processes every available pane
  forEachPane(callback) {
    atom.workspace.getCenter().getPanes().forEach(({element, id}) => {
      callback(element, id);
    });
  },

  /* --------------- */
  // Processes every available wrapper (use forEachPane if the right pane order is required)
  // ForEachPane uses Atom API, forEachWrapper uses the package storage.
  forEachWrapper(callback) {
    Helper.forEachOf(GUI.wrappers, (id, wrapper) => {
      callback(wrapper, id);
    });
  },

  /* --------------- */
  // Reloads and reapplies every config option
  reloadConfig() {
    for (let option in Controller) {
      if (!Controller.hasOwnProperty(option)) continue;

      Controller[option](atom.config.get(`vertical-tabs-plus.${option}`), null);
    }
  },

  /* --------------- */
  // If custom tabs height is enabled
  isCustomHeightEnabled(value) {
    let isCustomHeight = (atom.config.get(`vertical-tabs-plus.tab.height`) == 'custom');
    return isCustomHeight;
  },

  /* --------------- */
  // Waits for project tree panel. It's hidden when a new window is opened
  waitForProjectTreePanel(callback) {
    return new Promise((resolveMainPromise, rejectMainPromise) => {
      // Forces project tree to appear
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');

      this.waitForResult({
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
  // Gets project tree placement. Is needed for calculating tabs tooltip placement
  getTreeViewPlacement() {
    let
      hasTreeView = (side) => atom.workspace[side]().element.querySelector('.tree-view'),
      onLeft = hasTreeView('getLeftDock'),
      onRight = hasTreeView('getRightDock');

    return onLeft ? 'left' : onRight ? 'right' : false;
  },

  /* --------------- */
  // Gets tabs placement no matter what "tabs placement" option is chosen
  getAbsoluteTabsPlacement() {
    let tabsPlacement = atom.config.get(`vertical-tabs-plus.general.tabsPlacement`);
    if (tabsPlacement == 'tree-view')
      tabsPlacement = this.getTreeViewPlacement();

    return tabsPlacement;
  },
};

/* =============================================================================================== */

export default {
  config:     atomConfig,
  activate:   Common.activate,
  deactivate: Common.deactivate,
};
