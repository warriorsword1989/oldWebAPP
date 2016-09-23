fastmap.uikit.canvasTips.TipsRepairs = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsRepair(data,i));
    }
    return parts;
};