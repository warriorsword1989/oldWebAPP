/**
 * Created by xujie on 2016/5/12 0012.
 */

define(['symbol.SymbolFactory'], function () {

    describe('symbol.SymbolFactory类', function () {

        var factory;

        beforeEach(function () {
            factory = fastmap.mapApi.symbol.GetSymbolFactory();
        });

        describe('GetSymbolFactory函数', function () {
            it('对象应该是单例的', function () {
                var factory1 = fastmap.mapApi.symbol.GetSymbolFactory();

                expect(factory1).toBe(factory);
            });
        });

        describe('createSymbol函数', function () {
            it('应该支持符号类型SamplePointSymbol', function () {
                var symbol = factory.createSymbol('SampleLineSymbol');
                expect(symbol.type).toBe('SampleLineSymbol');
            });
        });
    });
});
