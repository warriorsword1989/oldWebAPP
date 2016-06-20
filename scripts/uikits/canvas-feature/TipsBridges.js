fastmap.uikit.canvasTips.TipsBridges = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsBridge(data,i));
    }
    return parts;
}