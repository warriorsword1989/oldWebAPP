fastmap.uikit.canvasTips.TipsElevatedRoads = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsElevatedRoad(data,i));
    }
    return parts;
};