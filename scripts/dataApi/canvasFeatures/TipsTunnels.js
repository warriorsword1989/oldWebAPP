fastmap.uikit.canvasTips.TipsTunnels = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsTunnel(data, i));
    }
    return parts;
};
