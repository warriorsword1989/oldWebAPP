/**
 * Created by linglong on 2016/8/11.
 */
fastmap.uikit.canvasFeature.LCLink = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.properties["featType"] = "LCLINK";
        this.geometry['type'] = 'LineString';
        this.properties['snode'] = item.m.a;
        this.properties['enode'] = item.m.b;
        this.properties['kind'] = item.m.c;
        this.properties['style']['strokeColor'] = '#66cc66';
        this.properties['style']['strokeWidth'] = 3;
        this.properties['style']['strokeOpacity'] = 1;
    }
});