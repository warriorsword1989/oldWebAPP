/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxPoiPhoto = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI_PHOTO",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.audataId = data['audataId'];
		this.poiPid = data['poiPid'] || 0;
		this.photoId = data['photoId'] || 0;
		this.photoGuid = data['photoGuid'] || null;
		this.status = data['status'] || null;
		this.attTaskId = data['attTaskId'] || 0;
		this.attOprstatus = data['attOprstatus'] || 0;
		this.attCheckstatus = data['attCheckstatus'] || 0;
		this.fieldTaskId = data['fieldTaskId'] || 0;
		this.fieldTaskSubId = data['fieldTaskSubId'] || null;
		this.poiFieldGuid = data['poiFieldGuid'] || null;
		this.type = data['type'] || 2;
		this.fieldSource = data['fieldSource'];
	},
	getIntegrate: function(){
		var ret = {};
		ret["audataId"] = this.audataId;
		ret["poiPid"] = this.poiPid;
		ret["photoId"] = this.photoId;
		ret["photoGuid"] = this.photoGuid;
		ret["status"] = this.status;
		ret["attTaskId"] = this.attTaskId;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		ret["fieldTaskId"] = this.fieldTaskId;
		ret["fieldTaskSubId"] = this.fieldTaskSubId;
		ret["poiFieldGuid"] = this.poiFieldGuid;
		ret["type"] = this.type;
		ret["fieldSource"] = this.fieldSource;
		return ret;
	}
});