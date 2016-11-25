/**
 * Created by zhaohang on 2016/11/14.
 */
// 普通线限速限速来源
fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedLimitSrc =
fastmap.uikit.canvasTMFeature.TMFeature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data) {
        var rdLinkColor = {
            0: '#C0C0C0',
            1: '#FF0000',
            2: '#00FF00',
            3: '#FFFF00',
            4: '#0000FF',
            5: '#FF9BFD',
            6: '#5176FD',
            7: '#8201B2',
            8: '#9ACF00',
            9: '#FF00FF',
            10: '#000000',
            11: 'red' };
        var color = '';
        if (parseInt(data.m.a, 10) === 99) {
            color = rdLinkColor[11];
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
