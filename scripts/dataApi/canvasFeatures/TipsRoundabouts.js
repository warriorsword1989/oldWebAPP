fastmap.uikit.canvasTips.TipsRoundabouts = function (data) {
    var parts = [];
    parts.push(new fastmap.uikit.canvasTips.TipsRoundabout(data));
    parts.push(new fastmap.uikit.canvasTips.TipsRoundaboutPart(data));
    return parts;
};
