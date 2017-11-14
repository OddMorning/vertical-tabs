# Changelog

#### 2.3.1-nightly (14 Nov 2017)
* `Tab scroll` is fixed and works right independently on focused pane.

## 2.3.0 (14 Nov 2017)
* Redesigned settings menu, options are grouped now;
* Small fixes and internal changes;
* Added an experimental ability to fix tooltip placement. By default it's displayed below tabs that doesn't look right for vertical tabs and this option moves tooltips to the right of the tab instead of below it (or to the left when the tabs are on the right side). This option is experimental and not really stable because there\'s no way to inject into the "tabs" package and change behaivor of tooltips so it tries to intercept tooltips before they\'re displayed instead. This is the best way that I could think of. Tooltips still appear below tabs if you move cursor too quick before they were displayed for the first time.  
The idea [is suggested by kreba](https://github.com/tiger4th/vertical-tabs/issues/19).

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
* Tabs can be placed over the projects folders (a.k.a. tree view). It's still beta so there can be bugs;
* Works best with the default theme (One Light/Dark) but should work with other themes too. Is tested with [Nord](https://atom.io/themes/nord-atom-ui) and [Material](https://atom.io/themes/atom-material-ui) themes;
* It's the first release of this forked package so there still can be bugs and flaws.

#### 0.1.0 – 1.0.5
* Original package development by tiger4th, the changelog is [available on GitHub](https://github.com/tiger4th/vertical-tabs/blob/v1.0.5/CHANGELOG.md)

### Known bugs:
* Some special tabs like Settings or About can't be moved and sorted when the `Over tree view` tabs placement is chosen. Instead or sorting, tab just docks near the tree view (other tabs don't have that problem since they can't be docked). Currently I have no idea how to fix that but you can press `Esc` if you accidentally dragged the tab and didn't release a mouse button yet.
* When `Fix Tooltips Placement` is enabled, tooltips still can be displayed once at the old position when you quickly move the cursor over new tabs.
* Tabs work just for one pane, they stay horizontal with splitted panes. I have no idea how to handle that case so this is not really a bug.
