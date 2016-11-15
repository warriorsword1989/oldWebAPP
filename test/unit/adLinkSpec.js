/**
 * Created by zhaohang on 2016/5/27.
 */
define(['mapApi.AdLink'], function () {
    describe('adLink类', function () {
        var adLink;
        beforeEach(function () {
            var data = {
                changedFields: {},
                eNodePid: 100022023,
                editFlag: 1,
                form: 1,
                geometry: { type: 'LineString', coordinates: [[116.47611, 40.01447], [116.47638, 40.01458]] },
                kind: 1,
                length: 26.074,
                mesh: 0,
                meshes: [{ linkPid: 100031656, meshId: 605603, rowId: 'FFE8C49F2C344095BB6E0D67BB048434' }],
                pid: 100031656,
                rowId: 'F8B37F759CE349C79B57BF2DD87103DC',
                sNodePid: 100022024,
                scale: 0 };


            adLink = new fastmap.dataApi.AdLink(data);
        });
        describe('是否有函数', function () {
            it('是否有函数', function () {
                expect(adLink.initialize).toBeDefined();
                expect(adLink.setAttributeData).toBeDefined();
                expect(adLink.getIntegrate).toBeDefined();
                expect(adLink.getSnapShot).toBeDefined();
            });
        });
        describe('测试getIntegrate类参数', function () {
            it('测试getIntegrate类参数', function () {
                expect(adLink.getIntegrate().editFlag.toString()).toEqual('1');
                expect(adLink.getIntegrate().sNodePid.toString()).toEqual('100022024');
                expect(adLink.getIntegrate().eNodePid.toString()).toEqual('100022023');
                expect(adLink.getIntegrate().form.toString()).toEqual('1');
            });
        });
        describe('测试getSnapShot类参数', function () {
            it('测试getSnapShot类参数', function () {
                expect(adLink.getSnapShot().editFlag.toString()).toEqual('1');
                expect(adLink.getSnapShot().sNodePid.toString()).toEqual('100022024');
                expect(adLink.getSnapShot().eNodePid.toString()).toEqual('100022023');
                expect(adLink.getSnapShot().form.toString()).toEqual('1');
            });
        });
    });
});
