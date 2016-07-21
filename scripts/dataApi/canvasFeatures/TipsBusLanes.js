fastmap.uikit.canvasTips.TipsBusLanes = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsBusLane(data,i));
    }
    return parts;
};