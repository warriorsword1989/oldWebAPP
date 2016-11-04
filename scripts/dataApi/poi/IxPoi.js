/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.IxPoi = FM.dataApi.GeoDataModel.extend({
    geoLiveType: "IX_POI",
    /*
     * DB-->UI
     */
    setAttributes: function(data) {
        this.pid = data['pid'] || 0;
        this.rowId = data['rowId'] || "";
        this.kindCode = data['kindCode'] || "0";
        this.geometry = data['geometry'];
        this.xGuide = data['xGuide'] || 0;
        this.yGuide = data['yGuide'] || 0;
        this.linkPid = data['linkPid'] || 0;
        this.side = data['side'] || 0;
        this.nameGroupid = data['nameGroupid'] || 0;
        this.roadFlag = data['roadFlag'] || 0;
        this.pmeshId = data['pmeshId'] || 0;
        this.importance = data['importance'] || 0;
        this.chain = data['chain'] || null;
        this.airportCode = data['airportCode'] || null;
        this.accessFlag = data['accessFlag'] || 0;
        this.open24h = data['open24h'] || 0;
        this.meshId5K = data['meshId5K'] || null;
        this.meshId = data['meshId'] || 0;
        this.regionId = data['regionId'] || 0;
        this.postCode = data['postCode'] || null;
        this.difGroupid = data['difGroupid'] || null;
        this.editFlag = data['editFlag'] || 1;
        this.state = data['state'] || 0;
        this.fieldState = data['fieldState'] || null;
        // var labelArr =  data["label"] ? data["label"].split("|") : [];
        // this.label = {};
        // for (var i = 0; i < labelArr.length; i++) {
        //     this.label[labelArr[i]] = true;
        // }

        var sportsVenueArr =  data["sportsVenue"] ? data["sportsVenue"].split("|") : [];
        this.sportsVenue = {};
        for (var i = 0; i < sportsVenueArr.length; i++) {
            this.sportsVenue[sportsVenueArr[i]] = true;
        }
        //this.label = data['label'] || null;
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
        this.taskId = data["taskId"] || 0;
        this.dataVersion = data['dataVersion'] || null;
        this.fieldTaskid = data['fieldTaskid'] || 0;
        this.verifiedFlag = data['verifiedFlag'] || 9;
        this.collectTime = data['collectTime'] || null;
        this.geoAdjustFlag = data['geoAdjustFlag'] || 9;
        this.fullAttrFlag = data['fullAttrFlag'] || 9;
        this.truckFlag = data['truckFlag'] || 0;
        this.level = data['level'];
        this.indoor = data['indoor'] || 0;
        this.freshnessVefication = data['freshnessVefication'];
        this.status = data['status'] || 0;
        this.uRecord = data['uRecord'] || 0;
        this.uFields = data['uFields'] || 0;
        this.uDate = data['uDate'] || null;
        if(data['icons'].length){
            this.poi3DIcon = true;
        }else{
            this.poi3DIcon = false;
        }
        this.poiRmbIcon = false;
        this.poiCarIcon = false;
        this.poiIcon = false;
        this.vipFlag = data['vipFlag'];
        if (data['vipFlag']) {
            var vFlag = data['vipFlag'].split('|');
            if (vFlag.length > 1) {
                for (var i = 0, len = vFlag.length - 1; i < len; i++) {
                    if (vFlag[i] == 1) {
                        this.poiRmbIcon = true;
                    } else if (vFlag[i] == 2) {
                        this.poiCarIcon = true;
                    } else if (vFlag[i] == 3) {
                        this.poiIcon = true;
                    }
                }
            }
        };
        this.guide = {
            "type": "Point",
            "coordinates": [
                data['xGuide'], data['yGuide']
            ]
        };
        this.name = {}; //主名称
        this.names = [];
        if (data['names']) {
            for (var i = 0, len = data['names'].length; i < len; i++) {
                var obj = new FM.dataApi.IxPoiName(data['names'][i]);
                this.names.push(obj);
            }
        }
        this.address = {}; //主地址
        this.addresses = [];
        if (data["addresses"]) {
            for (var i = 0, len = data["addresses"].length; i < len; i++) {
                var obj = new FM.dataApi.IxPoiAddress(data["addresses"][i]);
                this.addresses.push(obj);
            }
        }
        this.contacts = [];
        if (data["contacts"]) {
            for (var i = 0, len = data["contacts"].length; i < len; i++) {
            	if(data["contacts"][i].contactType == 1 || data["contacts"][i].contactType == 2){
            		this.contacts.push(new FM.dataApi.IxPoiContact(data["contacts"][i]));
            	}
            }
        }
        this.photos = [];
        if (data['photos']) {
            for (var i = 0, len = data['photos'].length; i < len; i++) {
                this.photos.push(new FM.dataApi.IxPoiPhoto(data['photos'][i]));
            }
        }
        this.children = [];
        if (data["children"]) {
            for (var i = 0, len = data["children"].length; i < len; i++) {
                this.children.push(new FM.dataApi.IxPoiChildren(data["children"][i]));
            }
        }
        this.parents = [];
        if (data['parents']) {
            for (var i = 0, len = data['parents'].length; i < len; i++) {
                this.parents.push(new FM.dataApi.IxPoiParent(data['parents'][i]));
            }
        }
        this.buildings = [];
        if (data['buildings']) {
            for (var i = 0, len = data['buildings'].length; i < len; i++) {
                this.buildings.push(new FM.dataApi.IxPoiBuilding(data['buildings'][i]));
            }
        }
        this.gasstations = [];
        if (data['gasstations']) {
            if (data['gasstations'].length == 0) {
                this.gasstations = [new FM.dataApi.IxPoiGasstation({"_flag_":true})]; //深度信息特殊处理,服务如果返回的是空数组，需要将数组中增加空对象,用于在ObjectEditController.js中保存时会将falg=true认为是新增加的.
            } else {
                for (var i = 0, len = data['gasstations'].length; i < len; i++) {
                    this.gasstations.push(new FM.dataApi.IxPoiGasstation(data['gasstations'][i]));
                }
            }
        }
        this.hotels = [];
        if (data["hotels"]) {
            if (data["hotels"].length == 0) {
                this.hotels = [new FM.dataApi.IxPoiHotel({"_flag_":true})]; //深度信息特殊处理,服务如果返回的是空数组，需要将数组中增加空对象,用于在ObjectEditController.js中保存时会将falg=true认为是新增加的.
            } else {
                for (var i = 0, len = data["hotels"].length; i < len; i++) {
                    this.hotels.push(new FM.dataApi.IxPoiHotel(data["hotels"][i]));
                }
            }
        }
        this.restaurants = [];
        if (data["restaurants"]) {
            if (data["restaurants"].length == 0) {
                this.restaurants = [new FM.dataApi.IxPoiRestaurant({"_flag_":true})]; //深度信息特殊处理,服务如果返回的是空数组，需要将数组中增加空对象,用于在ObjectEditController.js中保存时会将falg=true认为是新增加的.
            } else {
                for (var i = 0, len = data["restaurants"].length; i < len; i++) {
                    this.restaurants.push(new FM.dataApi.IxPoiRestaurant(data["restaurants"][i]));
                }
            }
        }
        this.parkings = [];
        if (data["parkings"]) {
            if (data["parkings"].length == 0) {
                this.parkings = [new FM.dataApi.IxPoiParking({"_flag_":true})]; //深度信息特殊处理,服务如果返回的是空数组，需要将数组中增加对象,用于在ObjectEditController.js中保存时会将falg=true认为是新增加的.
            } else {
                for (var i = 0, len = data["parkings"].length; i < len; i++) {
                    this.parkings.push(new FM.dataApi.IxPoiParking(data["parkings"][i]));
                }
            }
        }
        this.chargingstations = [];
        if (data["chargingstations"]) {
            if (data["chargingstations"].length == 0) {
                this.chargingstations = [new FM.dataApi.IxPoiChargingstation({"_flag_":true})]; //深度信息特殊处理,服务如果返回的是空数组，需要将数组中增加对象,用于在ObjectEditController.js中保存时会将falg=true认为是新增加的.
            } else {
                for (var i = 0, len = data["chargingstations"].length; i < len; i++) {
                    this.chargingstations.push(new FM.dataApi.IxPoiChargingstation(data["chargingstations"][i]));
                }
            }
        }
        this.chargingplots = [];
        if (data["chargingplots"]) {
            if (data["chargingplots"].length == 0) {
                this.chargingplots = [new FM.dataApi.IxPoiChargingplot({"_flag_":true})]; //深度信息特殊处理,服务如果返回的是空数组，需要将数组中增加对象,用于在ObjectEditController.js中保存时会将falg=true认为是新增加的.
            } else {
                for (var i = 0, len = data["chargingplots"].length; i < len; i++) {
                    this.chargingplots.push(new FM.dataApi.IxPoiChargingplot(data["chargingplots"][i]));
                }
            }
        }
        this.samePois = [];
        if (data["samePois"]) {
            for (var i = 0, len = data["samePois"].length; i < len; i++) {
                this.samePois.push(new FM.dataApi.IxSamepoi(data["samePois"][i]));
            }
        }
        this.samepoiParts = [];
        if (data["samepoiParts"]) {
            for (var i = 0, len = data["samepoiParts"].length; i < len; i++) {
                this.samepoiParts.push(new FM.dataApi.IxSamepoiPart(data["samepoiParts"][i]));
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function() {
        var ret = {};
        ret["pid"] = this.pid;
        ret["rowId"] = this.rowId;
        ret["kindCode"] = this.kindCode=="0"?"":this.kindCode;
        //ret["geometry"] = this.geometry;
        //ret["xGuide"] = this.xGuide;
        //ret["yGuide"] = this.yGuide;
        //ret["linkPid"] = this.linkPid;
        ret["side"] = this.side;
        ret["nameGroupid"] = this.nameGroupid;
        ret["roadFlag"] = this.roadFlag;
        ret["pmeshId"] = this.pmeshId;
        ret["importance"] = this.importance;
        ret["chain"] = this.chain;
        ret["airportCode"] = this.airportCode;
        ret["accessFlag"] = this.accessFlag;
        ret["open24h"] = this.open24h;
        ret["meshId5K"] = this.meshId5K;
        ret["meshId"] = this.meshId;
        ret["regionId"] = this.regionId;
        ret["postCode"] = this.postCode;
        ret["difGroupid"] = this.difGroupid;
        ret["editFlag"] = this.editFlag;
        ret["state"] = this.state;
        ret["fieldState"] = this.fieldState;
        var sportsVenueArr = [];
        for (var key in this.sportsVenue) {
            if (this.sportsVenue[key]) {
                sportsVenueArr.push(key);
            }
        }
        ret["sportsVenue"] = sportsVenueArr.join("|").substr(0,3);
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
        ret["truckFlag"] = this.truckFlag;
        ret["level"] = this.level;
        ret["indoor"] = this.indoor;
        ret["vipFlag"] = this.vipFlag;
        ret["freshnessVefication"] = this.freshnessVefication;
        ret['status'] = this.status;
        ret['uRecord'] = this.uRecord;
        //ret["xGuide"] = this.guide.coordinates[0];
        //ret["yGuide"] = this.guide.coordinates[1];
        ret["names"] = [];
        if (this.names) {
            if (this.names.length > 0) {
                // if (this.name && !FM.Util.isEmptyObject(this.name) && this.name.name != "") {
                //     var flag = true;
                //     for (var i = 0, len = this.names.length; i < len; i++) {
                //         if (this.name.langCode == this.names[i].langCode && this.name.nameClass == this.names[i].nameClass && this.name.nameType == this.names[i].nameType) {
                //             flag = false;
                //             break;
                //         }
                //     }
                //     if (flag) {
                //         this.names.push(this.name);
                //     }
                // }
                for (var i = 0, len = this.names.length; i < len; i++) {
                    ret["names"].push(this.names[i].getIntegrate());
                }
            } else {
                if (!FM.Util.isEmptyObject(this.name) && this.name.name != "") {
                    ret["names"].push(this.name.getIntegrate());
                }
            }
        }
        ret["addresses"] = [];
        if (this.addresses) {
            if (this.addresses.length > 0) {
                // if (this.address && !FM.Util.isEmptyObject(this.address) && this.address.fullname != "") {
                //     var flag = true;
                //     for (var i = 0, len = this.addresses.length; i < len; i++) {
                //         if (this.address.langCode == this.addresses[i].langCode) {
                //             flag = false;
                //             break;
                //         }
                //     }
                //     if (flag) {
                //         this.addresses.push(this.address);
                //     }
                // }
                for (var i = 0, len = this.addresses.length; i < len; i++) {
                    ret["addresses"].push(this.addresses[i].getIntegrate());
                }
            } else {
                if (!FM.Util.isEmptyObject(this.address) && this.address.fullname != "") {
                    ret["addresses"].push(this.address.getIntegrate());
                }
            }
        }
        ret["contacts"] = [];
        if (this.contacts) {
            for (var i = 0, len = this.contacts.length; i < len; i++) {
                ret["contacts"].push(this.contacts[i].getIntegrate());
            }
        }
        ret["photos"] = [];
        if (this.photos) {
            for (var i = 0, len = this.photos.length; i < len; i++) {
                ret["photos"].push(this.photos[i].getIntegrate());
            }
        }
        ret["children"] = [];
        if (this.children) {
            for (var i = 0, len = this.children.length; i < len; i++) {
                ret["children"].push(this.children[i].getIntegrate());
            }
        }
        ret["parents"] = [];
        if (this.parents) {
            for (var i = 0, len = this.parents.length; i < len; i++) {
                ret["parents"].push(this.parents[i].getIntegrate());
            }
        }
        ret["buildings"] = [];
        if (this.buildings) {
            for (var i = 0, len = this.buildings.length; i < len; i++) {
                ret["buildings"].push(this.buildings[i].getIntegrate());
            }
        }
        ret["gasstations"] = [];
        if (this.gasstations) {
            if (this.gasstations.length == 1 && FM.Util.isEmptyObject(this.gasstations[0])) {
                ret["gasstations"] = [];
            } else {
                for (var i = 0, len = this.gasstations.length; i < len; i++) {
                    ret["gasstations"].push(this.gasstations[i].getIntegrate());
                }
            }
        }
        ret["hotels"] = [];
        if (this.hotels) {
            if (this.hotels.length == 1 && FM.Util.isEmptyObject(this.hotels[0])) {
                ret["hotels"] = [];
            } else {
                for (var i = 0, len = this.hotels.length; i < len; i++) {
                    ret["hotels"].push(this.hotels[i].getIntegrate());
                }
            }
        }
        ret["restaurants"] = [];
        if (this.restaurants) {
            if (this.restaurants.length == 1 && FM.Util.isEmptyObject(this.restaurants[0])) {
                ret["restaurants"] = [];
            } else {
                for (var i = 0, len = this.restaurants.length; i < len; i++) {
                    ret["restaurants"].push(this.restaurants[i].getIntegrate());
                }
            }
        }
        ret["parkings"] = [];
        if (this.parkings) {
            if (this.parkings.length == 1 && FM.Util.isEmptyObject(this.parkings[0])) {
                ret["parkings"] = [];
            } else {
                for (var i = 0, len = this.parkings.length; i < len; i++) {
                    ret["parkings"].push(this.parkings[i].getIntegrate());
                }
            }
            // if (this.parkings.length == 1 && FM.Util.isEmptyObject(this.parkings[0])) {
            //     ret["parkings"] = [];
            // } else if(this.parkings[0] instanceof FM.Class){
            //     for (var i = 0, len = this.parkings.length; i < len; i++) {
            //         ret["parkings"].push(this.parkings[i].getIntegrate());
            //     }
            // } else {
            //     for (var i = 0, len = this.parkings.length; i < len; i++) {
            //         ret["parkings"].push(this.parkings[i]);
            //     }
            // }
        }
        ret["chargingstations"] = [];
        if (this.chargingstations) {
            if (this.chargingstations.length == 1 && FM.Util.isEmptyObject(this.chargingstations[0])) {
                ret["chargingstations"] = [];
            } else {
                for (var i = 0, len = this.chargingstations.length; i < len; i++) {
                    ret["chargingstations"].push(this.chargingstations[i].getIntegrate());
                }
            }
        }
        ret["chargingplots"] = [];
        if (this.chargingplots) {
            if (this.chargingplots.length == 1 && FM.Util.isEmptyObject(this.chargingplots[0])) {
                ret["chargingplots"] = [];
            } else {
                for (var i = 0, len = this.chargingplots.length; i < len; i++) {
                    ret["chargingplots"].push(this.chargingplots[i].getIntegrate());
                }
            }
        }
        ret["samePois"] = [];
        if (this.samePois) {
            for (var i = 0, len = this.samePois.length; i < len; i++) {
                ret["samePois"].push(this.samePois[i].getIntegrate());
            }
        }
        ret["samepoiParts"] = [];
        if (this.samepoiParts) {
            for (var i = 0, len = this.samepoiParts.length; i < len; i++) {
                ret["samepoiParts"].push(this.samepoiParts[i].getIntegrate());
            }
        }
        ret["geoLiveType"] = this.geoLiveType;
        return ret;
    },
    getSnapShot: function() { //这样写的原因是为了返回的UI对象
        return new FM.dataApi.IxPoiSnapShot(this.getIntegrate());
    },
});
