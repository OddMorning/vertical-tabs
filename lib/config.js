'use babel';

export default {
  general: {
    type:       'object',
    order:       1,
    properties: {
      tabsPlacement: {
        title:   'Tabs Placement',
        type:    'string',
        default: 'right',
        enum:    [
          {value: 'left', description: 'Left'},
          {value: 'right', description: 'Right'},
          {value: 'tree-view', description: 'Over project tree'},
        ],
        order:   1,
      },
      scrollTabs: {
        title:       'Scroll Tabs',
        type:        'boolean',
        default:     true,
        description: 'Change active tab by mouse wheel over tabs',
        order:       2,
      },

      // forcedVTabs: {
      //   title:       'Force vertical tabs for splitted panes',
      //   type:        'boolean',
      //   default:     false,
      //   description: '**Off**: tabs stay horizontal when the workspace is splitted horizontally for the sake of saving space.\n\n**On**: tabs become vertical for every pane. Can be useful for huge screens.',
      //   order:       3,
      // },

      normalizeTooltips: {
        title:       'Fix Tooltips Placement (Experimental)',
        type:        'boolean',
        default:     true,
        description: 'Moves tab tooltips to side. This option looks stable but if you\'re having some kind of issues like freezes when moving cursor over tabs or whatever, turn it off',
        order:       4,
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