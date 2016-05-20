/**
 * Created by wangmingdong on 2016/5/19.
 */
FM.dataApi.IxEditHistory = FM.dataApi.DataModel.extend({
    dataModelType: "IX_EDIT_HISTORY",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.sourceName = data['sourceName'] || null;
        this.sourceProject = data['sourceProject'] || null;
        this.sourceTask = data['sourceTask'] || null;
        this.operator = {};
        if(data['operator']){
            this.operator.user = data['operator'].user;
            this.operator.role = data['operator'].role;
            this.operator.name = '';
        }
        this.operation = data['operation'];
        this.mergeDate = data['mergeDate'];
        this.mergeContents = [];
        if(data['mergeContents'] && data['mergeContents'].length > 0){
            for(var i=0;i<data['mergeContents'].length;i++){
                var fieldName = data['mergeContents'][i];
                this.mergeContents.push(fieldName);
            }
        }
        this.validationMethod = data['validationMethod'];
        this.comment = data['comment'] || null;
    },
    getIntegrate: function(){
        var ret = {};
        ret["sourceName"] = this.sourceName;
        ret["sourceProject"] = this.sourceProject;
        ret["sourceTask"] = this.sourceTask;
        ret['operator'] = {};
        if(ret['operator']){
            ret['operator'].latitude = this.operator.user;
            ret['operator'].longitude = this.operator.role;
            ret['operator'].linkPid = '';
        }
        ret["operation"] = this.operation;
        ret["mergeDate"] = this.mergeDate;
        ret['mergeContents'] = [];
        if (this.mergeContents && this.mergeContents.length > 0) {
            for (var i = 0 , len = this.mergeContents.length ; i < len; i++) {
                var fieldName = this.mergeContents[i];
                ret['mergeContents'].push(fieldName);
            }
        }
        ret["validationMethod"] = this.validationMethod;
        ret["comment"] = this.comment;
        return ret;
    }

});