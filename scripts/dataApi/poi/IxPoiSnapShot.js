/**
 * Created by wuz on 2016/5/2.
 */
FM.dataApi.IxPoiShapShot = FM.dataApi.GeoDataModel.extend({

    geoLiveType: "IX_POI_SNAP_SHOT",

    /*
     * UI-->DB
     */
    getIntegrate: function() {
        var ret = {};
        ret['fid'] = this.fid;
        ret['pid'] = this.pid;
        ret['lifecycle'] = this.lifecycle;
        ret['name'] = this.name;
        ret['kindCode'] = this.kindCode;
        ret['auditStatus'] = this.auditStatus;
        ret['checkResultNum'] = this.checkResultNum;
        ret['checkResults'] = this.checkResults;
        ret['rawFields'] = this.rawFields;
        ret['attachmentsPhoto'] = this.attachmentsPhoto;
        ret['attachmentsRemark'] = this.attachmentsRemark;
        ret['evaluateComment'] = this.evaluateComment;
        ret['location'] = this.location
        ret['guide'] = this.guide;
        return ret;
    },
    setAttributes: function(data) {
        this.fid = data["fid"];
        this.pid = data["pid"];
        this.lifecycle = data["lifecycle"];
        this.name = data['name'];
        this.kindCode = data["kindCode"];
        this.auditStatus = data["auditStatus"];
        this.checkResultNum = 0;
        if (data['checkResults'] && data['checkResults'].length > 0) {
            this.checkResultNum = data['checkResults'].length;
        }
        this.checkResults = data['checkResults'];
        this.rawFields = data["rawFields"];
        this.attachmentsPhoto = 0;
        this.attachmentsRemark = "无";
        if (data['attachments']) {
            var photo = 0 ;
            for (var i = 0, len = data['attachments'];i < len ; i ++){
                if (data['attachments'][i].type == 1) {
                    photo++;
                } else if (data['attachments'][i].type == 4) {
                    this.attachmentsRemark = '有';
                }
            }
            this.attachmentsPhoto = photo;
        }
        this.evaluateComment = 0;
        if(data['evaluateComment']){
            this.evaluateComment = data['evaluateComment'].length;
        }
        this.location = data["location"];
        this.guide = data["guide"];
    }
});
