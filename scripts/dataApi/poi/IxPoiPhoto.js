/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.IxPoiPhoto = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_PHOTO",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.poiPid = data['poiPid'];
        this.photoId = data['photoId'] || 0;
        this.pid = data['pid'] || "";
        this.status = data['status'] || "";
        this.tag = data['tag'] || 1;
        this.memo = data['memo'] || "";
        this.thumbnailUrl = data['thumbnailUrl'] || this.getThumbnailUrl(this.pid);
        this.originUrl = data['originUrl'] || this.getOriginUrl(this.pid);
        this.rowId = data["rowId"];
    },
    getIntegrate: function() {
        var ret = {};
        ret["poiPid"] = this.poiPid;
        ret["pid"] = this.pid;
        ret["tag"] = this.tag;
        ret["photoId"] = this.photoId;
        ret["status"] = this.status;
        ret["memo"] = this.memo;
        ret["rowId"] = this.rowId;
        return ret;
    },
    getThumbnailUrl:function(pid){
        var url = '';
        url = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + pid + '",type:"thumbnail"}';
        return url;
    },
    getOriginUrl:function(pid){
        var url = '';
        url = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + pid + '",type:"origin"}';
        return url;
    }
});