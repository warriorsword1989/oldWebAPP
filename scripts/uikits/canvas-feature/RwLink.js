fastmap.uikit.canvasFeature.RwLink = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.properties['featType'] = "RWLINK";
        this.geometry['type'] = 'LineString';
        this.properties['name'] = item.m.a;
        // var color = 'black';
        // if(item.m.a){
        //     color = '#' + this.properties['color'];
        // }
        var color = '#' + this.properties['color'];
        this.properties['color'] = item.m.b;

        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [
                {
                    type: 'SampleLineSymbol',
                    color: color,
                    width: 3,
                    style: 'solid'
                },
                {
                    type: 'SampleLineSymbol',
                    color: 'white',
                    width: 2,
                    style: 'solid'
                },
                {
                    type: 'CartoLineSymbol',
                    color: color,
                    width: 2,
                    pattern: [10, 10]
                }
            ]
        };
        this.properties['symbol'] = fastmap.mapApi.symbol.GetSymbolFactory().dataToSymbol(symbolData);
    }
});