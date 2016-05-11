/**
 * Created by chenxiao on 2016/4/21.
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
        this.validationMethod = data['validationMethod'] || 1;
        this.comment = data['comment'] || null;
    },
    statics: {
        getList: function(id,callback) {
            var params = {'userId':id};
            FM.dataApi.ajax.get("/user/query/", params, function(data) {
                callback(data.data.rows[0]);
            });
        }
    }

});