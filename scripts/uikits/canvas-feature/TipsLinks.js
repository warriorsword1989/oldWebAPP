fastmap.uikit.canvasTips.TipsLinks = function(data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasTips.TipsLink1(data));
    parts.push(new fastmap.uikit.canvasTips.TipsLink(data));
    return parts;
}