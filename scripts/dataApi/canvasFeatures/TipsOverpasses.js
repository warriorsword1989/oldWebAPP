fastmap.uikit.canvasTips.TipsOverpasses = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsOverpass(data, i));
    }
    return parts;
};
