/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.AuIxPoi = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI",
	/*
	 * DB-->UI
	 */
	setAttributes: function(data) {
		this.audataId = data['audataId'];
		this.pid = data['pid'] || 0;
		this.kindCode = data['kindCode'] || null;
		this.geometry = data['geometry'];
		this.xGuide = data['xGuide'] || 0;
		this.yGuide = data['yGuide'] || 0;
		this.linkPid = data['linkPid'] || 0;
		this.side = data['side'] || 0;
		this.nameGroupId = data['nameGroupId'] || 0;
		this.roadFlag = data['roadFlag'] || 0;
		this.pmeshId = data['pmeshId'] || 0;
		this.importance = data['importance'] || 0;
		this.chain = data['chain'] || null;
		this.airportCode = data['airportCode'] || null;
		this.accessFlag = data['accessFlag'] || 0;
		this.open24H = data['open24H'] || 0;
		this.meshId5K = data['meshId5K'] || null;
		this.meshId = data['meshId'] || 0;
		this.regionId = data['regionId'] || 0;
		this.postCode = data['postCode'] || null;
		this.difGroupid = data['difGroupid'] || mull;
		this.editFlag = data['editFlag'] || 1;
		this.state = data['state'] || 0;
		this.fieldState = data['fieldState'] || null;
		this.label = data['label'] || null;
		this.type = data['type'] || 0;
		this.addressFlag = data['addressFlag'] || 0;
		this.exPriority = data['exPriority'] || null;
		this.editionFlag = data['editionFlag'] || null;
		this.poiMemo = data['poiMemo'] || null;
		this.oldBlockcoed = data['oldBlockcoed'] || null;
		this.oldName = data['oldName'] || null;
		this.oldAddress = data['oldAddress'] || null;
		this.oldKind = data['oldKind'] || null;
		this.poiNum = data['poiNum'] || null;
		this.log = data['log'] || null;
		this.dataVersion = data['dataVersion'] || null;
		this.geoTaskId = data['geoTaskId'] || 0;
		this.label = data['label'] || 0;
		this.attTaskId = data['attTaskId'] || 0;
		this.geoOprstatus = data['geoOprstatus'] || 0;
		this.geoCheckstatus = data['geoCheckstatus'] || 0;
		this.attOprstatus = data['attOprstatus'] || 0;
		this.attCheckstatus = data['attCheckstatus'] || 0;
		this.impDate = data['impDate'] || null;
		this.fieldTaskid = data['fieldTaskid'] || 0;
		this.fieldTaskSubId = data['fieldTaskSubId'] || null;
		this.fieldGuid = data['fieldGuid'] || null;
		this.fieldDayTime = data['fieldDayTime'] || null;
		this.fieldSource = data['fieldSource'] || 0;
		this.paramEx1 = data['description'] || null;
		this.paramEx2 = data['description'] || null;
		this.paramEx3 = data['description'] || null;
		this.paramEx4 = data['description'] || null;
		this.verifiedFlag = data['verifiedFlag'] || 9;
	},
	/*
	 * UI-->DB
	 */
	getIntegrate: function(){
		var ret = {};
		ret["audataId"] = this.audataId;
		ret["pid"] = this.pid;
		ret["kindCode"] = this.kindCode;
		ret["geometry"] = this.geometry;
		ret["xGuide"] = this.xGuide;
		ret["yGuide"] = this.yGuide;
		ret["linkPid"] = this.linkPid;
		ret["side"] = this.side;
		ret["nameGroupId"] = this.nameGroupId;
		ret["roadFlag"] = this.roadFlag;
		ret["pmeshId"] = this.pmeshId;
		ret["importance"] = this.importance;
		ret["chain"] = this.chain;
		ret["airportCode"] = this.airportCode;
		ret["accessFlag"] = this.accessFlag;
		ret["open24H"] = this.open24H;
		ret["meshId5K"] = this.meshId5K;
		ret["meshId"] = this.meshId;
		ret["regionId"] = this.regionId;
		ret["postCode"] = this.postCode;
		ret["difGroupid"] = this.difGroupid;
		ret["editFlag"] = this.editFlag;
		ret["state"] = this.state;
		ret["fieldState"] = this.fieldState;
		ret["label"] = this.label;
		ret["type"] = this.type;
		ret["addressFlag"] = this.addressFlag;
		ret["exPriority"] = this.exPriority;
		ret["editionFlag"] = this.editionFlag;
		ret["poiMemo"] = this.poiMemo;
		ret["oldBlockcoed"] = this.oldBlockcoed;
		ret["oldName"] = this.oldName;
		ret["oldAddress"] = this.oldAddress;
		ret["oldKind"] = this.oldKind;
		ret["poiNum"] = this.poiNum;
		ret["log"] = this.log;
		ret["dataVersion"] = this.dataVersion;
		ret["geoTaskId"] = this.geoTaskId;
		ret["label"] = this.label;
		ret["attTaskId"] = this.attTaskId;
		ret["geoOprstatus"] = this.geoOprstatus;
		ret["geoCheckstatus"] = this.geoCheckstatus;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		ret["impDate"] = this.impDate;
		ret["fieldTaskid"] = this.fieldTaskid;
		ret["fieldTaskSubId"] = this.fieldTaskSubId;
		ret["fieldGuid"] = this.fieldGuid;
		ret["fieldDayTime"] = this.fieldDayTime;
		ret["fieldSource"] = this.fieldSource;
		ret["paramEx1"] = this.paramEx1;
		ret["paramEx2"] = this.paramEx2;
		ret["paramEx3"] = this.paramEx3;
		ret["paramEx4"] = this.paramEx4;
		ret["verifiedFlag"] = this.verifiedFlag;
		return ret;
	}
});