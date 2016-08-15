fastmap.uikit.canvasFeature.RdRoad = function(data) {
    var parts = [],
        idx;
    if(data.g&&data.g.a){
        for (idx = 0; idx < data.g.a.length; idx++) {
            parts.push(new fastmap.uikit.canvasFeature.RdRoadLinks(data.g.a[idx],data.i));
        }
    }
    return parts;
}