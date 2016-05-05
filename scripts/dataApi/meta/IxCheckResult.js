/**
 * Created by chenxiao on 2016/4/21.
 */
FM.dataApi.IxTest = FM.dataApi.DataModel.extend({
    dataModelType: "IX_CHECK_RESULT",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.errorCode = data['errorCode'] || null;
        this.errorMsg = data['errorMsg'] || null;
        this.fields = [];
        if(data['fields'].length > 0){
            for(var i=0;i<data['fields'].length;i++){
                var fieldName = data['fields'][i];
                this.fields.push(fieldName);
            }
        }

        this.description = data['description'] || null;
        this.refFeatures = data['refFeatures'];
        this.type = data['type'] || 1;
    }

});