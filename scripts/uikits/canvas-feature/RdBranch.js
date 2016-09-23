fastmap.uikit.canvasFeature.RdBranch = function(data) {
    var parts = [],
        cnt = 0,
        key, idx;
    for (key in data.m.a) {
        for (idx in data.m.a[key].ids) {
            parts.push(new fastmap.uikit.canvasFeature.RdBranchPart(data, key, idx, cnt));
            cnt++;
        }
    }
    return parts;
}