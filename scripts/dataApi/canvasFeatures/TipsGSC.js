fastmap.uikit.canvasTips.TipsGSC = function(data) {
    var parts = [],
        idx;
    parts.push(new fastmap.uikit.canvasTips.TipsGSCMarker(data));
    for(idx = 0;idx<data.m.c.length;idx++){
        parts.push(new fastmap.uikit.canvasTips.TipsGSCPart(data,idx));
    }
    return parts;
};