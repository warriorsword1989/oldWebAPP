/**
 * Created by zhaohang on 2016/11/23.
 */
// 名称类型
fastmap.uikit.canvasTMFeature.TMNameType = fastmap.uikit.canvasTMFeature.TMFeature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data) {
        var rdLinkColor = {
            0: '#008500',
            1: '#FF0000',
            2: '#FF0000',
            3: '#A500EC',
            4: '#0000FF',
            5: '#FA04C9',
            6: '#2FFFE3',
            7: '#0000FF',
            8: '#BEDE14',
            9: '#FF00FF',
            14: '#2FFFE3',
            15: '#000000',
            99: '#999999' };
        var color = rdLinkColor[parseInt(data.m.a, 10)];
        this.geometry.type = 'LineString';
        this.properties.featType = 'RDLINK';
        this.properties.kind = data.m.a;
        this.properties.name = data.m.b;
        this.properties.direct = data.m.d;
        this.properties.snode = data.m.e;
        this.properties.enode = data.m.f;
        this.properties.limit = data.m.c;
        this.properties.form = data.m.h;
        this.properties.fc = data.m.i;
        this.properties.imiCode = data.m.j;
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();

        this.properties.symbol = symbolFactory.createSymbol('CompositeLineSymbol');
        this.properties.style.strokeColor = color;
        this.properties.style.strokeWidth = 1;
        this.properties.style.strokeOpacity = 1;
    }
});
