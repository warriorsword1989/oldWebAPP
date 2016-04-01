/**
 * Created by liwanchong on 2016/3/31.
 */

var tipsPictureApp = angular.module("mapApp", ['oc.lazyLoad']);
tipsPictureApp.controller("tipsPictureController", function ($scope, $timeout, $ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.eventController = fastmap.uikit.EventController();
    $("#dataTipsOriginModal").show()
    $scope.picData = null;
    $scope.getPicNum=function() {
        var num = 0;
        $scope.photoTipsData = selectCtrl.rowKey.feedback.f_array;
        for (var i in  $scope.photoTipsData) {
            if ($scope.photoTipsData[i].type === 1) {
                num++;
            }

        }
        return num;
    };
    $scope.openOrigin = function (id) {
        if ( $scope.picData&&  id<= $scope.picData.length - 1) {
            $scope.photoId =  id;
            $scope.openshotoorigin =   $scope.picData[id];
            $scope.imgPageNow =  id + 1;
            var originImg = $("#dataTipsOriginImg");
            originImg.attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
            $("#dataTipsOriginImg").bind('load',function(){
                originImg.hide();
                originImg.smartZoom('destroy');
                if($(".zoomableContainer").length == 0){
                    $("#dataTipsOriginModal").width(parseInt($("#mainContent").width())-244);
                    originImg.smartZoom({'containerClass':'zoomableContainer'});
                }
                $("#dataTipsOriginModal").show();
                originImg.show();
            })
        }
    }
    if (selectCtrl.rowKey) {
        $scope.picData = selectCtrl.rowKey.feedback.f_array;
        $scope.openOrigin(selectCtrl.rowKey["pictureId"]);
        $scope.imgAllPage =  $scope.getPicNum();
    }
    /*tips图片全屏*/
    $scope.showFullPic = function () {
        $("#fullScalePic img").attr('src', $("#dataTipsOriginImg").attr('src'));
        $("#fullScalePic").show();
    }

    /*图片切换*/
    $scope.switchPic = function (type) {
        if (type == 0) {
            if ($scope.photoId - 1 >= 0) {
                $scope.openOrigin($scope.photoId - 1);
            }
        } else {
            if ($scope.photoId + 2 <= $scope.imgAllPage) {
                $scope.openOrigin($scope.photoId + 1);
            }
        }
    };
    $scope.closePicContainer=function() {
        selectCtrl.rowKey["pictureId"] = null;
        $("#dataTipsOriginModal").hide();
        $("#dataTipsOriginImg").hide();
    };

   $scope.$on("TRANSITTIPSPICTURE",function(event,data) {
       $scope.picData = selectCtrl.rowKey.feedback.f_array;
       $scope.openOrigin(selectCtrl.rowKey["pictureId"]);
       $scope.imgAllPage =  $scope.getPicNum();
   })

})