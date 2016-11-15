fastmap.uikit.canvasTips.TipsBypaths = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsBypath(data, i));
    }
    return parts;
};
