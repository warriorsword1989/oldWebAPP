fastmap.uikit.canvasTips.TipsPedestrianStreets = function(data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsPedestrianStreet(data,i));
    }
    return parts;
};