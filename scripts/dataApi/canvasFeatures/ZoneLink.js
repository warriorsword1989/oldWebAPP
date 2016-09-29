fastmap.uikit.canvasFeature.ZoneLink = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.properties["featType"] = "ZONELINK";
        this.geometry['type'] = 'LineString';
        this.properties['snode'] = item.m.a;
        this.properties['enode'] = item.m.b;
        this.properties['kind'] = item.m.c;
        this.properties['style']['strokeColor'] = '#FF8000';
        this.properties['style']['strokeWidth'] = 3;
        this.properties['style']['strokeOpacity'] = 1;
    }
});