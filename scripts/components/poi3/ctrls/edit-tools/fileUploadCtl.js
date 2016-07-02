angular.module('app').controller('FileUploadCtl', ['$scope', 'FileUploader', function($scope,FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
            url: App.Util.getFullUrl('dropbox/upload/resource'),
            formData:[{'parameter':JSON.stringify({'filetype':'photo','dbId':App.Temp.dbId,'pid':$scope.selectPoi})}],
        }),
        imgItems = [];

    // FILTERS

    uploader.filters.push({
        name: 'fileFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif'.indexOf(type) !== -1;
        }
    });

    /*判断filetype*/
    function chargeFileType(file){
        if(file.type.indexOf('image') > -1){
            uploader.formData[0].filetype = 'photo';
        }else{
            uploader.formData[0].filetype = 'audio';
        }
    }

    // CALLBACKS
    /*添加上传文件失败*/
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    /*添加完所有文件*/
    uploader.onAfterAddingFile = function(fileItem) {
        // console.info('onAfterAddingFile', fileItem);
    };
    uploader.onBeforeUploadItem = function(item) {
        $scope.showProgress = true;
    };

    uploader.onAfterAddingAll = function(addedFileItems) {
        // console.info('onAfterAddingAll', addedFileItems);
    };
    /*uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };*/
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.log(response)
        if(response.errcode == 0){
            var img = new FM.dataApi.IxPoiPhoto({
                thumbnailUrl:App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + response.data.PID + '",type:"thumbnail"}',
                originUrl:App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + response.data.PID + '",type:"origin"}'
            });
            imgItems.push(img);
            $scope.poi.photos.push(img);
            $scope.$emit("refreshPhoto",true);
        }
        // console.info('onSuccessItem', fileItem, response, status, headers);
    };
    /*移除文件*/
    uploader.remove = function(){
        if($scope.uploader.queue.length == 0){
            $scope.showProgress = false;
        }
    }
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        // console.info('onErrorItem', fileItem, response, status, headers);
    };
    /*uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };*/
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        // console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        $scope.$emit('getImgItems',imgItems);
        if($scope.uploader.progress == 100){
            $scope.showProgress = false;
        }
    };
}]);