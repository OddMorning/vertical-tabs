# Vertical Tabs Plus package
Makes tabs vertical. Fork from tiger4th's vertical-tabs package.

## Features

### Switch tabs by scrolling
Move cursor over tabs and switch between them using scroll wheel. Inspired by the same named option of the Vivaldi browser.

### Tabs placement: left, right, above tree view
Tabs can be placed on either left or right side of the main pane. It's also possible to shelter them above the project tree view not to waste much space (inspired by Adobe Brackets interface).

### Customizable tab width and height
Vertical tabs are not hosintal tabs so it makes sense to adjust their sizes manually. When Atom 1.17 has been released, the default theme ("One") got tiny tabs. Some people liked it, some were looking for the way to bring spacious tabs back and made a number of custom styles. One more reason why this option is more important than it seems :)  
Tab width is also customizable or, more accurately, its limits are. Atom adjusts tab width itself all the time, this package just set min and max values.

## Why forked?
Originally I had a bunch of custom styles that were fixing weird things in the original package like space under each tab and wrong styles that are used to be actual for vertical tabs only (extra border on each left tab side except the first one, double borders at the bottom of the tab container, etc.). Then I put some own code into the init script file to switch between tabs with scroll wheel (blame Vivaldi and QTTabBar, they made me love it). Later I completely rewrote styles, added custimizable tab height (via LESS variable) and vertical tabs stopped look weird when themes like Material are used. And then I found a way to move tabs over the project tree view what required even more JS code. So I moved everything to a separate package.

There are too many changes for a single pull request but it's still based on the tiger4th's package so I decided to fork it. Well, people fork projects for purposes like this so why not?

The difference from the original package:
* Works well with "Material" theme, other themes shouldn't break it either (at the time of development is tested with "[One](https://atom.io/themes/one-light-ui)", "[Nord](https://atom.io/themes/nord-atom-ui)", and "[Material](https://atom.io/themes/atom-material-ui)");
* No missing or extra borders (in case if you care about interface up to 1px lines);
* Replaced fixed tabs width with `min` and `max` values;
* Customizable tab height;
* Extra features.

## Why 2.0.0, not 0.1.0?
Because it's a forked project and versions up to 1.0.5 are already taken by the original package:
```
npm ERR! Command failed: git -c core.longpaths=true tag v0.1.0 -am Prepare 0.1.0 release
npm ERR! fatal: tag 'v0.1.0' already exists
```

## Known bugs:
* When sorting tabs, they try to be placed _above_ a tab under the cursor if the cursor is over left side of tab container. As they try to be placed _under_ a tab for the right tab container side. It's natural behavior for horizontal tabs but looks weird for vertical one. Sadly it's a not fixable problem;
* When `Fix Tooltips Placement` is enabled, tooltips still can be displayed at the old position when you quickly move the cursor over new tabs. That's because they display too quick, right before this package changes their placement value from `bottom` to `left` or `right`. It's possible to render own tooltips but it's impossible to prevent originall ones from displaying. So that problem also looks untreatable.

## Screenshots
Tabs on the left side:
![](https://github.com/OddMorning/vertical-tabs-plus/raw/master/screenshots/left.png)

Tabs on the right side:
![](https://github.com/OddMorning/vertical-tabs-plus/raw/master/screenshots/right.png)

Tabs above project folders:
![](https://github.com/OddMorning/vertical-tabs-plus/raw/master/screenshots/embedded.png)