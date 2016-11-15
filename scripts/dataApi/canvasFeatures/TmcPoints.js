fastmap.uikit.canvasFeature.TmcPoints = function(data) {
    var parts = [];
    for(var i = 0; i < data.g.length; i++) {
        var temp = {
            g: data.g[i],
            i: data.m.a[i],
            m: {
                a: data.m.b[i],
                b: data.m.c[i]
            }
        };
        parts.push(new fastmap.uikit.canvasFeature.TmcPoint(temp));
    }
    // parts.push(new fastmap.uikit.canvasFeature.TmcLineString(data));
    return parts;
};