/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.IxPoi = FM.dataApi.GeoDataModel.extend({
	dataModelType: "IX_POI",
	/*
	 * DB-->UI
	 */
	setAttributes: function(data) {
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
		this.difGroupid = data['difGroupid'] || null;
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
		this.taskId = data["taskId"] || 0
		this.dataVersion = data['dataVersion'] || null;
		this.fieldTaskid = data['fieldTaskid'] || 0;
		this.verifiedFlag = data['verifiedFlag'] || 9;
		this.collectTime = data['collectTime'] || null;
		this.geoAdjustFlag = data['geoAdjustFlag'] || 9;
		this.fullAttrFlag = data['fullAttrFlag'] || 9;
		this.level = data['level']
		this.indoor = data['indoor'] || 0;
		this.freshnessVefication = data['freshnessVefication'];
		this.poiRmbIcon = false;
		this.poiCarIcon = false;
		this.poiIcon = false;
		this.vipFlag = data['vipFlag'];
		if(data['vipFlag']){
			var vFlag = data['vipFlag'].split('|');
			if(vFlag.length > 1){
				for(var i=0,len=vFlag.length-1;i<len;i++){
					if(vFlag[i] == 1){
						this.poiRmbIcon = true;
					}else if(vFlag[i] == 2){
						this.poiCarIcon = true;
					}else if(vFlag[i] == 3){
						this.poiIcon = true;
					}
				}
			}
		};
		//this.name = {}; //主名称
		this.names = [];
		if (data['names']) {
			for (var i = 0, len = data['names'].length; i < len; i++) {
				var obj = new FM.dataApi.IxPoiName(data['names'][i]);
				this.names.push(obj);
				// if(obj.nameClass == 1 && obj.nameType == 2 && obj.langCode == "CHI"){
				// 	this.name = obj;
				// }
			}
		}
		this.address = {};//主地址
		this.addresses = [];
		if(data["addresses"]){
			for (var i = 0, len = data["addresses"].length; i < len; i++) {
				var obj = new FM.dataApi.IxPoiAddress(data["addresses"][i]);
				this.addresses.push(obj);
				// if(obj.langCode == "CHI"){
				// 	this.address = obj;
				// }
			}
		}
		this.contacts = [];
		if (data["contacts"]){
			for (var i = 0 ,len = data["contacts"].length ;i < len ; i++){
				this.contacts.push(new FM.dataApi.IxPoiContact(data["contacts"][i]));
			}
		}
		this.photos = [];
		if (data['photos']){
			for (var i = 0 ,len = data['photos'].length ;i < len ; i++){
				this.photos.push(new FM.dataApi.IxPoiPhoto(data['photos'][i]));
			}
		}
		this.tempPhotos = [];
		if (data['photos']){
			for (var i = 0 ,len = data['photos'].length ;i < len ; i++){
				this.tempPhotos.push(new FM.dataApi.IxPoiPhoto(data['photos'][i]));
			}
		}
		this.children = [];
		if(data["children"]){
			for (var i = 0 ,len = data["children"].length ;i < len ; i++){
				this.children.push(new FM.dataApi.IxPoiChildren(data["children"][i]));
			}
		}
		this.parents = [];
		if(data['parents']){
			for (var i = 0 ,len = data['parents'].length ;i < len ; i++){
				this.parents.push(new FM.dataApi.IxPoiParent(data['parents'][i]));
			}
		}
		this.buildings = [];
		if(data['buildings']){
			for (var i = 0 ,len = data['buildings'].length ;i < len ; i++){
				this.buildings.push(new FM.dataApi.IxPoiBuilding(data['buildings'][i]));
			}
		}
		this.gasstations = [];
		if(data['gasstations']){
			for (var i = 0 ,len = data['gasstations'].length ;i < len ; i++){
				this.gasstations.push(new FM.dataApi.IxPoiGasstation(data['gasstations'][i]));
			}
		}
		this.hotels = [];
		if(data["hotels"]){
			for (var i = 0 ,len = data["hotels"].length ;i < len ; i++){
				this.hotels.push(new FM.dataApi.IxPoiHotel(data["hotels"][i]));
			}
		}
		this.restaurants = [];
		if(data["restaurants"]){
			for (var i = 0 ,len = data["restaurants"].length ;i < len ; i++){
				this.restaurants.push(new FM.dataApi.IxPoiRestaurant(data["restaurantes"][i]));
			}
		}
		this.samePois = [];
		if(data["samePois"]){
			for (var i = 0 ,len = data["samePois"].length ;i < len ; i++){
				this.samePois.push(new FM.dataApi.IxSamepoi(data["samePois"][i]));
			}
		}
		this.samePoiParts = [];
		if(data["samePoiParts"]){
			for (var i = 0 ,len = data["samePoiParts"].length ;i < len ; i++){
				this.samePoiParts.push(new FM.dataApi.IxSamepoiPart(data["samePoiParts"][i]));
			}
		}
		this.parkings = [];
		if(data["parkings"]){
			for (var i = 0 ,len = data["parkings"].length ;i < len ; i++){
				this.parkings.push(new FM.dataApi.IxPoiParking(data["parkings"][i]));
			}
		}
	},
	/*
	 * UI-->DB
	 */
	getIntegrate: function(){
		var ret = {};
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
		ret["taskId"] = this.taskId;
		ret["dataVersion"] = this.dataVersion;
		ret["fieldTaskid"] = this.fieldTaskid;
		ret["verifiedFlag"] = this.verifiedFlag;
		ret["collectTime"] = this.collectTime;
		ret["geoAdjustFlag"] = this.geoAdjustFlag;
		ret["fullAttrFlag"] = this.fullAttrFlag;
		ret["level"] = this.level;
		ret["indoor"] = this.indoor;
		ret["vipFlag"] = this.vipFlag;
		ret["freshnessVefication"] = this.freshnessVefication;

		ret["names"] = [];
		if(this.names){
			for (var i = 0 , len = this.names.length ; i < len ; i ++){
				ret["names"].push(this.names[i].getIntegrate());
			}
		}
		ret["addresses"] = [];
		if(this.addresses){
			for (var i = 0 , len = this.addresses.length ; i < len ; i ++){
				ret["addresses"].push(this.addresses[i].getIntegrate());
			}
		}
		ret["contacts"] = [];
		if(this.contacts){
			for (var i = 0 , len = this.contacts.length ; i < len ; i ++){
				ret["contacts"].push(this.contacts[i].getIntegrate());
			}
		}
		ret["photos"] = [];
		if(this.photos){
			for (var i = 0 , len = this.photos.length ; i < len ; i ++){
				ret["photos"].push(this.photos[i].getIntegrate());
			}
		}
		ret["children"] = [];
		if(this.children){
			for (var i = 0 , len = this.children.length ; i < len ; i ++){
				ret["children"].push(this.children[i].getIntegrate());
			}
		}
		ret["parents"] = [];
		if(this.parents){
			for (var i = 0 , len = this.parents.length ; i < len ; i ++){
				ret["parents"].push(this.parents[i].getIntegrate());
			}
		}
		ret["buildings"] = [];
		if(this.buildings){
			for (var i = 0 , len = this.buildings.length ; i < len ; i ++){
				ret["buildings"].push(this.buildings[i].getIntegrate());
			}
		}
		ret["gasstationes"] = [];
		if(this.gasstationes){
			for (var i = 0 , len = this.gasstationes.length ; i < len ; i ++){
				ret["gasstationes"].push(this.gasstationes[i].getIntegrate());
			}
		}
		ret["hotels"] = [];
		if(this.gasstationes){
			for (var i = 0 , len = this.hotels.length ; i < len ; i ++){
				ret["hotels"].push(this.hotels[i].getIntegrate());
			}
		}
		ret["restaurantes"] = [];
		if(this.restaurantes){
			for (var i = 0 , len = this.restaurantes.length ; i < len ; i ++){
				ret["restaurantes"].push(this.restaurantes[i].getIntegrate());
			}
		}
		ret["samePois"] = [];
		if(this.samePois){
			for (var i = 0 , len = this.samePois.length ; i < len ; i ++){
				ret["samePois"].push(this.samePois[i].getIntegrate());
			}
		}
		ret["samePoiParts"] = [];
		if(this.samePoiParts){
			for (var i = 0 , len = this.samePoiParts.length ; i < len ; i ++){
				ret["samePoiParts"].push(this.samePoiParts[i].getIntegrate());
			}
		}
		return ret;
	}
});