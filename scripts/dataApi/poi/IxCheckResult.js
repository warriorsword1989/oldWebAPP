/**
 * Created by chenxiao on 2016/4/21.
 */
FM.dataApi.IxCheckResult = FM.dataApi.DataModel.extend({
    dataModelType: "IX_CHECK_RESULT",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        function _refFt(data){
            /*检查结果*/
            this.fid = data["fid"] || null;
            this.pid = data["pid"] || 0;
            this.name = data["name"] || null;
            this.kindCode = data["kindCode"];
            this.lifecycle = data['lifecycle'] || null;
            this.auditStatus = data['auditStatus'];
            this.rowkey = data['rowkey'] || null;
            this.level = data['level'] || null;
            this.checkResultNum = data['checkResultNum'] || null;
            this.address = data['address'] || null;
            this.guide = {};
            if(data['guide']){
                this.guide.latitude = data['guide'].latitude || 0;
                this.guide.longitude = data['guide'].longitude || 0;
                this.guide.linkPid = data['guide'].linkPid || 0;
            }
            this.location = {};
            if(data['location']){
                this.location.latitude = data['location'].latitude || 0;
                this.location.longitude = data['location'].longitude || 0;
            }
            this.attachments = [];
            if (data["attachments"] && data["attachments"].length > 0) {
                for (var i = 0 , len = data["attachments"].length ; i < len; i++) {
                    if (data["attachments"][i].type == 1) { //表示图片
                        var attachment = new FM.dataApi.IxPoiImage(data["attachments"][i]);
                        this.attachments.push(attachment);
                    }
                }
            }
            /*冲突检测*/
            this.conflictFields = data['conflictFields'] || '';
            this.duppoi = data['duppoi'];
        }
        this.errorCode = data['errorCode'] || null;
        this.errorMsg = data['errorMsg'] || null;
        this.fields = [];
        if(data['fields'] && data['fields'].length > 0){
            for(var i=0;i<data['fields'].length;i++){
                var fieldName = data['fields'][i];
                this.fields.push(fieldName);
            }
        }

        this.description = data['description'] || null;
        this.refFeatures = [];
        if(data['refFeatures'] && data['refFeatures'].length > 0){
            for(var i=0;i<data['refFeatures'].length;i++){
                var refFt = new _refFt(data['refFeatures'][i]);
                this.refFeatures.push(refFt);
            }
        }
        this.type = data['type'] || 0;
        if(this.description){
            this.type = 2;
        }
        this.poiType = '';
        if(this.errorCode == 'FM-YW-20-215' || this.errorCode == 'FM-YW-20-216'){
            this.poiType = this.errorCode == 'FM-YW-20-215' ? '重复' : '冲突';
        }
        /*区分是ekException还是checkResult*/
        this.exceptionFlag = this.description?1:0;
    },
    getIntegrate: function(){
        var ret = {},
            ref = this.refFeatures[0];
        if(!ref){
            return;
        }
        ret["errorCode"] = ref.errorCode;
        if(ref.exceptionFlag == 0){
            ret["fid"] = ref.fid;
            ret["pid"] = ref.pid;
            ret["name"] = ref.name;
            ret["kindCode"] = ref.kindCode;
            ret["lifecycle"] = ref.lifecycle;
            ret["severity"] = ref.severity;
            ret["rowkey"] = ref.rowkey;
            ret["level"] = ref.level;
            ret["checkResultNum"] = ref.checkResultNum;
            ret["address"] = ref.address;
            ret['guide'] = {};
            if(ref.guide){
                ret['guide'].latitude = ref.guide.latitude;
                ret['guide'].longitude = ref.guide.longitude;
                ret['guide'].linkPid = ref.guide.linkPid;
            }
            ret['location'] = {};
            if(ref.location){
                ret['location'].latitude = ref.location.latitude;
                ret['location'].longitude = ref.location.longitude;
            }
            ret['attachments'] = [];
            if (ref.attachments && ref.attachments.length > 0) {
                for (var i = 0 , len = ref.attachments.length ; i < len; i++) {
                    if (ref.attachments[i].type == 1) { //表示图片
                        var attachment = new FM.dataApi.IxPoiImage(ref.attachments[i]);
                        ret['attachments'].push(attachment);
                    }
                }
            }
            ret["conflictFields"] = ref.conflictFields;
            ret["duppoi"] = ref.duppoi;
            ret["errorMsg"] = ref.errorMsg;
            ret['fields'] = [];
            if (ref.fields && ref.fields.length > 0) {
                for (var i = 0 , len = ref.fields.length ; i < len; i++) {
                    var fieldName = ref.fields[i];
                    ret['fields'].push(fieldName);
                }
            }
            ret['refFeatures'] = [];
            if (ref.refFeatures && ref.refFeatures.length > 0) {
                for (var i = 0 , len = ref.refFeatures.length ; i < len; i++) {
                    var refFt = ref.refFeatures[i];
                    ret['refFeatures'].push(refFt);
                }
            }
        }else{      //ekException
            ret['description'] = ref.description;
        }
        return ret;
    },
    setCheckRule:function(data){
        /*检查规则赋值type*/
        this.type = data;
    }
});