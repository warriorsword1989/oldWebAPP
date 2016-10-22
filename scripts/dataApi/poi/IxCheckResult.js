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
		this.shortInfo = '';
		if(data['information'].length < 18){
			this.shortInfo = data['information'];
		}else{
			this.shortInfo = data['information'];
		}
		this.rank = data['rank'];
		this.ruleid = data['ruleid'] || "";
		this.shortRuleId = '';
		if(data['ruleid'].length < 9){
			this.shortRuleId = data['ruleid'];
		}else{
			this.shortRuleId = data['ruleid'].substring(0,10) + '...';
		}
		/*是否是poi检查项*/
		this.poiCheck = false;
		/*poi检查项数组*/
		this.mutiListCheck = [];
		this.targets = data['targets'];
		if(data['targets'] && data['targets'].split(';').length > 0){
			var mutiCheckArr = data['targets'].split('];[');
			this.mutiCheck = true;
			this.featureType = mutiCheckArr[0].split(',')[0].substring(1);
			for(var i=0,len=mutiCheckArr.length;i<len;i++){
				if(i<len-1){
					this.mutiListCheck.push(mutiCheckArr[i].split(',')[1]);
				}else{
					this.mutiListCheck.push(mutiCheckArr[i].split(',')[1].substring(0,mutiCheckArr[i].split(',')[1].length-1));
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