# Changelog

#### 2.3.0-nightly (13 Nov 2017)
* Settings are grouped now. Due to that they all are resetted to the default values but they're not lost, Atom still shows old values in the package settings so they can be restored manually.
* Small fixes and internal changes
* [More soon]

## 2.2.0 (10 Nov 2017)
* Fixed package crash when a new window opened with the `Over tree view` tabs placement chosen (tabs may blink while waiting for the project tree pane since it's hidden in new windows by default);
* Fixed problems with scrolling when tabs don't fit the screen and switching tabs by scrolling option is enabled;
* Tabs don't displace project tree when there are too many tabs (they can take 60% of height by default, can be changed in settings).

#### 2.1.1 (09 Nov 2017)
* Added scrollbar for tabs when they don't fit the screen.

## 2.1.0 (09 Nov 2017)
* Added an ability to customize tab height and intends manually;
* Fixed bugs with shrinking tabs down to 0px with the `Over tree view` tabs placement chosen.

## 2.0.0 (08 Nov 2017)
* Completely rewritten styles and code, still based on the original tiger4th's package;
* Corrected small interface flaws like weird space between tabs, 1px shift when dragging tabs, missing left border for a first tab, double borders in other places and so on;
* Added an ability to switch tabs by scrolling (inspired by the same named option of the Vivaldi browser);
* Tabs can be placed over the projects folders (a.k.a. tree view). It's still beta so there can be bugs (like described below);
* Works best with the default theme (One Light/Dark) but should work with other themes too. Is tested with [Nord](https://atom.io/themes/nord-atom-ui) and [Material](https://atom.io/themes/atom-material-ui) themes;
* It's the first release of this forked package so there still can be bugs and flaws.

### Known bugs:
* Some special tabs like Settings or About can't be moved when the `Over tree view` tabs placement is chosen. Instead or sorting, tab just docks near the tree view (other tabs don't have that problem since they can't be docked). Currently I have no idea how to fix that but you can press `Esc` if you accidentally dragged the tab and didn't release mouse button yet.
* Tab switching with scrolling doesn't work when the main pane (e.g. code editor) isn't focused.

