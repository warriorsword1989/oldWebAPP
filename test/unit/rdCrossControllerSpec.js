/**
 * Created by xujie on 2016/5/4 0004.
 * 负责测试rdCrossController.js
 */

define(['angularMocks', 'rdCrossCtrl'], function () {

    describe('rdCrossController测试', function () {

        beforeEach(module('mapApp'));

        var scope;
        var rdCrossController;
        var layerCtrl;
        var objCtrl;
        var outPutCtrl;
        var selectCtrl;
        var rdCross;
        var eventController;
        var $controller;

        beforeEach(inject(function ($rootScope, _$controller_) {
            initEnvironment();
            scope = $rootScope.$new();
            $controller = _$controller_;
        }));

        it('构造函数中应该定义一系列行为函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});

            expect(scope.initializeRdCrossData).toBeDefined(true);
            expect(scope.refreshData).toBeDefined(true);
            expect(scope.showCrossNames).toBeDefined(true);
            expect(scope.addRdCrossName).toBeDefined(true);
            expect(scope.minuscrossName).toBeDefined(true);
            expect(scope.changeColor).toBeDefined(true);
            expect(scope.backColor).toBeDefined(true);
            expect(scope.save).toBeDefined(true);
            expect(scope.delete).toBeDefined(true);
            expect(scope.cancel).toBeDefined(true);
        });

        it('构造函数中应该定义一系列事件', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});

            expect(eventController.eventTypesMap.hasOwnProperty(eventController.eventTypes.SAVEPROPERTY)).toBeTruthy();
            expect(eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY][0]).toBe(scope.save);

            expect(eventController.eventTypesMap.hasOwnProperty(eventController.eventTypes.DELETEPROPERTY)).toBeTruthy();
            expect(eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY][0]).toBe(scope.delete);

            expect(eventController.eventTypesMap.hasOwnProperty(eventController.eventTypes.CANCELEVENT)).toBeTruthy();
            expect(eventController.eventTypesMap[eventController.eventTypes.CANCELEVENT][0]).toBe(scope.cancel);

            expect(eventController.eventTypesMap.hasOwnProperty(eventController.eventTypes.SELECTEDFEATURECHANGE)).toBeTruthy();
            expect(eventController.eventTypesMap[eventController.eventTypes.SELECTEDFEATURECHANGE][0]).toBe(scope.initializeRdCrossData);
        });

        it('构造函数应该调用一次initializeRdCrossData函数', function () {
            objCtrl.data = rdCross;
            rdCrossController = $controller('rdCrossController', {$scope: scope});

            expect(objCtrl.originalData).toEqual(rdCross.getIntegrate());
        });

        it('initializeRdCrossData函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;

            scope.initializeRdCrossData();

            expect(scope.rdCrossData).toEqual(rdCross);
            expect(objCtrl.originalData).toEqual(rdCross.getIntegrate());
            expect(highLightFeatures_static.length).toBe(2);

            var highLightFeatures = [];
            highLightFeatures.push({
                id: "585624",
                layerid: 'referenceLine',
                type: 'line',
                style: {}
            });
            highLightFeatures.push({
                id: "374229",
                layerid: 'rdcross',
                type: 'rdcross',
                style: {}
            });

            expect(highLightFeatures_static).toEqual(highLightFeatures);
        });

        it('refreshData函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            Application.functions.getRdObjectById = jasmine.createSpy("getRdObjectById").and.callFake(function (id, type, func) {
                var data = {
                    data: rdCross,
                    errcode: 0,
                    errmsg: "success"
                };
                func(data);
            });

            spyOn(scope, "initializeRdCrossData");
            spyOn(objCtrl, "setCurrentObject");

            scope.refreshData();

            expect(objCtrl.setCurrentObject.calls.count()).toBe(1);
            expect(objCtrl.setCurrentObject.calls.argsFor(0)).toEqual(["RDCROSS", rdCross]);

            expect(scope.initializeRdCrossData.calls.count()).toBe(1);
        });

        it('showCrossNames函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(scope, "$emit");

            var crossNamesObj = {
                "loadType": "subAttrTplContainer",
                "propertyCtrl": 'components/road/ctrls/attr_cross_ctrl/namesCtrl',
                "propertyHtml": '../../scripts/components/road/tpls/attr_cross_tpl/namesTpl.html'
            };

            var nameItem = {
                rowId: 1
            };

            scope.showCrossNames(nameItem);

            expect(scope.$emit.calls.count()).toBe(1);
            expect(scope.$emit.calls.argsFor(0)).toEqual(["transitCtrlAndTpl", crossNamesObj]);

            expect(scope.rdCrossData["oridiRowId"]).toBe(1);
        });

        it('addRdCrossName函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            var newName = fastmap.dataApi.rdCrossName({"linkPid": rdCross.pid, "name": "路口名"});

            scope.addRdCrossName();

            expect(scope.rdCrossData.names[0]).toEqual(newName);
        });

        it('minuscrossName函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            var name = rdCross.names[1];

            scope.minuscrossName(0);

            expect(scope.rdCrossData.names.length).toBe(1);
            expect(scope.rdCrossData.names[0]).toEqual(name);
        });

        it('changeColor函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(window, "$").and.callThrough();
            spyOn($.fn, "css");

            scope.changeColor(0);

            expect(window.$.calls.count()).toBe(1);
            expect(window.$.calls.argsFor(0)).toEqual(["#crossnameSpan0"]);

            expect($.fn.css.calls.count()).toBe(1);
            expect($.fn.css.calls.argsFor(0)).toEqual(["color", "#FFF"]);
        });

        it('backColor函数', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(window, "$").and.callThrough();
            spyOn($.fn, "css");

            scope.backColor(0);

            expect(window.$.calls.count()).toBe(1);
            expect(window.$.calls.argsFor(0)).toEqual(["#crossnameSpan0"]);

            expect($.fn.css.calls.count()).toBe(1);
            expect($.fn.css.calls.argsFor(0)).toEqual(["color", "darkgray"]);
        });

        it('save函数_对象属性没有变化', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "save").and.callFake(function () {
                objCtrl.changedProperty = null;
            });
            spyOn(window, "swal");

            Application.functions.saveLinkGeometry = jasmine.createSpy("saveLinkGeometry");

            scope.save();

            expect(objCtrl.save.calls.count()).toBe(1);
            expect(objCtrl.save.calls.argsFor(0)).toEqual([]);

            expect(window.swal.calls.count()).toBe(1);
            expect(window.swal.calls.argsFor(0)).toEqual(["操作成功", '属性值没有变化！', "success"]);

            expect(Application.functions.saveLinkGeometry.calls.count()).toBe(0);
        });

        it('save函数_对象属性有变化', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "save").and.callFake(function () {
                objCtrl.changedProperty = {};
            });
            spyOn(objCtrl, "setOriginalData");
            spyOn(window, "swal");
            spyOn(outPutCtrl, "pushOutput");
            spyOn(outPutCtrl, "updateOutPuts");
            spyOn(scope, "refreshData");

            Application.functions.saveLinkGeometry = jasmine.createSpy("saveLinkGeometry").and.callFake(function (param, func) {
                var data = {
                    "data": {
                        "log": [{"type": "RDCROSS", "pid": rdCross.pid, "childPid": "", "op": "修改属性"}],
                        "check": [],
                        "pid": 0
                    }, "errmsg": "success", "errcode": 0
                };
                func(data);
            });

            Application.functions.changeDataTipsState = jasmine.createSpy("changeDataTipsState");

            scope.save();

            expect(objCtrl.save.calls.count()).toBe(1);
            expect(objCtrl.save.calls.argsFor(0)).toEqual([]);

            expect(window.swal.calls.count()).toBe(0);

            var saveLinkGeometryParam = {
                "command": "UPDATE",
                "type": "RDCROSS",
                "projectId": Application.projectid,
                "data": objCtrl.changedProperty
            };

            expect(Application.functions.saveLinkGeometry.calls.count()).toBe(1);
            expect(Application.functions.saveLinkGeometry.calls.argsFor(0)[0]).toEqual(JSON.stringify(saveLinkGeometryParam));
            expect(Application.functions.changeDataTipsState.calls.count()).toBe(0);

            expect(objCtrl.setOriginalData.calls.count()).toBe(1);
            expect(objCtrl.setOriginalData.calls.argsFor(0)).toEqual([rdCross.getIntegrate()]);

            var info = [{
                "type": "RDCROSS",
                "pid": rdCross.pid,
                "childPid": "",
                "op": "修改属性"
            }, {
                "op": "修改RDCROSS成功",
                "type": "",
                "pid": ""
            }];
            expect(outPutCtrl.pushOutput.calls.count()).toBe(1);
            expect(outPutCtrl.pushOutput.calls.argsFor(0)).toEqual([info]);

            expect(outPutCtrl.updateOutPuts.calls.count()).toBe(1);

            expect(scope.refreshData.calls.count()).toBe(1);
        });

        it('save函数_对象属性有变化_操作失败', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "save").and.callFake(function () {
                objCtrl.changedProperty = {};
            });
            spyOn(objCtrl, "setOriginalData");
            spyOn(window, "swal");
            spyOn(outPutCtrl, "pushOutput");
            spyOn(outPutCtrl, "updateOutPuts");
            spyOn(scope, "refreshData");

            Application.functions.saveLinkGeometry = jasmine.createSpy("saveLinkGeometry").and.callFake(function (param, func) {
                var data = {
                    "data": null, "errmsg": "fail", "errcode": -1
                };
                func(data);
            });

            Application.functions.changeDataTipsState = jasmine.createSpy("changeDataTipsState");

            scope.save();

            expect(objCtrl.save.calls.count()).toBe(1);
            expect(objCtrl.save.calls.argsFor(0)).toEqual([]);

            expect(window.swal.calls.count()).toBe(0);

            var saveLinkGeometryParam = {
                "command": "UPDATE",
                "type": "RDCROSS",
                "projectId": Application.projectid,
                "data": objCtrl.changedProperty
            };

            expect(Application.functions.saveLinkGeometry.calls.count()).toBe(1);
            expect(Application.functions.saveLinkGeometry.calls.argsFor(0)[0]).toEqual(JSON.stringify(saveLinkGeometryParam));
            expect(Application.functions.changeDataTipsState.calls.count()).toBe(0);

            expect(objCtrl.setOriginalData.calls.count()).toBe(0);

            var info = [{"op": -1, "type": "fail", "pid": undefined}];
            expect(outPutCtrl.pushOutput.calls.count()).toBe(1);
            expect(outPutCtrl.pushOutput.calls.argsFor(0)).toEqual([info]);

            expect(outPutCtrl.updateOutPuts.calls.count()).toBe(1);

            expect(scope.refreshData.calls.count()).toBe(1);
        });

        it('save函数_对象属性有变化_有对应tips', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            selectCtrl.rowkey = {rowkey: "abc"};
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "save").and.callFake(function () {
                objCtrl.changedProperty = {};
            });
            spyOn(objCtrl, "setOriginalData");
            spyOn(window, "swal");
            spyOn(outPutCtrl, "pushOutput");
            spyOn(outPutCtrl, "updateOutPuts");
            spyOn(scope, "refreshData");

            Application.functions.saveLinkGeometry = jasmine.createSpy("saveLinkGeometry").and.callFake(function (param, func) {
                var data = {
                    "data": {
                        "log": [{"type": "RDCROSS", "pid": rdCross.pid, "childPid": "", "op": "修改属性"}],
                        "check": [],
                        "pid": 0
                    }, "errmsg": "success", "errcode": 0
                };
                func(data);
            });

            Application.functions.changeDataTipsState = jasmine.createSpy("changeDataTipsState").and.callFake(function (param, func) {
                var data = {
                    "data": {
                        "log": [{"type": "RDCROSS", "pid": rdCross.pid, "childPid": "", "op": "修改tips"}],
                        "check": [],
                        "pid": 0
                    }, "errmsg": "success", "errcode": 0
                };
                func(data);
            });

            scope.save();

            expect(objCtrl.save.calls.count()).toBe(1);
            expect(objCtrl.save.calls.argsFor(0)).toEqual([]);

            expect(window.swal.calls.count()).toBe(0);

            var saveLinkGeometryParam = {
                "command": "UPDATE",
                "type": "RDCROSS",
                "projectId": Application.projectid,
                "data": objCtrl.changedProperty
            };

            expect(Application.functions.saveLinkGeometry.calls.count()).toBe(1);
            expect(Application.functions.saveLinkGeometry.calls.argsFor(0)[0]).toEqual(JSON.stringify(saveLinkGeometryParam));

            expect(selectCtrl.rowkey.rowkey).toBeUndefined(1);
            var changeDataTipsStateParam = {
                "rowkey": "abc",
                "stage": 3,
                "handler": 0

            };
            expect(Application.functions.changeDataTipsState.calls.count()).toBe(1);
            expect(Application.functions.changeDataTipsState.calls.argsFor(0)[0]).toEqual(JSON.stringify(changeDataTipsStateParam));

            expect(objCtrl.setOriginalData.calls.count()).toBe(1);
            expect(objCtrl.setOriginalData.calls.argsFor(0)).toEqual([rdCross.getIntegrate()]);

            var info1 = [{
                "type": "RDCROSS",
                "pid": rdCross.pid,
                "childPid": "",
                "op": "修改tips"
            }, {
                "op": "修改RDCROSS状态成功",
                "type": "",
                "pid": ""
            }];
            var info2 = [{
                "type": "RDCROSS",
                "pid": rdCross.pid,
                "childPid": "",
                "op": "修改属性"
            }, {
                "op": "修改RDCROSS成功",
                "type": "",
                "pid": ""
            }];
            expect(outPutCtrl.pushOutput.calls.count()).toBe(2);
            expect(outPutCtrl.pushOutput.calls.argsFor(0)).toEqual([info1]);
            expect(outPutCtrl.pushOutput.calls.argsFor(1)).toEqual([info2]);

            expect(outPutCtrl.updateOutPuts.calls.count()).toBe(2);

            expect(scope.refreshData.calls.count()).toBe(1);
        });

        it('save函数_对象属性有变化_有对应tips_tips操作失败', function () {
            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            selectCtrl.rowkey = {rowkey: "abc"};
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "save").and.callFake(function () {
                objCtrl.changedProperty = {};
            });
            spyOn(objCtrl, "setOriginalData");
            spyOn(window, "swal");
            spyOn(outPutCtrl, "pushOutput");
            spyOn(outPutCtrl, "updateOutPuts");
            spyOn(scope, "refreshData");

            Application.functions.saveLinkGeometry = jasmine.createSpy("saveLinkGeometry").and.callFake(function (param, func) {
                var data = {
                    "data": {
                        "log": [{"type": "RDCROSS", "pid": rdCross.pid, "childPid": "", "op": "修改属性"}],
                        "check": [],
                        "pid": 0
                    }, "errmsg": "success", "errcode": 0
                };
                func(data);
            });

            Application.functions.changeDataTipsState = jasmine.createSpy("changeDataTipsState").and.callFake(function (param, func) {
                var data = {
                    "data": null, "errmsg": "tipsFail", "errcode": -2
                };
                func(data);
            });

            scope.save();

            expect(objCtrl.save.calls.count()).toBe(1);
            expect(objCtrl.save.calls.argsFor(0)).toEqual([]);

            expect(window.swal.calls.count()).toBe(0);

            var saveLinkGeometryParam = {
                "command": "UPDATE",
                "type": "RDCROSS",
                "projectId": Application.projectid,
                "data": objCtrl.changedProperty
            };

            expect(Application.functions.saveLinkGeometry.calls.count()).toBe(1);
            expect(Application.functions.saveLinkGeometry.calls.argsFor(0)[0]).toEqual(JSON.stringify(saveLinkGeometryParam));

            expect(selectCtrl.rowkey.rowkey).toBeUndefined(1);
            var changeDataTipsStateParam = {
                "rowkey": "abc",
                "stage": 3,
                "handler": 0

            };
            expect(Application.functions.changeDataTipsState.calls.count()).toBe(1);
            expect(Application.functions.changeDataTipsState.calls.argsFor(0)[0]).toEqual(JSON.stringify(changeDataTipsStateParam));

            expect(objCtrl.setOriginalData.calls.count()).toBe(1);
            expect(objCtrl.setOriginalData.calls.argsFor(0)).toEqual([rdCross.getIntegrate()]);

            var info1 = [{
                "op": -2,
                "type": "tipsFail",
                "pid": undefined
            }];
            var info2 = [{
                "type": "RDCROSS",
                "pid": rdCross.pid,
                "childPid": "",
                "op": "修改属性"
            }, {
                "op": "修改RDCROSS成功",
                "type": "",
                "pid": ""
            }];
            expect(outPutCtrl.pushOutput.calls.count()).toBe(2);
            expect(outPutCtrl.pushOutput.calls.argsFor(0)).toEqual([info1]);
            expect(outPutCtrl.pushOutput.calls.argsFor(1)).toEqual([info2]);

            expect(outPutCtrl.updateOutPuts.calls.count()).toBe(2);

            expect(scope.refreshData.calls.count()).toBe(1);
        });

        it('delete函数', function () {
            var rdCrossLayer = jasmine.createSpyObj('rdLayer', ['redraw']);
            spyOn(layerCtrl, "getLayerById").and.callFake(function () {
                return rdCrossLayer;
            });

            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "setOriginalData");
            spyOn(window, "swal");
            spyOn(outPutCtrl, "pushOutput");
            spyOn(outPutCtrl, "updateOutPuts");
            spyOn(scope, "refreshData");

            Application.functions.saveProperty = jasmine.createSpy("saveLinkGeometry").and.callFake(function (param, func) {
                var data = {
                    "data": {
                        "log": [{"type": "RDCROSS", "pid": rdCross.pid, "childPid": "", "op": "删除路口"}],
                        "check": [],
                        "pid": 0
                    }, "errmsg": "success", "errcode": 0
                };
                func(data);
            });

            scope.delete();

            expect(window.swal.calls.count()).toBe(0);

            var savePropertyaram = {
                "command": "DELETE",
                "type": "RDCROSS",
                "projectId": Application.projectid,
                "objId": rdCross.pid
            };

            expect(Application.functions.saveProperty.calls.count()).toBe(1);
            expect(Application.functions.saveProperty.calls.argsFor(0)[0]).toEqual(JSON.stringify(savePropertyaram));

            expect(rdCrossLayer.redraw.calls.count()).toBe(1);

            var info = [{"type": "RDCROSS", "pid": rdCross.pid, "childPid": "", "op": "删除路口"}, {
                "op": "删除RDCROSS成功",
                "type": "",
                "pid": ""
            }];
            expect(outPutCtrl.pushOutput.calls.count()).toBe(1);
            expect(outPutCtrl.pushOutput.calls.argsFor(0)).toEqual([info]);

            expect(outPutCtrl.updateOutPuts.calls.count()).toBe(1);

            expect(scope.refreshData.calls.count()).toBe(0);
        });

        it('delete函数_操作失败', function () {
            var rdCrossLayer = jasmine.createSpyObj('rdLayer', ['redraw']);
            spyOn(layerCtrl, "getLayerById").and.callFake(function () {
                return rdCrossLayer;
            });

            rdCrossController = $controller('rdCrossController', {$scope: scope});
            objCtrl.data = rdCross;
            scope.rdCrossData = objCtrl.data;

            spyOn(objCtrl, "setOriginalData");
            spyOn(window, "swal");
            spyOn(outPutCtrl, "pushOutput");
            spyOn(outPutCtrl, "updateOutPuts");
            spyOn(scope, "refreshData");

            Application.functions.saveProperty = jasmine.createSpy("saveLinkGeometry").and.callFake(function (param, func) {
                var data = {
                    "data": null, "errmsg": "fail", "errcode": -1
                };
                func(data);
            });

            scope.delete();

            expect(window.swal.calls.count()).toBe(0);

            var savePropertyaram = {
                "command": "DELETE",
                "type": "RDCROSS",
                "projectId": Application.projectid,
                "objId": rdCross.pid
            };

            expect(Application.functions.saveProperty.calls.count()).toBe(1);
            expect(Application.functions.saveProperty.calls.argsFor(0)[0]).toEqual(JSON.stringify(savePropertyaram));

            expect(rdCrossLayer.redraw.calls.count()).toBe(0);

            var info = [{
                "op": -1,
                "type": "fail",
                "pid": undefined
            }];
            expect(outPutCtrl.pushOutput.calls.count()).toBe(1);
            expect(outPutCtrl.pushOutput.calls.argsFor(0)).toEqual([info]);

            expect(outPutCtrl.updateOutPuts.calls.count()).toBe(1);

            expect(scope.refreshData.calls.count()).toBe(0);
        });

        function initEnvironment() {
            objCtrl = fastmap.uikit.ObjectEditController();
            objCtrl.data = null;
            objCtrl.originalData = null;

            outPutCtrl = fastmap.uikit.OutPutController();
            outPutCtrl.outPuts = [];
            outPutCtrl.updateOutPuts = "";

            layerCtrl = fastmap.uikit.LayerController();
            eventController = fastmap.uikit.EventController();
            eventController.eventTypesMap = {};

            selectCtrl = fastmap.uikit.SelectController();
            selectCtrl.rowkey = null;

            reDefineHighLightRender();

            highLightFeatures_static = null;

            var data = {
                "electroeye": 0,
                "kgFlag": 0,
                "links": [{"linkPid": 585624, "pid": 374229, "rowId": "2D71EC1A92DDDCE7E050A8C083040693"}],
                "names": [{
                    "langCode": "CHI",
                    "name": "广泽路口北",
                    "nameGroupid": 5569,
                    "nameId": 5569,
                    "phonetic": "Guang Ze Lu Bei Kou",
                    "pid": 374229,
                    "rowId": "2D71EC1DFBE4DCE7E050A8C083040693",
                    "srcFlag": 0
                }, {
                    "langCode": "ENG",
                    "name": "Guangze Rd N Intersection",
                    "nameGroupid": 5569,
                    "nameId": 5570,
                    "phonetic": "",
                    "pid": 374229,
                    "rowId": "2D71EC1DFBE3DCE7E050A8C083040693",
                    "srcFlag": 0
                }],
                "nodes": [{
                    "isMain": 1,
                    "nodePid": 467051,
                    "pid": 374229,
                    "rowId": "2D71EC241962DCE7E050A8C083040693"
                }, {"isMain": 0, "nodePid": 467052, "pid": 374229, "rowId": "2D71EC22B2FDDCE7E050A8C083040693"}],
                "pid": 374229,
                "signal": 0,
                "type": 1
            };
            rdCross = new fastmap.dataApi.RdCross(data);
        }

        var highLightFeatures_static = null;

        function reDefineHighLightRender() {
            fastmap.uikit.HighLightRender = function () {
                this.highLightFeatures = [];
                this.drawHighlight = function () {
                    highLightFeatures_static = this.highLightFeatures;
                };
            }
        }
    });
});



