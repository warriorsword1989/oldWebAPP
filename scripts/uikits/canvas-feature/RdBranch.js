fastmap.uikit.canvasFeature.RdBranch = function (data) {
    var parts = [];
    for (var key = 0; key < data.m.a.length; key++) {
        for (var cnt = 0; cnt < data.m.a[key].ids.length; cnt++) {
            var branchPart = new fastmap.uikit.canvasFeature.RdBranchPart(data, key, cnt);
            if (cnt > 0) {
                branchPart.properties['markerStyle']["icon"] = [];
            }
            parts.push(branchPart);
        }
    }
    return parts;
};