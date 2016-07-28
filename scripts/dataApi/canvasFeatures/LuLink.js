/**
 * Created by mali on 2016/7/25.
 */
fastmap.uikit.canvasFeature.LULink = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.properties["featType"] = "LULINK";
        this.geometry['type'] = 'LineString';
        this.properties['snode'] = item.m.a;
        this.properties['enode'] = item.m.b;
        this.properties['kind'] = item.m.c;
        this.properties['style']['strokeColor'] = '#FF0000';
        this.properties['style']['strokeWidth'] = 3;
        this.properties['style']['strokeOpacity'] = 1;
    }
});