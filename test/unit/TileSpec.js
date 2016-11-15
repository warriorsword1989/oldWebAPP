/**
 * Created by liuzhaoxia on 2016/5/24.
 */
define(['mapApi.Tile'], function () {
    describe('mapApi.Tile类', function () {
        var tile;
        beforeEach(function () {
            tile = fastmap.mapApi.tile();
        });
        describe('是否有函数', function () {
            it('是否有函数', function () {
                expect(tile.initialize).toBeDefined();
                expect(tile.getUrl).toBeDefined();
                expect(tile.getData).toBeDefined();
                expect(tile.setData).toBeDefined();
                expect(tile.getRequest).toBeDefined();
                expect(tile.setRequest).toBeDefined();
            });


            it('无参数构造函数应该正确初始化成员变量', function () {
                tile = fastmap.mapApi.tile();
                expect(tile.options).toEqual({});
            });
            it('有参数构造函数应该正确初始化成员变量', function () {
                tile = fastmap.mapApi.tile('http://192.168.4.204', { titles: '' });
                expect(tile.getUrl).not.toEqual('');
                expect(tile.options).not.toBeNull();
            });
        });
    });
});
