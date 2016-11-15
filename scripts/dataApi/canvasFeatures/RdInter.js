fastmap.uikit.canvasFeature.RdInter = function (data) {
    var parts = [],
        idx;
    for (idx = 0; idx < data.g.length; idx++) {
        parts.push(new fastmap.uikit.canvasFeature.RdInterNodes(data.g[idx], data.i));
    }
    if (data.m && data.m.a) {
        for (idx = 0; idx < data.m.a.length; idx++) {
            parts.push(new fastmap.uikit.canvasFeature.RdInterLinks(data.m.a[idx], data.i));
        }
    }
    return parts;
};
