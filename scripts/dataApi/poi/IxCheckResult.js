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
                this.guide.latitude = data['location'].latitude || 0;
                this.guide.longitude = data['location'].longitude || 0;
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
            this.duppoi = {};
            if(data['duppoi'] && data['duppoi'].length > 0){
                for(var i=0;i<data['duppoi'].length;i++){
                    var dopTmp = new _dupPoi(data['duppoi'][i]);
                    this.duppoi.push(dopTmp);
                }
            }
        }
        function _dupPoi(dpoi){
            this.address = dpoi['address'] || '';
            this.brands = dpoi['brands'] || null;
            this.contacts = dpoi['contacts'] || '';
            this.fid = dpoi['fid'] || null;
            this.kindCode = dpoi['kindCode'] || null;
            this.level = dpoi['level'] || null;
            this.location = dpoi['location'] || null;
            this.name = dpoi['name'] || null;
            this.pid = dpoi['pid'] || null;
            this.postCode = dpoi['postCode'] || null;
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
    }
});