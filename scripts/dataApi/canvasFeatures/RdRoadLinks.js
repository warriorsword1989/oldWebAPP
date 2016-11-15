fastmap.uikit.canvasFeature.RdRoadLinks = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data, id) {
        this.geometry.type = 'LineString';
        this.geometry.coordinates = data.g;
        this.properties.featType = 'RDROAD';
        this.properties.linkId = data.i;
        this.properties.id = id;

        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var compositeSymbol = symbolFactory.createSymbol('CompositeLineSymbol');
        this.properties.symbol = compositeSymbol;

        this.properties.style.strokeColor = '#A3D1D1';
        this.properties.style.strokeWidth = 6;
        this.properties.style.strokeOpacity = 0.5;
    }
});
