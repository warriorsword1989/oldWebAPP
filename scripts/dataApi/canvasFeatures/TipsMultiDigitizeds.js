fastmap.uikit.canvasTips.TipsMultiDigitizeds = function (data) {
    var parts = [];
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsMultiDigitized(data, i));
    }
    return parts;
};
