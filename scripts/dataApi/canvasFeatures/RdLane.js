fastmap.uikit.canvasFeature.RdLane = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
      this.properties['featType'] = "RDLANE";
      this.geometry['type'] = 'LineString';
      var color = '#7D7DFF',
          symbolData = {};
      if (item.m.b == 'Y') {//车道连通，实线渲染
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
      } else {//详细车道，虚线渲染
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
