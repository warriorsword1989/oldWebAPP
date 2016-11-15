fastmap.uikit.canvasFeature.RdGscPart = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data, idx) {
        this.geometry.type = 'LineString';
        this.geometry.coordinates = data.g[idx].g;
        this.properties.id = data.g[idx].i;
        this.properties.featType = data.t;
        if (data.g[idx].z === 0) {
            this.properties.style = {
                strokeColor: '#14B7FC',
                strokeWidth: 8,
                strokeOpacity: 1,
                lineCap: 'round' // 增加圆形线帽
            };
        } else if (data.g[idx].z === 1) {
            this.properties.style = {
                strokeColor: '#4FFFB6',
                strokeWidth: 8,
                strokeOpacity: 1,
                lineCap: 'round' // 增加圆形线帽
            };
        } else {
            this.properties.style = {
                strokeColor: '#F8B19C',
                strokeWidth: 8,
                strokeOpacity: 1,
                lineCap: 'round' // 增加圆形线帽
            };
        }
    }
});
