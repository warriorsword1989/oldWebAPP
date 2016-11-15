fastmap.uikit.canvasTips.TipsUsageFeeRequireds = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsUsageFeeRequired(data, i));
    }
    return parts;
};
