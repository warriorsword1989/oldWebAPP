fastmap.uikit.canvasTips.TipsUnderpasses = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsUnderpass(data,i));
    }
    return parts;
};