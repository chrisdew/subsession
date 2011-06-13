SubSession
----------

Tabs in browsers have given web users a new mental model which is at odds with how HTTP really works.

On some web sites it would be a good thing if tabs could have settings which persisted in that tab, but did not affect other tabs (on the same web site). 


Example:

A browser webmail app may have multiple accounts for a user.  Logging in enables access to all of those accounts (unlike gmail).  

If a user opens two tabs, and switches to a second account in the second tab, they may expect further links (on the second tab) to remuse their second account, while links in the first tab go to pages relevant to the primary account.

Furthermore, if they middle-click a link in their second tab, that 'child' tab should have some relation to the tab from which it was opened (i.e. use the same email account).


Other solutions:

The example above could be solved by putting the account id into the URL, i.e. http://www.cmail.com/chris@home.example.com and http://www.cmail.com/chris@work.example.com


Issues with the URL solution:

1. Scaling - if your have a half-dozen tab-specific settings your URLs will get very ugly.
2. Tidyness - once you have decided to use a URLised setting, it must appear in *all* urls, otherwise the setting will be lost when navigating through pages which do not include the setting in their URL.  This http://www.cmail.com/myBookmarks will have to become http://www.cmail.com/chris@home.example.com/myBookmarks and http://www.cmail.com/chris@work.example.com/myBookmarks, even though both URLs point to the same resource and the email address has nothing to do with the resource.


Composite:

I am using a composite solution of URLised settings, where appropriate (good for sharing bookmarks) and just using the settings from the SubSession where the page has nothing to do with a particular setting.  e.g.  Your inbox link could be http://www.cmail.com/chris@work.example.com/inbox, even when you are on http://www.cmail.com/myBookmarks, as the current account can be associated with chris@work.example.com in the SubSession, on the server side.


Usage:

SubSession gives your web application two new cookies, 'subsession' and 'subsession_breadcrumb'.  SubSession does not include any server-side functionality - you'll have to develop this yourself, for your framework.

The 'subsession' cookie contains small integer value which is guaranteed to be unique for that user's current session.  e.g. 7.

The 'subsession_breadcrumb' cookie contains a path to the current subsession. e.g. 4/7 - the user middle clicked from subsession 4, crcreating subsession 7.


Implementation:

SubSession is implemented as a jQuery plugin.  Simply including the JavaScript file is enough to make it work.


Server-side patterns:

SubSession stroage is typically a hash-map of the SessionID concatenated with the subsession ID.  If a setting cannot be found in HashMap(SessionID+subsession) it is idomatic to walk back up the subsession_breadcrumb until a setting is found in a 'parent' tab.


Bugs:

As there is no concept of 'tabs' in HTTP/1.1, this code is a large hack.  It works by setting short lived cookies, using them as a message to the page that is about to be opened.  If your site often takes more than 20 seconds to load pages, you may want to increase the 'SHORT_DELAY' constant.
