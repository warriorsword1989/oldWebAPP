fastmap.uikit.canvasFeature.RdLane = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
      this.properties['featType'] = "RWLINK";
      this.geometry['type'] = 'LineString';
      // this.properties['name'] = item.m.a;
      // this.properties['color'] = item.m.b;
      var color = '#660099';
      var symbolData = {
          type: 'CompositeLineSymbol',
          symbols: [
              {
                  type: 'SampleLineSymbol',
                  color: color,
                  width: item.m.a*2,
                  style: 'solid'
              },
              // {
              //     type: 'SampleLineSymbol',
              //     color: 'white',
              //     width: 2,
              //     style: 'solid'
              // },
              // {
                  // type: 'CartoLineSymbol',
                  // color: color,
                  // width: 2,
                  // pattern: [10, 10]
              // }
          ]
      };
      this.properties['symbol'] = fastmap.mapApi.symbol.GetSymbolFactory().dataToSymbol(symbolData);
    },
});
