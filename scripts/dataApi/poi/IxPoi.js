/**
 * Created by chenxiao on 2016/4/21.
 */
FM.dataApi.IxPoi = FM.dataApi.GeoDataModel.extend({
    geoLiveType: "IX_POI",
    initialize: function(data) {
        this.setAttributes(data);
    },
    /*
     * UI-->DB
     */
     getIntegrate: function (){
        var ret = {};
        ret['relateParent'] = this.relateParent;
        ret['attachments'] = [];
        if (this.attachments){
            for (var i = 0 ,len = this.attachments.length ;i < len ; i++){
                ret['attachments'].push(this.attachments[i].getIntegrate());
            }
        }
        ret["contacts"] = [];
        if (this.contacts){
            for (var i = 0 ,len = this.contacts.length ;i < len ; i++){
                ret['contacts'].push(this.contacts[i].getIntegrate());
            }
        }
        ret["indoor"] = this.indoor;
        ret['pid'] = this.pid;
        ret['checkResults'] = [];
        if (this.checkResults){
            for (var i = 0 ,len = this.checkResults.length ;i < len ; i++){
                //ret['checkResults'].push(this.checkResults[i].getIntegrate());
            }
        }
        ret['phaseHistory'] = this.phaseHistory;
        ret['synchronizeDate'] = this.synchronizeDate;
        ret['regionInfo'] = this.regionInfo;
        ret['businessTime'] = this.businessTime;
        ret['sportsVenues'] = this.sportsVenues;
        ret['projectHistory'] = this.projectHistory;
        ret['freshnessVerification'] = this.freshnessVerification;
        ret['ckException'] = this.ckException;
        ret['operateDate'] = this.operateDate;
        ret['srcInformation'] = this.srcInformation;
        ret['batchModifyStatus'] = this.batchModifyStatus;
        ret['hospital'] = this.hospital;
        ret['verifyFlags'] = this.verifyFlags;
        ret['chargingPole'] = [];
        if (this.chargingPole){
            for (var i = 0 ,len = this.chargingPole.length ;i < len ; i++){
                //ret['chargingPole'].push(this.chargingPole[i].getIntegrate());
            }
        }
        ret['kindCode'] = this.kindCode;
        ret['chargingStation'] = [];
        if (this.chargingStation){
            for (var i = 0 ,len = this.chargingStation.length ;i < len ; i++){
                //ret['chargingStation'].push(this.chargingStation[i].getIntegrate());
            }
        }
        ret['attraction'] = this.attraction;
        ret['handler'] = this.handler;
        ret['location'] = this.location;
        ret['fid'] = this.fid;
        ret['editHistory'] = [];
        if (this.editHistory){
            for (var i = 0 ,len = this.editHistory.length ;i < len ; i++){
                //ret['editHistory'].push(this.editHistory[i].getIntegrate());
            }
        }
        ret['fieldVerification'] = this.fieldVerification;
        ret['sourceFlags'] = this.sourceFlags;
        ret['website'] = this.website;
        ret['open24H'] = this.open24H;
        ret['evaluateComment'] = this.evaluateComment;
        ret['latestBatchDate'] = this.latestBatchDate;
        ret['importance'] = this.importance;
        ret['parkings'] = this.parkings;
        ret['evaluatePlanning'] = this.evaluatePlanning;
        ret['airportCode'] = this.airportCode;
        ret['hwEntryExit'] = this.hwEntryExit;
        ret['brands'] = this.brands;
        ret['foodtypes'] = this.foodtypes; //需要修改成模型，暂时没有模型先这么写
        ret['evaluateQuality'] = this.evaluateQuality;
        ret['rawFields'] = this.rawFields;
        ret['rental'] = this.rental;
        ret['lifecycle'] = this.lifecycle;
        ret['submitStatus'] = this.submitStatus;
        ret['gasStation'] = this.gasStation;
        ret['name'] = this.name;
        ret['meshid'] = this.meshid;
        ret['evaluateIntegrity'] = this.evaluateIntegrity;
        ret['adminReal'] = this.adminReal;
        ret['hotel'] = this.hotel;
        ret['level'] = this.level;
        ret['relateChildren'] = this.relateChildren;
        ret['rowkey'] = this.rowkey;
        ret['vipFlag'] = this.vipFlag;
        ret['postCode'] = this.postCode;
        ret['adminCode'] = this.adminCode;
        ret['latestMergeDate'] = this.latestMergeDate;
        ret['address'] = this.address;
        ret['checkResultNum'] = this.checkResultNum;
        ret['guide'] = this.guide;
        ret['auditStatus'] = this.auditStatus;
        return ret;
     },
    /*
     * DB-->UI
     */
    setAttributes: function(data) {
        this.relateParent = data["relateParent"] || null;
        //this.attachments = data["attachments"] || [];
        this.attachments = [];
        if (data["attachments"].length > 0) {
            for (var i = 0 , len = data["attachments"].length ; i < len; i++) {
                if (data["attachments"][i].type == 1) { //表示图片
                    var attachment = new FM.dataApi.IxPoiImage(data["attachments"][i]);
                    this.attachments.push(attachment);
                }
            }
        }

        this.contacts = [];
        if (data["contacts"].length > 0) {
            for (var i = 0 , len = data["contacts"].length ; i < len; i++) {
                var contact = new FM.dataApi.IxPoiContact(data["contacts"][i]);
                contact.index = i;
                this.contacts.push(contact)
            }
        }

        this.indoor = data["indoor"] || null;
        this.pid = data["pid"] || 0;
        this.checkResults = [];
        if(data['checkResults'] && data['checkResults'].length > 0){
            for (var i = 0, len = data["checkResults"].length; i < len; i++) {
                var checkResult = new FM.dataApi.IxCheckResult(data["checkResults"][i]);
                this.checkResults.push(checkResult);
            }
        }
        this.phaseHistory = data["phaseHistory"] || [];
        this.synchronizeDate = data['synchronizeDate'];
        this.regionInfo = data['regionInfo'] || 'D';
        this.businessTime = data['businessTime'] || [];
        this.sportsVenues = data['sportsVenues'] || null;
        // 
        this.projectHistory = data["projectHistory"] || null;
        this.freshnessVerification = data["freshnessVerification"] || 0;
        this.ckException = data["ckException"] || [];
        this.operateDate = data["operateDate"] || null;
        this.srcInformation = data["srcInformation"] || null;

        this.batchModifyStatus = data['batchModifyStatus'] || 0;
        this.hospital = data['hospital'] || null;
        this.verifyFlags = data['verifyFlags'] || null;
        //this.chargingPole = data['chargingPole'] || [];

        this.chargingPole = [];
        if (data["chargingPole"]&&data["chargingPole"].length > 0) {
            for (var i = 0, len = data["chargingPole"].length; i < len; i++) {
                var chargingPole = new FM.dataApi.IxPoiChargingPole(data["chargingPole"][i]);
                this.chargingPole.push(chargingPole);
            }
        }
        // 
        this.kindCode = data["kindCode"] || null;
        this.chargingStation = data["chargingStation"] || null;
        this.attraction = data["attraction"] || null;
        this.handler = data["handler"] || 1;
        this.location = data["location"] || null;
        this.fid = data["fid"] || null;
        this.editHistory = [];
        if(data['editHistory'] && data['editHistory'].length > 0){
            for (var i = 0, len = data["editHistory"].length; i < len; i++) {
                var editHistory = new FM.dataApi.IxEditHistory(data["editHistory"][i]);
                this.editHistory.push(editHistory);
            }
        }
        this.fieldVerification = data['fieldVerification'] || 0;
        this.sourceFlags = data['sourceFlags'] || null;
        this.website = data['website'] || null;
        // 
        this.open24H = data["open24H"] || 2;
        this.evaluateComment = data["evaluateComment"] || null;
        this.latestBatchDate = data["latestBatchDate"] || null;
        this.importance = data["importance"] || null;
        this.parkings = data["parkings"] || null;
        this.evaluatePlanning = data["evaluatePlanning"] || null;
        this.airportCode = data['airportCode'] || null;
        this.hwEntryExit = data['hwEntryExit'] || 0;
        this.brands = data['brands'] || [];
        this.foodtypes = data['foodtypes'] || null;
        // 
        this.evaluateQuality = data["evaluateQuality"] || null;
        this.rawFields = data["rawFields"] || null;
        this.rental = data["rental"] || null;
        this.lifecycle = data["lifecycle"] || null;
        this.submitStatus = data["submitStatus"] || 0;
        this.gasStation = data["gasStation"] || null;
        this.name = data['name'] || null;
        this.meshid = data['meshid'] || null;
        this.evaluateIntegrity = data['evaluateIntegrity'] || null;
        this.adminReal = data['adminReal'] || null;
        // 
        this.hotel = data["hotel"] || null;
        this.level = data["level"] || null;
        this.relateChildren = data["relateChildren"] || [];
        this.rowkey = data["rowkey"] || null;
        this.vipFlag = data["vipFlag"] || null;
        this.postCode = data["postCode"] || null;
        this.adminCode = data['adminCode'] || null;
        this.latestMergeDate = data['latestMergeDate'] || null;
        this.address = data['address'] || null;
        this.checkResultNum = data['checkResultNum'] || null;
        // 
        this.guide = data['guide'] || null;
        this.auditStatus = data['auditStatus'] || 0;
    },
    getSnapShot: function() {
        var data = {};
        data["fid"] = this.fid;
        data["pid"] = this.pid;
        data["name"] = this.name;
        data["kindCode"] = this.kindCode;
        data["lifecycle"] = this.lifecycle;
        data["auditStatus"] = this.auditStatus;
        data["rawFields"] = this.rawFields;
        data["location"] = this.location;
        data["guide"] = this.guide;
        return data;
    },
    getBaseInfo: function(){
        var data = {};
        data["fid"] = this.fid;
        data["pid"] = this.pid;
        data["name"] = this.name;
        data["address"] = this.address;
        data["contacts"] = this.contacts;
        data["postCode"] = this.postCode;
        data["kindCode"] = this.kindCode;
        data["brandcode"] = this.brandcode;
        data["level"] = this.level;
        data["relateParent"] = this.relateParent;
        data["relateChildren"] = this.relateChildren;
        data["lifeCycle"] = this.lifeCycle;
        data["auditStatus"] = this.auditStatus;
        data["freshnessVerification"] = this.freshnessVerification;
        data["rawFields"] = this.rawFields;
        data["adminCode"] = this.adminCode;
        data["lifecycle"] = this.lifecycle;
        data["auditStatus"] = this.auditStatus;
        data["rawFields"] = this.rawFields;
        data["open24H"] = this.open24H;
        data["indoor"] = this.indoor;
        return data;
    }, 
    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
                var ret = [],
                    poi;
                for (var i = 0; i < data.data.data.length; i++) {
                    poi = new FM.dataApi.IxPoi(data.data.data[i]);
                    ret.push(poi);
                }
                callback(ret);
            });
        },
        getPoiDetailByFid:function (param, callback) {
            FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
                var poi;
                if (data.errcode == 0) {
                    poi = new FM.dataApi.IxPoi(data.data.data[0]);
                } else {
                    poi = "";
                }
                callback(poi);
            });
        }
    }
});
