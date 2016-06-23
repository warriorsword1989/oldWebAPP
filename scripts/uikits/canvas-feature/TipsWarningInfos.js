fastmap.uikit.canvasTips.TipsWarningInfos = function(data) {
    var parts = [];
    for (var i = 0,len = data.m.d.split("|").length ; i < len; i++){
        parts.push(new fastmap.uikit.canvasTips.TipsWarningInfo(data,i));
    }
    return parts;
}

