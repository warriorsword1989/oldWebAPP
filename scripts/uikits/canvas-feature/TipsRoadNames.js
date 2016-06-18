fastmap.uikit.canvasTips.TipsRoadNames = function(data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasTips.TipsRoadName1(data));
    parts.push(new fastmap.uikit.canvasTips.TipsRoadName(data));
    return parts;
}