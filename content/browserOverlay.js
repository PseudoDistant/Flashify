if ("undefined" == typeof(Flashify)) {
  var Flashify = {};
};

const supportedPages = [
  "dagobah.net", 
  "newgrounds.com", 
  "crazygames.com"
];

gBrowser.addProgressListener({"onLocationChange": function() {Flashify.BrowserOverlay.updateIcon();}});
window.addEventListener("load", function() { Flashify.BrowserOverlay.init(); }, false);

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");
const flPrefBranch = Services.prefs.getBranch("extensions.flashify@pseudodistant.");

Flashify.BrowserOverlay = {
  init : function() {
    var appContent = document.getElementById("appcontent");
    if (appContent) {
      appContent.addEventListener("DOMContentLoaded", Flashify.BrowserOverlay.onPageLoad, true);
    }
  },
  
  updateIcon : function() {
    if(!(supportedPages.some(e => {if (gBrowser.contentDocument.location.href.includes(e)) {
      document.getElementById("flashify-button").classList.remove("flashifyNotReady");
      return true;
    }}))) {      
      if (!(document.getElementById("flashify-button").classList.contains("flashifyNotReady"))) {
        document.getElementById("flashify-button").classList.add("flashifyNotReady");
      }
    }
  },
  
  onPageLoad : function(event) {
    if (flPrefBranch.getBoolPref("trustNewgrounds", false) == true && 
        gBrowser.contentDocument.location.href.includes("newgrounds.com") &&
        flPrefBranch.getIntPref("default-action", 0) == 0) {
      Flashify.BrowserOverlay.enflashicitate(event, false, false);
    }
  },
  
  embed : function(width, height, url, elementToReplace) {
    var flashContent = gBrowser.contentDocument.createElement("object");
    flashContent.width = width;
    flashContent.height = height;
    flashContent.data = url;
    flashContent.type = "application/x-shockwave-flash";

    elementToReplace.replaceWith(flashContent);
  },
  
  enflashicitate : function(aEvent, redirect, newtab, buttonPress) {
    if(buttonPress == true) {
      switch(flPrefBranch.getIntPref("default-action", 0)) {
        case 0:
          break;
        case 2:
          newtab = true;
        case 1: 
          redirect = true;
          break;
        default:
          break;
      }
    }
    
    var url = gBrowser.contentDocument.location.href;
    var doc = gBrowser.contentDocument;
    if (url.includes("dagobah.net")) {
      if (redirect == true) {
        if (newtab == true) {
          gBrowser.contentWindow.open();
        } else {
          doc.location.replace(doc.location.href.replace(/flash/, "flashswf"));
        }
      } else {
        if (doc.getElementById("resizer1") != null) {
          Flashify.BrowserOverlay.embed(doc.getElementById("resizer2").width, doc.getElementById("resizer2").height, 
                doc.location.href.replace(/flash/, "flashswf"), doc.getElementById("resizer1"));
        }
      }
	}
	
	if (url.includes("newgrounds.com")) {
      if (redirect == true) {
        if (newtab == true) {
          gBrowser.contentWindow.open(doc.getElementById("ruffle_embed").src.match(/https%3A%2F%2F(.+?)swf/)[0].replace(/%2F/g, "/").replace(/%3A/g, ":"));
        } else {
          doc.location.replace(doc.getElementById("ruffle_embed").src.match(/https%3A%2F%2F(.+?)swf/)[0].replace(/%2F/g, "/").replace(/%3A/g, ":"));
        }
      } else {
        if (doc.getElementById("ruffle_embed") != null) {
          Flashify.BrowserOverlay.embed(
            doc.getElementById("ruffle_embed").style.width,
            doc.getElementById("ruffle_embed").style.height,
            doc.getElementById("ruffle_embed").src.match(/https%3A%2F%2F(.+?)swf/)[0].replace(/%2F/g, "/").replace(/%3A/g, ":"),
            doc.getElementById("ruffle_embed")
          );
        }
      }
    }
    
    if (url.includes("crazygames.com")) {
      if (redirect == true) {
        doc.location.replace(doc.getElementById("game-iframe").contentDocument.documentElement.innerHTML.match(/https:\/\/files(.+?)swf/)[0]);
      } else {
        var gameURL = doc.getElementById("game-iframe").contentDocument.documentElement.innerHTML.match(/https:\/\/files(.+?)swf/)[0];
        if(gameURL != null) {
          Flashify.BrowserOverlay.embed(
            "100%",
            "100%",
            gameURL,
            doc.getElementById("game-iframe")
          );
        }
        //TODO: Replace content inside of iframe, instead of the entire iframe.
        //doc.getElementById("game-iframe").contentDocument.replaceChild(flashContent, doc.getElementById("game-iframe").contentWindow.document.getElementById("game-container"));
      }
    }
  },
  
  openSettings : function() {
    window.open("chrome://flashify/content/preferences.xul","Flashify preferences...", "chrome");
  },
  
  stubby : function() {
    window.alert("STUB");
  },
  
  cleanup : function() {
    gBrowser.removeProgressListener({"onLocationChange": function() {Flashify.BrowserOverlay.updateIcon();}});
    window.removeEventListener("load", function() { Flashify.BrowserOverlay.init(); });
    document.getElementById("appcontent").removeEventListener("DOMContentLoaded", Flashify.BrowserOverlay.onPageLoad, true);
  }
}


window.addEventListener("unload", Flashify.BrowserOverlay.cleanup, false);
