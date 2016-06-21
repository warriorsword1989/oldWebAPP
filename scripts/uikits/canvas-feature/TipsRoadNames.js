fastmap.uikit.canvasTips.TipsRoadNames = function(data) {
    var parts = [];
    parts.push(new fastmap.uikit.canvasTips.TipsRoadNamePart(data));
    parts.push(new fastmap.uikit.canvasTips.TipsRoadName(data));
    return parts;
};