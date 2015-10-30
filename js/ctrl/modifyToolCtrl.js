/**
 * Created by liwanchong on 2015/10/28.
 */
var modifyApp = angular.module("lazymodule", []);
modifyApp.controller("modifyToolController",function($scope) {

    var selectCtrl = fastmap.uikit.SelectController();
 $scope.modifyShape=function(type) {
     var feature = selectCtrl.selectedFeatures;
     if(type="insertDot") {
         var shapectl =new  fastmap.uikit.ShapeEditorController();
         shapectl.setMap(map);
         shapectl.setEditingType('pathVertexMove');
         var sobj = new fastmap.uikit.ShapeEditorResult();
         sobj.setOriginalGeometry(feature);
         sobj.setFinalGeometry(feature);
         shapectl.startEditing(sobj);
     }
 };
})