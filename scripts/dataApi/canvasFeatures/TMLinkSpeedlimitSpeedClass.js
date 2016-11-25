/**
 * Created by zhaohang on 2016/11/14.
 */
// 普通线限速限速等级
fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedClass =
fastmap.uikit.canvasTMFeature.TMFeature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data) {
        var rdLinkColor = {
            0: '#C0C0C0',
            1: '#808000',
            2: '#FF0000',
            3: '#00A000',
            4: '#FFC000',
            5: '#0000FF',
            6: '#FF50A8',
            7: '#3291F5',
            8: '#000000',
            9: 'red' };
        var color = '';
        if (parseInt(data.m.a, 10) === 99) {
            color = rdLinkColor[9];
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
