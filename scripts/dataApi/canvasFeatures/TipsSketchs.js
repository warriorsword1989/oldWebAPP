fastmap.uikit.canvasTips.TipsSketchs = function (data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasTips.TipsSketch(data));
    for (idx = 0; idx < data.m.c.length; idx++) {
        parts.push(new fastmap.uikit.canvasTips.TipsSketchPart(data, idx));
    }
    return parts;
};
