# Changelog

#### 2.3.5 (12 Mar 2018)
* **Fixed:** The package didn't process error properly in case of failed attaching tabs to project tree

#### 2.3.4 (24 Nov 2017)
* **Fixed:** Max tab container height didn't work properly with multiple panes.

#### 2.3.3 (22 Nov 2017)
* **Improved:** `Fix Tooltips Placement` doesn't show tooltips in wrong direction anymore. This option looks more or less stable now;
* **Improved:** Better changelog design.

#### 2.3.2 (21 Nov 2017)
* **Improved:** The `Over project tree` tab position is stable now, tabs like Settings or Diagnostics can be moved and sorted safely as they won't try to dock anymore;
* **Fixed:** The close button became narrow when tab has long title.

#### 2.3.1 (19 Nov 2017)
* **Improved:** The `Tab scroll` option is stable and works independently on focused pane;
* **Fixed:** Multiple panes are supported now. They were supported in the original package so technically it's just a bug fix;
* **Fixed:** Some tabs didn't show tooltips properly with `Fix Tooltips Placement` option enabled.

## 2.3.0 (14 Nov 2017)
* **Improved:** Redesigned settings menu, options are grouped now;
* **Fixed** some trifles, internal changes;
* **Added** an experimental ability to fix tooltip placement. By default it's displayed below tabs that doesn't look right for vertical tabs and this option moves tooltips to the right of the tab instead of below it (or to the left when the tabs are on the right side). This option is experimental and not really stable because there's no way to inject into the "tabs" package and change behaivor of tooltips so it tries to intercept tooltips before they're displayed instead. This is the best way that I could think of. Tooltips still appear below tabs if you move cursor too quick before they were displayed for the first time.  
The idea [is suggested by kreba](https://github.com/tiger4th/vertical-tabs/issues/19).

## 2.2.0 (10 Nov 2017)
* **Added** a new option to control how much space tabs can take when placed over project tree (60% by default);
* **Fixed** package crash when a new window opened with the `Over project tree` tabs placement chosen (tabs may blink while waiting for the project tree pane since it's hidden in new windows by default);
* **Fixed** problems with scrolling when tabs don't fit the screen and switching tabs by scrolling option is enabled;

#### 2.1.1 (09 Nov 2017)
* **Fixed:** Scrollbar didn't show tabs when they don't fit the screen.

## 2.1.0 (09 Nov 2017)
* **Added** an ability to customize tab height and intends manually;
* **Fixed** bugs with shrinking tabs down to 0px with the `Over project tree` tabs placement chosen.

## 2.0.0 (08 Nov 2017)
* Completely rewritten styles and code, still based on the original tiger4th's package;
* Corrected small interface flaws like weird space between tabs, 1px shift when dragging tabs, missing left border for a first tab, double borders in other places and so on;
* Added an ability to switch tabs by scrolling (inspired by the same named option of the Vivaldi browser);
* Tabs can be placed over the projects folders (a.k.a. tree view). It's still beta so there can be bugs;
* Works best with the default theme (One Light/Dark) but should work with other themes too. Is tested with [Nord](https://atom.io/themes/nord-atom-ui) and [Material](https://atom.io/themes/atom-material-ui) themes;
* It's the first release of this forked package so there still can be bugs and flaws.

#### 0.1.0 - 1.0.5
* Original package development by tiger4th, the changelog is [available on GitHub](https://github.com/tiger4th/vertical-tabs/blob/v1.0.5/CHANGELOG.md)