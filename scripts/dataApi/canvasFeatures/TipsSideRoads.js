fastmap.uikit.canvasTips.TipsSideRoads = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsSideRoad(data, i));
    }
    return parts;
};
