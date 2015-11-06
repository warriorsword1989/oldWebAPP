/**
 * Created by liwanchong on 2015/10/28.
 */
var modifyApp = angular.module("lazymodule", []);
modifyApp.controller("modifyToolController", function ($scope) {

    var selectCtrl = fastmap.uikit.SelectController();
    var shapectl = new fastmap.uikit.ShapeEditorController();
    map.currentTool = shapectl.getCurrentTool();
    shapectl.setMap(map);

    $scope.modifyShape = function (type) {

        $(":button").removeClass("btn btn-default active").addClass("btn btn-default");
        $("#"+type).addClass("btn btn-default active");

        var ly = fastmap.uikit.LayerController();
        if (shapectl.getCurrentTool()['options']) {
            shapectl.stopEditing();
        }
        var feature = null
        if (type == "insertDot") {
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

            //editLyer.options.zindex = 10;


            shapectl.setEditingType('pathVertexInsert');

            shapectl.startEditing();

        }

        if (type == "deleteDot") {
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
            shapectl.setEditingType('pathVertexReMove');

            shapectl.startEditing();
        }
        if (type == "moveDot") {
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
            shapectl.setEditingType('pathVertexMove');

            shapectl.startEditing();
        }
        if (type == "extendDot") {
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
            shapectl.setEditingType('pathBreak');

            shapectl.startEditing();
        }
        //var link = ly.getLayerById('edit').drawGeometry;



        $(document).bind('keypress',
            function(event){

                if(event.keyCode==32){
                    //为了保证捕获到这里时提交的形式正确
                    if(typeof(selectCtrl.selectedFeatures.id)!="undefined"){

                        if(type == 'pathBreak'){

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
                                outputcontroller.pushOutput(data.data);
                                ly.getLayerById('edit').bringToBack()

                                $(ly.getLayerById('edit').options._div).unbind();
                            })

                        }else{
                            var link = shapectl.shapeEditorResult.getFinalGeometry()
                            var coordinate = []
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
                                var resultdata=[];
                                resultdata.push("类型："+data.data.log[0].type+"; pid:"+data.data.log[0].pid+"; 操作:"+data.data.log[0].op);
                                outputcontroller.pushOutput(resultdata);
                                ly.getLayerById('edit').bringToBack()

                                $(ly.getLayerById('edit').options._div).unbind();
                            })
                        }

                    }

                }
        });
    };
})