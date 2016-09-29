fastmap.uikit.canvasTips.TipsMaintenances = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsMaintenance(data,i));
    }
    return parts;
}