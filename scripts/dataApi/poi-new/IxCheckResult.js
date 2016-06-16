/**
 * Created by wangmingdong on 2016/6/1.
 */
FM.dataApi.IxCheckResult = FM.dataApi.DataModel.extend({
	dataModelType: "IX_CHECK_RESULT",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.create_date = data['create_date'];
		this.geometry = data['geometry'];
		this.id = data['id'];
		this.information = data['information'] || "";
		this.shortInfo = this.information.substring(0,17)+'...';
		this.rank = data['rank'];
		this.ruleid = data['ruleid'] || "";
		this.shortRuleId = this.ruleid.substring(0,10) + '...';
		/*是否是poi检查项*/
		this.poiCheck = false;
		/*poi检查项数组*/
		this.poiListCheck = [];
		this.targets = data['targets'];
		if(data['targets'] && data['targets'].indexOf('IX_POI') > -1){
			var poiCheckArr = data['targets'].split('][');
			this.poiCheck = true;
			for(var i=0,len=poiCheckArr.length;i<len;i++){
				if(i<len-1){
					this.poiListCheck.push(poiCheckArr[i].split(',')[1]);
				}else{
					this.poiListCheck.push(poiCheckArr[i].split(',')[1].substring(0,poiCheckArr[i].split(',')[1].length-1));
				}
			}
		}
		this.worker = data['worker'];
	},
	getIntegrate: function(){
		var ret = {};
		ret["create_date"] = this.create_date;
		ret["geometry"] = this.geometry;
		ret["id"] = this.id;
		ret["information"] = this.information;
		ret["rank"] = this.rank;
		ret["ruleid"] = this.ruleid;
		ret["targets"] = this.targets;
		ret["worker"] = this.worker;
		return ret;
	}
});