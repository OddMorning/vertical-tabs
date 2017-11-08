# Vertical Tabs Plus package
Makes tabs vertical. Fork from tiger4th's vertical-tabs package.

## Screenshots
![](https://github.com/OddMorning/vertical-tabs-plus/blob/master/screenshots/left.png)
![](https://github.com/OddMorning/vertical-tabs-plus/blob/master/screenshots/right.png)
![](https://github.com/OddMorning/vertical-tabs-plus/blob/master/screenshots/over-project-view.png)
![](https://github.com/OddMorning/vertical-tabs-plus/blob/master/screenshots/different-theme.png)

## Why forked?
Originally I had a bunch of custom styles that were fixing weird things in the original package like space under each tab and wrong styles that are used to be actual for vertical tabs only (extra border on each left tab side except the first one, double borders at the bottom of the tab container, etc.). Then I put some own code into the init script file to switch between tabs with scroll wheel (blame Vivaldi and QTTabBar, they made me love it). Later I completely rewrote styles and vertical tabs stopped look weird when themes like Material are used. And then found a way to move tabs over the project tree view and that required even more JS code. So I moved everything to a separate package.

There are too many changes for a single pull request but it's still based on the tiger4th's package so I decided to fork it. Well, people fork projects for purposes like this so why not?

## What's the difference?
* Works well with “Material” theme and should work with other themes too (at the time of development is tested with “One”, “Nord”, and “Material”);
* No missing or extra borders (in case if you care about interface up to 1px lines);
* Replaced fixed tabs width with `min` and `max` values;
* Customizable tab height;
* Extra features.

## Features

### Switch tabs by scrolling
Move cursor over tabs and switch between them using scroll wheel. Inspired by the same named option of the Vivaldi browser.

### Tabs placement: left, right, above tree view
Tabs can be placed on either left or right side of the main pane. It's also possible to shelter them above the project tree view not to waste much space (inspired by Adobe Brackets interface).

### Customizable tab width and height
Vertical tabs are not hosintal tabs so it makes sense to adjust their sizes manually. When Atom 1.17 has been released, the default theme ("One") got tiny tabs. Some people liked it, some were looking for the way to bring spacious tabs back and made a number of custom styles. One more reason why this option is more important than it seems :)  
Tab width is also customizable or, more accurately, its limits are. Atom adjusts tab width itself all the time, this package just set min and max values.