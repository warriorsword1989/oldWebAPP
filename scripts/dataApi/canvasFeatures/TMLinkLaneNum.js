/**
 * Created by zhaohang on 2016/11/14.
 */
// 车道数（总数）
fastmap.uikit.canvasTMFeature.TMLinkLaneNum = fastmap.uikit.canvasTMFeature.TMFeature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data) {
        var rdLinkColor = {
            1: '#993399',
            2: '#C0C0C0',
            3: '#FFC000',
            4: '#64DC14',
            5: '#0000FF',
            6: '#FF6464',
            7: '#00FFFF',
            8: '#818001',
            9: '#7364C9',
            10: '#C93146' };
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
