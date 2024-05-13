if ("undefined" == typeof(Flashify)) {
  var Flashify = {};
};

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");
const flPrefBranch = Services.prefs.getBranch("extensions.flashify@pseudodistant.");
Flashify.Preferences = {
    trustNGCheckbox : null,
    defaultFlashifyAction : null,
    
    trustNewgrounds : null,
    
    init : function() {
        Flashify.Preferences.trustNGCheckbox = document.getElementById("trust-newgrounds");
        Flashify.Preferences.defaultFlashifyAction = document.getElementById("default-flashify-action");
        
        if (flPrefBranch.getBoolPref("trustNewgrounds", true) == true) {
            Flashify.Preferences.trustNGCheckbox.setAttribute('checked', 'true');
        }
        
        Flashify.Preferences.defaultFlashifyAction.selectedIndex = flPrefBranch.getIntPref("default-action");
        
        if (Flashify.Preferences.defaultFlashifyAction.selectedIndex != 0) {
            Flashify.Preferences.trustNGCheckbox.setAttribute('disabled', 'true');
        }
    },
    
    checkRadioType : function() {
        if(Flashify.Preferences.defaultFlashifyAction.selectedIndex != 0) {
            Flashify.Preferences.trustNGCheckbox.setAttribute('disabled', 'true');
        } else {
            Flashify.Preferences.trustNGCheckbox.setAttribute('disabled', 'false');
        }
    },
    
    onOk : function() {
        flPrefBranch.setIntPref("default-action", Flashify.Preferences.defaultFlashifyAction.selectedIndex);
        
        flPrefBranch.setBoolPref("trustNewgrounds", Flashify.Preferences.trustNGCheckbox.getAttribute('checked'));
        return true;
    },
    
    clean : function() {
        
    }
}

window.addEventListener("load", function() { Flashify.Preferences.init(); }, false);
//Services.console.logStringMessage("[Flashify:]"+Flashify.Preferences.init);
window.addEventListener("unload",Flashify.Preferences.clean, false);
