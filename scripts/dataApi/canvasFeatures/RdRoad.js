fastmap.uikit.canvasFeature.RdRoad = function(data) {
    var parts = [],
        idx;
    if(data.g){
        for (idx = 0; idx < data.g.length; idx++) {
            parts.push(new fastmap.uikit.canvasFeature.RdRoadLinks(data.g[idx],data.i));
        }
    }
    return parts;
}