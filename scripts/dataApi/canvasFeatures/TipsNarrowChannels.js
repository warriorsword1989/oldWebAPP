/**
 * Created by mali on 2016/7/18.
 */
fastmap.uikit.canvasTips.TipsNarrowChannels = function (data) {
    var parts = [],
        idx;
    for (var i = 0; i < 2; i++) {
        parts.push(new fastmap.uikit.canvasTips.TipsNarrowChannel(data, i));
    }
    return parts;
};
