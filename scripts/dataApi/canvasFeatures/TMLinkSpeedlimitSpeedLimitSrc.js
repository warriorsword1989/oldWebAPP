/**
 * Created by zhaohang on 2016/11/14.
 */
//普通线限速限速来源
fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedLimitSrc = fastmap.uikit.canvasTMFeature.TMFeature.extend({
  geometry: {},
  properties: {},
  setAttribute: function(data) {
    var RD_LINK_Colors = [ 'red', 'blue','grey','#123456','#223333','#656777','#888888','#999999','#444444','#232344','#445699'];
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