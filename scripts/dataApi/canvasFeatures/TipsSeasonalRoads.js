fastmap.uikit.canvasTips.TipsSeasonalRoads = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsSeasonalRoad(data,i));
    }
    return parts;
};