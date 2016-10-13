fastmap.uikit.canvasTips.TipsLinks = function(data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasTips.TipsLink(data));
    parts.push(new fastmap.uikit.canvasTips.TipsLinkPart(data));
    return parts;
}