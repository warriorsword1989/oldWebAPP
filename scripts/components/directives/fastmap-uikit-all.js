/**
 * Created by liwanchong on 2016/04/18.
 */
(function() {
    jsFiles = [
        "components/directives/fastmap-uikit.js",
        "components/directives/loginForm/loginFormDrtvs.js"
    ]; // etc.

    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = "../../scripts/";
    for (var i=0, len=jsFiles.length; i<len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] +
            "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();