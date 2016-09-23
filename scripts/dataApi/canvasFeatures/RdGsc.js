fastmap.uikit.canvasFeature.RdGsc = function(data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasFeature.RdGscMarker(data));
    for (idx = 0; idx < data.g.length; idx++) {
        parts.push(new fastmap.uikit.canvasFeature.RdGscPart(data, idx));
    }
    return parts;
}