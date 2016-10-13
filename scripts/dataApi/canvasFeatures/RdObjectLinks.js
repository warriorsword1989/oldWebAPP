/**
 * Created by liuyang on 2016/8/24.
 */
fastmap.uikit.canvasFeature.RdObjectLinks = fastmap.uikit.canvasFeature.Feature.extend({
	geometry: {},
    properties: {},
    setAttribute: function(data,id) {
        if(data.t == 2){
            this.properties['rdRoadPid'] = data.p;
            this.properties['orgType'] = "RDROAD";
        }else if(data.t == 1){
            this.properties['rdInterPid'] = data.p;
            this.properties['orgType'] = "RDINTER";
        } else if(data.t == 0){
            this.properties['orgType'] = "RDLINK";
        }

        this.geometry['type'] = 'LineString';
        this.geometry['coordinates'] = data.g;
        this.properties["featType"] = "RDOBJECT";
        this.properties['linkId'] = data.i;
        this.properties['id'] = id;

        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var compositeSymbol = symbolFactory.createSymbol('CompositeLineSymbol');
        this.properties['symbol'] = compositeSymbol;

        this.properties['style']['strokeColor'] = '#DAB1D5';
        this.properties['style']['strokeWidth'] = 6;
        this.properties['style']['strokeOpacity'] = 0.5;
    }
});