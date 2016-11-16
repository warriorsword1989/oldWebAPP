fastmap.uikit.canvasFeature.TmcLineString = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.properties.featType = 'TMCLINESTRING';
        this.geometry.type = 'LineString';
        this.properties.color = 'yellow';
        var color = '#CCCC00';
        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [
                {
                    type: 'SampleLineSymbol',
                    color: color,
                    width: 3,
                    style: 'solid'
                }
            ]
        };
        this.properties.symbol = fastmap.mapApi.symbol.GetSymbolFactory().dataToSymbol(symbolData);
    }
});
