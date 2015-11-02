/**
 * Created by liwanchong on 2015/10/28.
 */
var modifyApp = angular.module("lazymodule", []);
modifyApp.controller("modifyToolController", function ($scope) {

    var selectCtrl = fastmap.uikit.SelectController();
    var shapectl = new fastmap.uikit.ShapeEditorController();
    shapectl.setMap(map);
    $scope.modifyShape = function (type) {
        var ly = fastmap.uikit.LayerController();
        if (shapectl.getCurrentTool()['options']) {
            shapectl.stopEditing();
        }
        var feature = null
        if (type == "insertDot") {

            if (!shapectl.shapeEditorResult.getFinalGeometry()) {
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                editLyer.bringToFront();
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

            if (!shapectl.shapeEditorResult.getFinalGeometry()) {
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                editLyer.bringToFront();
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

            if (!shapectl.shapeEditorResult.getFinalGeometry()) {
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                editLyer.bringToFront();
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

            if (!shapectl.shapeEditorResult.getFinalGeometry()) {
                var feature = selectCtrl.selectedFeatures.geometry;
                var editLyer = ly.getLayerById('edit');
                editLyer.bringToFront();
                var sobj = shapectl.shapeEditorResult;
                editLyer.drawGeometry = feature;
                editLyer.draw(feature, editLyer);
                sobj.setOriginalGeometry(feature);
                sobj.setFinalGeometry(feature);
            }
            shapectl.setEditingType('pathVertexAdd');

            shapectl.startEditing();
        }
        //var link = ly.getLayerById('edit').drawGeometry;


        var coordinate1 = []
        for(var index in selectCtrl.selectedFeatures.geometry.components){
            coordinate1.push([selectCtrl.selectedFeatures.geometry.components[index].x, selectCtrl.selectedFeatures.geometry.components[index].y]);
        }


        $(document).bind('keypress',
            function(event){
                if(event.keyCode==32){

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
                        outputcontroller.pushOutput(data.data);
                        ly.getLayerById('edit').bringToBack()

                        $(ly.getLayerById('edit').options._div).unbind();
                    })
                }

        });


    };
})