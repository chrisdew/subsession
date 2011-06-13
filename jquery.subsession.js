// Copyright Thorcom Systems Ltd. 2011, All Rights Reserved.
// Released under the MIT licence.

// SubSession is a method of tracking tabs within web applications.
// See the README for more information.

(function($) {
var YEAR = 60 * 60 * 24 * 365; // a year in seconds
var SHORT_DELAY = 20;          // a delay of twenty seconds
var subsession;
var subsession_breadcrumb;

// Sets a cookie, exsecs is time to expiry, in seconds.
function setCookie(c_name, value, exsecs) {
  var exdate = new Date();
  exdate.setSeconds(exdate.getSeconds() + exsecs);
  var c_value = escape(value) + ((exsecs == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

// Gets a cookie.
function getCookie(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0 ; i < ARRcookies.length ; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g,"");
    if (x == c_name) {
      return unescape(y);
    }
  }
}

// This gets the counter from (cookie) storage, increments the value and saves it back to storage.  
// If there is no counter, it creates one.
function incCounter() {
  var counterStr = getCookie('subsession_counter');
  var counter;
  if (!counterStr) {
    counter = 1;
  } else {
    counter = parseInt(counterStr, 10);
    counter++;
  }
  setCookie('subsession_counter', '' + counter); 
  return counter;
}

// This runs when the page loads.
$(document).ready(function() {
  subsession = getCookie('subsession');
  subsession_breadcrumb = getCookie('subsession_breadcrumb');
  if (!subsession) {
    var counter = incCounter();
    subsession = '' + counter;
    subsession_breadcrumb = '' + counter;
  }
  setCookie('subsession', '', YEAR);
  setCookie('subsession_breadcrumb', '', YEAR);
  $('#subsession').text(subsession);
  $('#subsession_breadcrumb').text(subsession_breadcrumb);
  $('a').mousedown(onMouseDown);
  $(window).unload(onUnload);
});

// This runs when a new page is being loaded.
function onUnload() {
  console.log("onUnload");
  setCookie('subsession', subsession, SHORT_DELAY);
  setCookie('subsession_breadcrumb', subsession_breadcrumb, SHORT_DELAY);
};

// This runs when a link is clicked.  
// Left clicks do the smaes as unload.
// Middle clicks (open in new tab) and context clicks give a shirt window during which
// a newly opened tab will be a child of this subsession.
// FIXME: add the behaviour to Context Menu >> Open In New Tab properly.
function onMouseDown(e) {
  console.log("e.which:", e.which, "e.button:", e.button);
  if (e.which === 1) {
    onUnload();
  } else if (e.which === 2 || e.which === 3) {
    var counter = incCounter();
    setCookie('subsession', counter, SHORT_DELAY);
    setCookie('subsession_breadcrumb', subsession_breadcrumb + "/" + counter, SHORT_DELAY);
  }
};

})(jQuery);

