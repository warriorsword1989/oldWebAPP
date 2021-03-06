/**
 * Created by zhaohang on 2016/11/14.
 */
// 普通线限速限速等级赋值标识
fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedClassWork =
fastmap.uikit.canvasTMFeature.TMFeature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data) {
        var rdLinkColor = {
            0: '#FF0000',
            1: '#0000FF',
            2: 'red' };
        var color = '';
        if (parseInt(data.m.a, 10) === 99) {
            color = rdLinkColor[2];
        } else {
            color = rdLinkColor[parseInt(data.m.a, 10)];
        }
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
