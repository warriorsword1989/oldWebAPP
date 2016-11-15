fastmap.uikit.canvasTips.TipsPOIRoads = function (data) {
    var parts = [];
    parts.push(new fastmap.uikit.canvasTips.TipsPOIRoad(data));
    parts.push(new fastmap.uikit.canvasTips.TipsPOIRoadPart(data));
    return parts;
};
