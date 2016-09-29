fastmap.uikit.canvasTips.TipsTruckRestrictions = function(data) {
    var parts = [];
    for (var i = 0,len = data.m.d.split("|").length ; i < len; i++){
        parts.push(new fastmap.uikit.canvasTips.TipsTruckRestriction(data,i));
    }
    return parts;
};
