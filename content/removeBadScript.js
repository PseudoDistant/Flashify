Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function RemoveBadScript() {
    shouldLoad : function(aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
        let result = Components.interfaces.nsIContentPolicy.ACCEPT;

        if ((Components.interfaces.nsIContentPolicy.TYPE_SCRIPT == aContentType) &&SOME_REGULAR_EXPRESSION.test(aContentLocation.contains("dagobah.net/js/ruffle.js")) {
            return Components.interfaces.nsIContentPolicy.REJECT_REQUEST;
        }

        return result;
    }
}
