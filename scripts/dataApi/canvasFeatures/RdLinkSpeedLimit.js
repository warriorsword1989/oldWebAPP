fastmap.uikit.canvasFeature.RdLinkSpeedLimit = function (item) {
    var parts = [];
    if (item.m.a != undefined && item.m.b != undefined) {
        parts.push(new fastmap.uikit.canvasFeature.RdLinkSpeedLimitPart(item.i, item.m.a, item.m.b, 2));
    }
    if (item.m.c != undefined && item.m.d != undefined) {
        parts.push(new fastmap.uikit.canvasFeature.RdLinkSpeedLimitPart(item.i, item.m.c, item.m.d, 3));
    }
    return parts;
};
