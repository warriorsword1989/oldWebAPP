fastmap.uikit.canvasFeature.RdLane = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
      this.properties['featType'] = "RWLINK";
      this.geometry['type'] = 'LineString';
      var color = '#000099',
          symbolData = {};
      if (item.m.b == 'N') {
        symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [
                {
                    type: 'SampleLineSymbol',
                    color: color,
                    width: item.m.a*2,
                    style: 'solid'
                }
            ]
        };
      } else {
        symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [
                {
                    type: 'SampleLineSymbol',
                    color: color,
                    width: 4,
                    style: 'solid'
                },
                {
                    type: 'SampleLineSymbol',
                    color: 'white',
                    width: 4,
                    style: 'solid'
                },
                {
                    type: 'CartoLineSymbol',
                    color: color,
                    width: 4,
                    pattern: [4, 4]
                }
            ]
        };
      }
      this.properties['symbol'] = fastmap.mapApi.symbol.GetSymbolFactory().dataToSymbol(symbolData);
    },
});
