/**
 * Created by liwanchong on 2015/10/28.
 */
var modifyApp = angular.module("lazymodule", []);
modifyApp.controller("modifyToolController",function($scope) {
    var editLayer = new  fastmap.mapApi.EditLayer();
    map.addLayer(editLayer);
    var selectCtrl = fastmap.uikit.SelectController();
 $scope.modifyShape=function(type) {
     var feature = selectCtrl.selectedFeatures;
     if(type="insertDot") {
         var linkArr = feature.data.geometry.coordinates, points = [];


         for(var i= 0,len=linkArr.length;i<len;i++) {
             var point = fastmap.mapApi.point(linkArr[i][0],linkArr[i][1]);
            points.push(point);
         }
         var  line= fastmap.mapApi.lineString(points);
         editLayer.drawGeometry = line;
         editLayer.draw(line,editLayer);
         var shapectl =new  fastmap.uikit.ShapeEditorController();
         shapectl.setMap(map);
         shapectl.setEditingType('pathVertexMove');
         var sobj = new fastmap.uikit.ShapeEditorResult();
         sobj.setOriginalGeometry(line);
         sobj.setFinalGeometry(line);
         shapectl.startEditing(sobj);
     }
 };
})