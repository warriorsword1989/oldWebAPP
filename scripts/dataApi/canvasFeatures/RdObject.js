/**
 * Created by liuyang on 2016/8/24.
 */
fastmap.uikit.canvasFeature.RdObject = function (data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasFeature.RdObjectMarker(data.g, data.i));
    if (data.m && data.m.a) {
        for (idx = 0; idx < data.m.a.length; idx++) {
            parts.push(new fastmap.uikit.canvasFeature.RdObjectLinks(data.m.a[idx], data.i));
        }
    }
    if (data.m && data.m.b) {
        for (idx = 0; idx < data.m.b.length; idx++) {
            parts.push(new fastmap.uikit.canvasFeature.RdObjectNodes(data.m.b[idx], data.i));
        }
    }
    parts.push(new fastmap.uikit.canvasFeature.RdObjectOutLine(data.m.c, data.i));
    return parts;
};
