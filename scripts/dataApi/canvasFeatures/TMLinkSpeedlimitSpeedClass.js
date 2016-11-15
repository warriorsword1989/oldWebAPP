/**
 * Created by zhaohang on 2016/11/14.
 */
//普通线限速限速等级
fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedClass = fastmap.uikit.canvasTMFeature.TMFeature.extend({
  geometry: {},
  properties: {},
  setAttribute: function(data) {
    var RD_LINK_Colors = [ '#C0C0C0', '#808000', '#FF0000','#00A000','#FFC000','#0000FF','#FF50A8','#3291F5','#000000'];
    this.geometry['type'] = 'LineString';
    this.properties["featType"] = "RDLINK";
    this.properties['kind'] = data.m.a;
    this.properties['name'] = data.m.b;
    this.properties['direct'] = data.m.d;
    this.properties['snode'] = data.m.e;
    this.properties['enode'] = data.m.f;
    this.properties['limit'] = data.m.c;
    this.properties['form'] = data.m.h;
    this.properties['fc'] = data.m.i;
    this.properties['imiCode'] = data.m.j;
    var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();

    this.properties['symbol'] = symbolFactory.createSymbol('CompositeLineSymbol');
    this.properties['style']['strokeColor'] = RD_LINK_Colors[parseInt(data.m.a)];
    this.properties['style']['strokeWidth'] = 1;
    this.properties['style']['strokeOpacity'] = 1;
  },
});