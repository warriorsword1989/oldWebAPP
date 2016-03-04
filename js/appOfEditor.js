/**
 * Created by liwanchong on 2016/2/18.
 */
var app = angular.module('mapApp', ['oc.lazyLoad', 'ui.layout']);
app.controller('RoadEditController', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    dragF('toolsDiv');
    //dragF('toolsDiv1');
    //dragF("popToolBar");
    //dragF1('popoverTips', 'parentId');
    $scope.dataTipsURL = "";//左上角弹出框的ng-include地址
    $scope.objectEditURL = "";//属性栏的ng-include地址
    $scope.suspendObjURL = "";
    $scope.save = "";//保存方法
    $scope.delete = "";//删除方法
    $scope.cancel = "";//取消
    $scope.rowkeyOfDataTips = "";
    $scope.updateDataTips = "";
    $scope.outFlag = false;//是否可监听
    $scope.toolsFlag = true;
    $scope.panelFlag = false;
    $scope.outErrorArr=[false,false,false,true] ;
    $scope.arrowFlag = true;
    $scope.objectFlag = false;
    $scope.outErrorUrlFlag = false;
    $scope.classArr = [false, false, false, false,false,false,false,false,false,false,false,false,false];//按钮样式的变化
    $scope.changeBtnClass=function(id) {
        for(var claFlag= 0,claLen=$scope.classArr.length;claFlag<claLen;claFlag++) {
            if(claFlag===id) {
                $scope.classArr[claFlag] = !$scope.classArr[claFlag];
            }else{
                $scope.classArr[claFlag] = false;
            }
        }
    };

    $scope.$on("dataTipsToParent", function (event, data) {
        $scope.$broadcast("dataTipsToChild", data);
    });
    //登录时
    keyEvent($ocLazyLoad,$scope);
    $scope.zoom = [];
    $ocLazyLoad.load('ctrl/outPutCtrl').then(function () {
            $scope.outputTab = 'js/tepl/outputTepl.html';
        appInit();
        for(var i=map.getMinZoom();i<=map.getMaxZoom();i++){
            $scope.zoom.push(i);
        }
        $scope.removeZoomClass = function(){
            $.each($(".zoom-btn"),function(m,n){
                $(n).prop('disabled',false).removeClass('btn-primary');
            })
        }
        $scope.changeZoom = function(i,e){
            $scope.removeZoomClass();
            map.setZoom(i);
            $('#nowZoom').text(i);
            $(e.target).prop('disabled',true).addClass('btn-primary');
        }
        $('#nowZoom').text(map.getZoom());
        /*当比例尺改变时*/
        map.on('zoomend',function(){
            $('#nowZoom').text(map.getZoom());
            $scope.removeZoomClass();
            $(".zoom-btn[data-zoom-size="+map.getZoom()+"]").prop('disabled',true).addClass('btn-primary');
        })
        $scope.disZoom = map.getZoom();
        $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {

                $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                $ocLazyLoad.load('ctrl/modifyToolCtrl').then(function () {
                        $scope.modifyToolURL = 'js/tepl/modifyToolTepl.html';
                        $scope.layersURL = 'js/tepl/filedsResultTepl.html';
                        $ocLazyLoad.load('ctrl/selectShapeCtrl').then(function () {
                                $scope.selectShapeURL = 'js/tepl/selectShapeTepl.html';
                                $ocLazyLoad.load('ctrl/addShapeCtrl').then(function () {
                                        $scope.addShapeURL = 'js/tepl/addShapeTepl.html';

                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
    var output = fastmap.uikit.OutPutController();
    $scope.itemsByPage = 1;
    $scope.checkTotalPage=0;
    $scope.checkTotal=0;
    $scope.meshesId=[605603,0605603];
    $scope.rowCollection=[];
    $scope.showTab = function (tab,ind) {
        if (tab === "outPut") {
            $("#liout").addClass("selected");
            $("#lierror").removeClass("selected");
            $("#errorClear").show();
            $("#immediatelyCheck").hide();
            $("#fm-error-checkErrorLi").hide();
            $("#fm-outPut-inspectDiv").show();
            $("#fm-error-wrongDiv").hide();
            $scope.rowCollection=[];
            $ocLazyLoad.load('ctrl/outPutCtrl').then(function () {
                    $scope.outputTab = 'js/tepl/outputTepl.html';
                }
            );
        } else if (tab === "errorCheck") {
            $("#lierror").addClass("selected");
            $("#liout").removeClass("selected");
            $("#errorClear").hide();
            $("#immediatelyCheck").show();
            $("#fm-outPut-inspectDiv").hide();
            $("#fm-error-checkErrorLi").hide();
            $("#fm-error-wrongDiv").show();
            $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
                    $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
                }
            );

        }else if(tab==="getCheck"){
            $("#fm-error-checkErrorLi").show();
            if( $scope.itemsByPage==1){
                $scope.rowCollection=[];
                $scope.getCheckDateAndCount();
            }
            $("#fm-error-wrongDiv").show();
            $ocLazyLoad.load('ctrl/errorCheckCtrl').then(function () {
                    $scope.errorCheckTab = 'js/tepl/errorCheckTepl.html';
                }
            );



        }
    };
    $scope.getCheckDateAndCount=function(){
        var params = {
            "projectId":11,
            "meshes":$scope.meshesId
        };
        Application.functions.getCheckCount(JSON.stringify(params),function(data){
            if(data.errcode == 0) {
                $scope.checkTotalPage = Math.ceil(data.data/5);
                $scope.checkTotal=data.data;
            }
        });
        var params = {
            "projectId":11,
            "pageNum":$scope.itemsByPage,
            "pageSize":5,
            "meshes":$scope.meshesId
        };
        Application.functions.getCheckDatas(JSON.stringify(params),function(data){
            if(data.errcode == 0) {
                $scope.rowCollection = data.data;
                //$scope.rowCollection=[{"ruleId":111,"situation":111,"rank":111,"targets":33,"information":222},{"ruleId":111,"situation":111,"rank":111,"targets":33,"information":222}];
                $scope.goPaging();
                $scope.$apply();
            }
        });
    }
    $scope.isTipsPanel = 1;
//改变左侧栏中的显示内容
    $scope.changeLeftDisplay=function(id) {
        if(id==="tipsPanel") {
            $scope.isTipsPanel = 1;
            $ocLazyLoad.load('ctrl/filedsResultCtrl').then(function () {
                $scope.layersURL = 'js/tepl/filedsResultTepl.html';
            });
        }else if(id==="scenePanel") {
            $scope.isTipsPanel = 2;
            $ocLazyLoad.load('ctrl/sceneLayersCtrl').then(function () {
                $scope.layersURL = 'js/tepl/sceneLayers.html';
            });
        }else if(id==="layerPanel") {
            $scope.isTipsPanel = 3;
            $ocLazyLoad.load('ctrl/referenceLayersCtrl').then(function () {
                    $scope.layersURL = 'js/tepl/referenceLayersTepl.html';
                }
            );
        }
    };

    $scope.getCheckDate=function(){
        var param = {
            "projectId":11,
            "pageNum":$scope.itemsByPage,
            "pageSize":5,
            "meshes":$scope.meshesId
        };
        Application.functions.getCheckDatas(JSON.stringify(param),function(data){
            if(data.errcode == 0) {
                $scope.rowCollection = data.data;
                $scope.goPaging();
                $scope.$apply();
            }
        });
    }

    /*箭头图代码点击下一页*/
    $scope.picNext = function(){
        $scope.itemsByPage += 1;
        $scope.getCheckDate();
    }
    /*箭头图代码点击上一页*/
    $scope.picPre = function(){
        $scope.itemsByPage -= 1;
        $scope.getCheckDate();
    }

    /*点击翻页*/
    $scope.goPaging = function(){
        if($scope.itemsByPage == 1){
            if($scope.checkTotalPage == 0 || $scope.checkTotalPage == 1){
                $(".pic-next").prop('disabled','disabled');
            }else{
                $(".pic-next").prop('disabled',false);
            }
            $(".pic-pre").prop('disabled','disabled');
        }else{
            if($scope.checkTotalPage - $scope.itemsByPage == 0){
                $(".pic-next").prop('disabled','disabled');
            }else{
                $(".pic-next").prop('disabled',false);
            }
            $(".pic-pre").prop('disabled',false);
        }
        $scope.$apply();
    }


    $scope.empty = function () {
        var output = fastmap.uikit.OutPutController();
        output.clear();
        if(output.updateOutPuts!=="") {
            output.updateOutPuts();
        }
    };

    $scope.showStop=function(){
        //禁止滚动
        //map.scrollWheelZoom=false;
        this.scrollWheelZoom=false;
    }
    $scope.showStart=function(){
        //可以滚动
        this.scrollWheelZoom=true;
    }
    $scope.showOrHide = function () {
        var modifyToolsDiv = $("#modifyToolsDiv");
        if ($scope.toolsFlag) {

            modifyToolsDiv.animate({width: '400px', opacity: '0.8'}, "slow");
            modifyToolsDiv.css("display", "block");
        } else {

            modifyToolsDiv.animate({width: '0px', opacity: '0.8'}, "slow");
            modifyToolsDiv.css("display", "none");
        }
        $scope.toolsFlag = !$scope.toolsFlag;
    }
    //改变右侧的宽度
    $scope.changeWidthOfPanel=function() {
        $scope.panelFlag = !$scope.panelFlag;
        $scope.arrowFlag = !$scope.arrowFlag;
        $scope.objectFlag = !$scope.objectFlag;
        $scope.outErrorFlag = !$scope.outErrorFlag;
        if($scope.outErrorArr[0]===true||$scope.outErrorArr[2]===true) {
            $scope.outErrorArr[0] = !$scope.outErrorArr[0];
            $scope.outErrorArr[2] = !$scope.outErrorArr[2];
        }

    };
    $scope.changeOutOrErrorStyle=function() {
        if($scope.outErrorArr[0]===true||$scope.outErrorArr[1]===true) {
            $scope.outErrorArr[0] = !$scope.outErrorArr[0];
            $scope.outErrorArr[1] = !$scope.outErrorArr[1];
        }
        if($scope.outErrorArr[2]===true||$scope.outErrorArr[3]===true) {
            $scope.outErrorArr[2] = !$scope.outErrorArr[2];
            $scope.outErrorArr[3] = !$scope.outErrorArr[3];
        }
        $scope.outErrorUrlFlag = !$scope.outErrorUrlFlag;
    };

}]);
function appInit(){
    map = L.map('map',{
        attributionControl: false,
        zoomControl:false
    }).setView([40.012834, 116.476293], 17);
    /*增加比例尺*/
//    var scale = L.control.scale({
//        metric:true,
//        imperial:false,
//        position:'bottomleft',
//        updateWhenIdle:true
//    }).addTo(map);
    var layerCtrl = new fastmap.uikit.LayerController({config:Application.layersConfig});
    var highLightLayer = new fastmap.uikit.HighLightController({});
    var selectCtrl = new fastmap.uikit.SelectController();
    var outPutCtrl = new fastmap.uikit.OutPutController();
    var objCtrl = new fastmap.uikit.ObjectEditController({});
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();
    var featCode = new fastmap.uikit.FeatCodeController();
    var tooltipsCtrl=new fastmap.uikit.ToolTipsController();
    tooltipsCtrl.setMap(map,'tooltip');
    shapeCtrl.setMap(map);
    layerCtrl.on('layerOnShow',function(event){
        if(event.flag == true){
            map.addLayer(event.layer);
        }else{
            map.removeLayer(event.layer);
        }
    })
    for(var layer in layerCtrl.getVisibleLayers()){
        map.addLayer(layerCtrl.getVisibleLayers()[layer]);
    }
}

var map = null;
function dragF(id) {
    var $dragDiv = $('#' + id),
        $parentDiv = $('#map');
    var $drag = $dragDiv.find('button');
    $drag.on({
        mousedown: function (e) {
            e.preventDefault();

            var t = $dragDiv.offset(),
                o = e.pageX - t.left,
                i = e.pageY - t.top;
            var df = e.target.id;
            if (df !== "map") {
                $dragDiv.on("mousemove.drag", function (e) {
                    map.dragging.disable();
                    e.stopPropagation();
                    var sunTop = e.pageY - i,
                        sunLeft = e.pageX - o;
                    if (sunTop > $parentDiv.offset().top && sunTop + $dragDiv.height() < $parentDiv.offset().top + $parentDiv.height() && sunLeft > $parentDiv.offset().left && sunLeft + $dragDiv.width() < $parentDiv.offset().left + $parentDiv.width()) {
                        $dragDiv.offset({
                            top: e.pageY - i,
                            left: e.pageX - o
                        })

                    }

                })
            }

        },
        mouseup: function () {
            map.dragging.enable();
            $dragDiv.unbind("mousemove.drag");
        }
    });
}
function dragF1(id,pId) {
    var $dragDiv = $('#' + id),
        $parentDiv = $('#'+pId);
    var $drag = $dragDiv.find('div');
    $drag.on({
        mousedown: function (e) {
            e.preventDefault();

            var t = $dragDiv.offset(),
                o = e.pageX - t.left,
                i = e.pageY - t.top;
            var df = e.target.id;
            if (df !== "pId") {
                $dragDiv.on("mousemove.drag", function (e) {
                    map.dragging.disable();
                    e.stopPropagation();
                    var sunTop = e.pageY - i,
                        sunLeft = e.pageX - o;
                    if (sunTop > $parentDiv.offset().top && sunTop + $dragDiv.height() < $parentDiv.offset().top + $parentDiv.height() && sunLeft > $parentDiv.offset().left && sunLeft + $dragDiv.width() < $parentDiv.offset().left + $parentDiv.width()) {
                        $dragDiv.offset({
                            top: e.pageY - i,
                            left: e.pageX - o
                        })

                    }

                })
            }

        },
        mouseup: function () {
            map.dragging.enable();
            $dragDiv.unbind("mousemove.drag");
        }
    });




}


