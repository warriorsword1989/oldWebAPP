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
        this.mergeFormateData = FM.Util.dateFormat(this.mergeDate);
        this.mergeContents = [];
        if(data['mergeContents'] && data['mergeContents'].length > 0){
            for(var i=0;i<data['mergeContents'].length;i++){
                var content = {
                    newValue:data['mergeContents'][i].newValue,
                    oldValue:data['mergeContents'][i].oldValue
                };
                this.mergeContents.push(content);
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
            ret['operator'].user = this.operator.user;
            ret['operator'].role = this.operator.role;
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