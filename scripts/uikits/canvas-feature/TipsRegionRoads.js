fastmap.uikit.canvasTips.TipsLinks = function(data) {
    var parts = [];
    parts.push(new fastmap.uikit.canvasTips.TipsRegionRoad(data));
    parts.push(new fastmap.uikit.canvasTips.TipsRegionRoadPart(data));
    return parts;
};