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
		this.status = data['status'] || null;
		this.memo = data['memo'] || 0;
		this.thumbnailUrl = data['thumbnailUrl'] || App.Config.generalUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + this.photoId + '",type:"thumbnail"}';
		this.originUrl = data['originUrl'] || App.Config.generalUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + this.photoId + '",type:"origin"}';
		this.rowId = data["rowId"];
	},
	getIntegrate: function(){
		var ret = {};
		ret["poiPid"] = this.poiPid;
		ret["photoId"] = this.photoId;
		ret["status"] = this.status;
		ret["memo"] = this.memo;
		ret["rowId"] = this.rowId;
		return ret;
	}
});