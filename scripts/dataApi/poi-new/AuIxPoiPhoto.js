/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxPoiPhoto = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI_PHOTO",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.poiPid = data['poiPid'];
		this.photoId = data['photoId'] || 0;
		this.status = data['status'] || null;
		this.memo = data['memo'] || 0;
		this.uRecord = data['uRecord'] || 0;
		this.uFields = data['uFields'] || 0;
		this.nothing = false;
		this.url = data['url'];
		// this.url = App.Config.generalUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + this.photoId + '",type:"origin"}';
	},
	getIntegrate: function(){
		var ret = {};
		ret["poiPid"] = this.poiPid;
		ret["photoId"] = this.photoId;
		ret["status"] = this.status;
		ret["memo"] = this.memo;
		ret["uRecord"] = this.uRecord;
		ret["uFields"] = this.uFields;
		return ret;
	}
});