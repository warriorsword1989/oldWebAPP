/**
 * Created by linglong on 2016/8/11.
 */
fastmap.uikit.canvasFeature.LCLink = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.properties.featType = 'LCLINK';
        this.geometry.type = 'LineString';
        this.properties.snode = item.m.a;
        this.properties.enode = item.m.b;
        this.properties.kind = item.m.c;
        this.properties.style.strokeColor = (item.m.c == 21) ? '#8fefd5' : (item.m.c == 22) ? '#50b450' : '#8fefd5';
        this.properties.style.strokeWidth = 2;
        this.properties.style.strokeOpacity = 1;
    }
});
