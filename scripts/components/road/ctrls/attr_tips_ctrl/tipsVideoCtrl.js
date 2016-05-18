/**
 * Created by liwanchong on 2016/3/31.
 */

var tipsVideoApp = angular.module("mapApp");
tipsVideoApp.controller("tipsVideoController", function ($scope, $timeout, $ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.eventController = fastmap.uikit.EventController();
    $("#dataTipsVideoModal").show()
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
        //document.getElementById("dataTipsVideoModal").style.display = 'block';
        if ( $scope.picData && id <= $scope.picData.length - 1) {
            //$scope.photoId =  id;
            //$scope.openshotoorigin =  $scope.picData[id];
            //$scope.imgPageNow =  id + 1;
            //$scope.showLoading = true;
            //var originImg = $("#dataTipsVideoModal");
            //originImg.attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
            ////加载完显示图片,
            //// var imgUrl = originImg.attr('src');
            ///*imgLoad(imgUrl,function(){
            // $scope.showLoading = false;
            // });*/
            //originImg.smartZoom({'containerClass':'zoomableContainer'});
            document.getElementById("dataTipsVideoModal").style.display = 'block';
        }
    }
    if (selectCtrl.rowKey) {
        $scope.picData = selectCtrl.rowKey.feedback.f_array;
        $scope.openOrigin(selectCtrl.rowKey["pictureId"]);
        $scope.imgAllPage =  $scope.getPicNum();
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
        $("#dataTipsVideoModal").hide();
        // $("#dataTipsOriginImg").hide();
    };

   $scope.$on("TRANSITTIPSPICTURE",function(event,data) {
       $scope.picData = selectCtrl.rowKey.feedback.f_array;
       $scope.openOrigin(selectCtrl.rowKey["pictureId"]);
       $scope.imgAllPage =  $scope.getPicNum();
   })

})