fastmap.uikit.canvasTips.TipsCrossLineOverpasses = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsCrossLineOverpass(data, i));
    }
    return parts;
};
