fastmap.uikit.canvasTips.TipsChargeOpenRoads = function (data) {
    var parts = [];
    parts.push(new fastmap.uikit.canvasTips.TipsChargeOpenRoad(data));
    parts.push(new fastmap.uikit.canvasTips.TipsChargeOpenRoadPart(data));
    return parts;
};
