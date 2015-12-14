/**
 * Created by liwanchong on 2015/10/28.
 */
var modifyApp = angular.module("lazymodule", []);
modifyApp.controller("modifyToolController", function ($scope) {

    var selectCtrl = fastmap.uikit.SelectController();
    var shapectl = new fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl=fastmap.uikit.ToolTipsController();

    tooltipsCtrl.setMap(map,"tooltip");
    map.currentTool = shapectl.getCurrentTool();
    shapectl.setMap(map);
    $scope.type="";
    $scope.modifyShapeClaArr = $scope.$parent.$parent.classArr;

    $scope.modifyShape = function (type,num) {
        var ly = fastmap.uikit.LayerController();
        if (shapectl.getCurrentTool()['options']) {
            shapectl.stopEditing();
        }
        var feature = null;
        if (type == "insertDot") {
            shapectl.stopEditing();
            $scope.type = "insertDot";
            $scope.$parent.$parent.changeBtnClass(num);
            map.currentTool.disable();
            if (shapectl.shapeEditorResult) {
                if(tooltipsCtrl.getCurrentTooltip()!=""){
                    tooltipsCtrl.onRemoveTooltip();
                }
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('insertDot');
                    tooltipsCtrl.setCurrentTooltip('开始插入形状点！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要插入形状点,先选择线！');
                }
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                ly.pushLayerFront('edit');
                var sobj = shapectl.shapeEditorResult;
                editLyer.drawGeometry = feature;
                editLyer.draw(feature, editLyer);
                sobj.setOriginalGeometry(feature);
                sobj.setFinalGeometry(feature);
            }
            //editLyer.options.zindex = 10;


            shapectl.setEditingType('pathVertexInsert');

            shapectl.startEditing();

            shapectl.on("startshapeeditresultfeedback",saveEscInsert);
            shapectl.on("stopshapeeditresultfeedback",function(){
                shapectl.off("startshapeeditresultfeedback",saveEscInsert);
            });
            //保存或者取消insertDot
            function saveEscInsert(){
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
            }

        }

        if (type == "deleteDot") {
            shapectl.stopEditing();
            $scope.type = "deleteDot";
            $scope.$parent.$parent.changeBtnClass(num);
            map.currentTool.disable();
            if (shapectl.shapeEditorResult) {
                if(selectCtrl.selectedFeatures){
                    if(tooltipsCtrl.getCurrentTooltip()!=""){
                        tooltipsCtrl.onRemoveTooltip();
                    }
                    tooltipsCtrl.setEditEventType('deleteDot');
                    tooltipsCtrl.setCurrentTooltip('开始删除形状点！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要删除形状点,先选择线！');
                }
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                ly.pushLayerFront('edit');
                var sobj = shapectl.shapeEditorResult;
                editLyer.drawGeometry = feature;
                editLyer.draw(feature, editLyer);
                sobj.setOriginalGeometry(feature);
                sobj.setFinalGeometry(feature);
            }

            shapectl.setEditingType('pathVertexReMove');

            shapectl.startEditing();

            shapectl.on("startshapeeditresultfeedback",saveEscInsertDelDot);
            shapectl.on("stopshapeeditresultfeedback",function(){
                shapectl.off("startshapeeditresultfeedback",saveEscInsertDelDot);
            });
            //保存或者取消deleteDot
            function saveEscInsertDelDot() {
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
            }
        }
        if (type == "moveDot") {
            shapectl.stopEditing();

            $scope.type = "moveDot";
            $scope.$parent.$parent.changeBtnClass(num);
            map.currentTool.disable();
            if (shapectl.shapeEditorResult) {
                if(tooltipsCtrl.getCurrentTooltip()!=""){
                    tooltipsCtrl.onRemoveTooltip();
                }
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('moveDot');
                    tooltipsCtrl.setCurrentTooltip('开始移动形状点！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要移动形状点先选择线！');
                }
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                ly.pushLayerFront('edit');
                var sobj = shapectl.shapeEditorResult;
                editLyer.drawGeometry = feature;
                editLyer.draw(feature, editLyer);
                sobj.setOriginalGeometry(feature);
                sobj.setFinalGeometry(feature);
            }
            shapectl.setEditingType('pathVertexMove');

            shapectl.startEditing();
            shapectl.on("startshapeeditresultfeedback",saveEscInsertMoveDot);
            shapectl.on("stopshapeeditresultfeedback",function(){
                shapectl.off("startshapeeditresultfeedback",saveEscInsertMoveDot);
            });
            //保存或者取消moveDot
            function saveEscInsertMoveDot() {
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
            }
        }
        if (type == "extendDot") {
            $scope.type = "extendDot";
            $scope.$parent.$parent.changeBtnClass(num);
            map.currentTool.disable();
            if (shapectl.shapeEditorResult) {
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                ly.pushLayerFront('edit');
                var sobj = shapectl.shapeEditorResult;
                editLyer.drawGeometry = feature;
                editLyer.draw(feature, editLyer);
                sobj.setOriginalGeometry(feature);
                sobj.setFinalGeometry(feature);
            }
            shapectl.setEditingType('pathVertexInsert');

            shapectl.startEditing();



        }


        if(type == 'pathBreak'){
            shapectl.stopEditing();
            $scope.type = "pathBreak";
            $scope.$parent.$parent.changeBtnClass(num);
            map.currentTool.disable();
            if (shapectl.shapeEditorResult) {
                if(tooltipsCtrl.getCurrentTooltip()!=""){
                    tooltipsCtrl.onRemoveTooltip();
                }
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('pathBreak');
                    tooltipsCtrl.setCurrentTooltip('开始打断link！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要开始打断link,先选择线！');
                }
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                ly.pushLayerFront('edit');
                var sobj = shapectl.shapeEditorResult;
                editLyer.drawGeometry = feature;
                editLyer.draw(feature, editLyer);
                sobj.setOriginalGeometry(feature);
                sobj.setFinalGeometry(feature);
            }
            shapectl.setEditingType('pathBreak');

            shapectl.startEditing();

            shapectl.on("startshapeeditresultfeedback",saveEscInsertPathBreak);
            shapectl.on("stopshapeeditresultfeedback",function(){
                shapectl.off("startshapeeditresultfeedback",saveEscInsertPathBreak);
            });

            //保存或者取消pathBreak
            function saveEscInsertPathBreak() {
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
            }
        }
        //var link = ly.getLayerById('edit').drawGeometry;
    };
    $(document).bind('keypress',
        function(event){
            if(event.keyCode==32){
                tooltipsCtrl.onRemoveTooltip();
                //为了保证捕获到这里时提交的形式正确,addShape时id为（非）未定义时return，modifyToolCtrl时id为未定义时return
                if((selectCtrl.selectedFeatures===null)||typeof(selectCtrl.selectedFeatures.id)=="undefined"){
                    map.currentTool.disable();
                    shapectl.stopEditing();
                    return;
                }

                if( $scope.type  == 'pathBreak'){
                    var ly = fastmap.uikit.LayerController();
                    var link = shapectl.shapeEditorResult.getFinalGeometry();

                    var breakPoint = null;

                    for(var item in link.components){
                        if(!_contains(link.components[item], shapectl.shapeEditorResult.getOriginalGeometry().points)){
                            breakPoint = link.components[item];
                        }

                    }

                    function _contains(point,components){
                        var boolExit = false;
                        for(var i in components){
                            if(point.x == components[i].x && point.y == components[i].y){
                                boolExit = true;
                            }
                        }
                        return boolExit;
                    }


                    var coordinate = []
                    for(var index in link.components){
                        coordinate.push([link.components[index].x, link.components[index].y]);
                    }

                    var param  = {
                        "command": "breakpoint",
                        "projectId": 1,
                        "objId":parseInt(selectCtrl.selectedFeatures.id),

                        "data":{"longitude":breakPoint.x,"latitude":breakPoint.y}

                    }
                    //结束编辑状态
                    shapectl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param),function(data){
                        var outputcontroller = new fastmap.uikit.OutPutController({});
                        var info=[];
                        $.each(data.data.log,function(i,item){
                            if(item.pid){
                                info.push(item.op+item.type+"(pid:"+item.pid+")");
                            }else{
                                info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                            }
                        });
                        outputcontroller.pushOutput(info);
                        if(outputcontroller.updateOutPuts!=="") {
                            outputcontroller.updateOutPuts();
                        }

                        var rdLink = ly.getLayerById('referenceLine');
                        rdLink.redraw();
                        ly.getLayerById('edit').bringToBack()
                        $(ly.getLayerById('edit').options._div).unbind();
                    })

                }else{
                    var link = shapectl.shapeEditorResult.getFinalGeometry();
                    var ly = fastmap.uikit.LayerController();
                    var coordinate = [];
                    if(link) {
                        for(var index in link.components){
                            coordinate.push([link.components[index].x, link.components[index].y]);
                        }

                        var param  = {
                            "command": "updatelink",
                            "projectId": 1,
                            "data": {
                                "pid": parseInt(selectCtrl.selectedFeatures.id),
                                "objStatus": "UPDATE",
                                "geometry": {"type": "LineString", "coordinates": coordinate}
                            }
                        }


                        //结束编辑状态
                        shapectl.stopEditing();

                        Application.functions.saveLinkGeometry(JSON.stringify(param),function(data){
                            var outputcontroller = new fastmap.uikit.OutPutController({});
                            var info=[];
                            if(data.data){
                                $.each(data.data.log,function(i,item){
                                    if(item.pid){
                                        info.push(item.op+item.type+"(pid:"+item.pid+")");
                                    }else{
                                        info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                                    }
                                });
                            }else{
                                info.push(data.errmsg + data.errid);
                            }
                            outputcontroller.pushOutput(info);
                            if(outputcontroller.updateOutPuts!=="") {
                                outputcontroller.updateOutPuts();
                            }
                            var rdLink = ly.getLayerById('referenceLine');
                            rdLink.redraw();
                            ly.getLayerById('edit').bringToBack()

                            $(ly.getLayerById('edit').options._div).unbind();
                        })
                    }

                }
            }
        });
})