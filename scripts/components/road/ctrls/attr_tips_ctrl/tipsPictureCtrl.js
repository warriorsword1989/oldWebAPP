/**
 * Created by liwanchong on 2016/3/31.
 */

var tipsPictureApp = angular.module("app");
tipsPictureApp.controller("tipsPictureController", function ($scope, $timeout, $ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.eventController = fastmap.uikit.EventController();
    $("#dataTipsOriginModal").show();
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
    /*图片加载完毕执行回调*/
    var imgLoad = function (url,callback) {
        var img = new Image();
        img.src = url;
        if (img.complete) {
            callback();
        } else {
            img.onload = function () {
                img.onload = null;
                callback();
            };
        };
    };
    $scope.openOrigin = function (id) {
        if ( $scope.picData && id <= $scope.picData.length - 1) {
            $scope.photoId =  id;
            $scope.openshotoorigin =  $scope.picData[id];
            $scope.imgPageNow =  id + 1;
            $scope.showLoading = true;
            var originImg = $("#dataTipsOriginImg");
            originImg.attr("src", App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
            //加载完显示图片,
            // var imgUrl = originImg.attr('src');
            /*imgLoad(imgUrl,function(){
                $scope.showLoading = false;
            });*/
            originImg.smartZoom({'containerClass':'zoomableContainer'});
            document.getElementById("dataTipsOriginModal").style.display = 'block';
        }
    }
    var getCoordInDocumentExample = function(canvasObj){
        canvasObj.onmousemove = function(e){
            var pointer = getCoordInDocument(e);
            $scope.pointX = pointer.x - e.target.getBoundingClientRect().left;
            $scope.pointY = pointer.y - e.target.getBoundingClientRect().top;
            if($scope.pointX < 210){
                if($scope.imgPageNow == 0 || $scope.imgPageNow == 1){
                    $scope.imgSwitchCondition = 0;
                    $scope.switchArrowTitle = '没有上一张了';
                }else{
                    $scope.imgSwitchCondition = -1;
                    $scope.switchArrowTitle = '上一张';
                }
            }else{
                if($scope.imgPageNow == $scope.imgAllPage){
                    $scope.imgSwitchCondition = 0;
                    $scope.switchArrowTitle = '没有下一张了';
                }else{
                    $scope.imgSwitchCondition = 1;
                    $scope.switchArrowTitle = '下一张';
                }
            }
            $scope.$apply()
        }
    }
    var getCoordInDocument = function(e) {
        e = e || window.event;
        var x = e.pageX || (e.clientX +
            (document.documentElement.scrollLeft
            || document.body.scrollLeft));
        var y= e.pageY || (e.clientY +
            (document.documentElement.scrollTop
            || document.body.scrollTop));
        return {'x':x,'y':y};
    }
    getCoordInDocumentExample(document.getElementById("imgContainer"));
    if (selectCtrl.rowKey) {
        $scope.picData = selectCtrl.rowKey.feedback.f_array;
        $scope.openOrigin(selectCtrl.rowKey["pictureId"]);
        $scope.imgAllPage =  $scope.getPicNum();
    }
    /*翻页图片*/
    $scope.switchImg = function(){
        if($scope.imgSwitchCondition == -1){
            switchPic(0);
        }else if($scope.imgSwitchCondition == 1){
            switchPic(1);
        }
    }
    /*tips图片全屏*/
    $scope.showFullPic = function () {
        $("#fullScalePic").show();
        $("#fullScalePic img").attr('src', $("#dataTipsOriginImg").attr('src'));
        $scope.$emit('showRoadFullScreen',true);
    }

    /*图片切换*/
    function switchPic(type) {
        if (type == 0) {
            // console.log('←')
            if ($scope.photoId - 1 >= 0) {
                $scope.openOrigin($scope.photoId - 1);
            }
        } else {
            // console.log('→')
            if ($scope.photoId + 2 <= $scope.imgAllPage) {
                $scope.openOrigin($scope.photoId + 1);
            }
        }
    };
    $scope.closePicContainer=function() {
        selectCtrl.rowKey["pictureId"] = null;
        $("#dataTipsOriginModal").hide();
        // $("#dataTipsOriginImg").hide();
    };

   $scope.$on("TRANSITTIPSPICTURE",function(event,data) {
       $scope.picData = selectCtrl.rowKey.feedback.f_array;
       $scope.openOrigin(selectCtrl.rowKey["pictureId"]);
       $scope.imgAllPage =  $scope.getPicNum();
   })

})