fastmap.uikit.canvasFeature.RdInterLinks = fastmap.uikit.canvasFeature.Feature.extend({
	geometry: {},
    properties: {},
    setAttribute: function(data,id) {
        this.geometry['type'] = 'LineString';
        this.geometry['coordinates'] = data.g;
        this.properties["featType"] = "RDINTER";
        this.properties['snode'] = data.s;
        this.properties['enode'] = data.e;
        this.properties['linkId'] = data.i;
        this.properties['id'] = id;

        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var compositeSymbol = symbolFactory.createSymbol('CompositeLineSymbol');
        this.properties['symbol'] = compositeSymbol;

        this.properties['style']['strokeColor'] = '#E1E100';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
    }
});