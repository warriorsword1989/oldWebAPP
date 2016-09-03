/**
 * Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoi = FM.dataApi.GeoDataModel.extend({
    geoLiveType: "COL_POI",
    /*
     * DB-->UI
     */
    setAttributes: function(data) {
        this.pid = data['pid'];
        this.rowId = data['rowId'] || "";
        this.pid = data['pid'];
        this.kindCode = data['kindCode'] || null;
        this.classifyRules = data['classifyRules'];
        this.refMsg = data['refMsg'];
        this.addressList = data['addressList'];

        this.addressChi = {};//大陆地址
        this.addressEng = {};//英文地址
        this.addressCht = {};//港澳地址
        this.addressPor = {};//葡文地址
        if (data["addresses"]) {
            for (var i = 0, len = data["addresses"].length; i < len; i++) {
                var obj = new FM.dataApi.ColPoiAddress(data["addresses"][i]);
                if(obj.langCode == "CHI"){
                    this.addressChi = obj;
                } else if(obj.langCode == "ENG"){
                    this.addressEng = obj;
                } else if(obj.langCode == "CHT"){
                    this.addressCht = obj;
                } else if(obj.langCode == "POR"){
                    this.addressPor = obj;
                }
            }
        }
        //官方标准
        this.name11Chi = {};
        this.name11Eng = {};
        this.name11Cht = {};
        this.name11Por = {};
        //官方原始
        this.name12Chi = {};
        this.name12Eng = {};
        this.name12Cht = {};
        this.name12Por = {};
        
        //简称标准化
        this.name51ChiArr = [];
        this.name51Chi = {};
        this.name51Eng = {};
        this.name51Cht = {};
        this.name51Por = {};
        //用于存储所有的有多音字的名称
        this.nameObj = {};
        
        
        if (data["names"]) {
            for (var i = 0, len = data["names"].length; i < len; i++) {
                var obj = new FM.dataApi.ColPoiName(data["names"][i]);
                var flag = obj.nameClass + "" + obj.nameType + "" + obj.langCode;
                if(flag == "11CHI"){
                    this.name11Chi = obj;
                } else if(flag == "11ENG"){
                    this.name11Eng = obj;
                } else if(flag == "11CHT"){
                	this.name11Cht = obj;
                } else if(flag == "11POR"){
                	this.name11Por = obj;
                } else if(flag == "12CHI"){
                    this.name12Chi = obj;
                } else if(flag == "12ENG"){
                	this.name12Eng = obj;
                } else if(flag == "12CHT"){
                	this.name12Cht = obj;
                } else if(flag == "12POR"){
                	this.name12Por = obj;
                }else if(flag == "51CHI"){
                    this.name51Chi = obj;
                    this.name51ChiArr.push(obj);
                }else if(flag == "51ENG"){
                    this.name51Eng = obj;
                } else if(flag == "51CHT"){
                    this.name51Cht = obj;
                } else if(flag == "51POR"){
                    this.name51Por = obj;
                } else if(flag == "AAA"){
                	this.nameObj = obj;
                } 
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function() {
        var ret = {};
        ret['pid'] = this.pid;
        ret['rowId'] = this.rowId;
        ret['kindCode'] = this.kindCode;
        ret['classifyRules'] = this.classifyRules;
        ret['refMsg'] = this.refMsg;
        ret['addressList'] = this.addressList;

        ret["addresses"] = [];
        if(!FM.Util.isEmptyObject(this.addressChi)){
            ret["addresses"].push(this.addressChi.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.addressEng)){
            ret["addresses"].push(this.addressEng.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.addressCht)){
            ret["addresses"].push(this.addressCht.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.addressPor)){
            ret["addresses"].push(this.addressPor.getIntegrate());
        }

        ret["names"] = [];
        if(!FM.Util.isEmptyObject(this.name11Chi)){
            ret["names"].push(this.name11Chi.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.name11Eng)){
            ret["names"].push(this.name11Eng.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.name12Chi)){
            ret["names"].push(this.name12Chi.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.name12Eng)){
            ret["names"].push(this.name12Eng.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.nameObj)){
            ret["names"].push(this.nameObj.getIntegrate());
        }
        if(!FM.Util.isEmptyObject(this.nameObj)){
            ret["names"].push(this.nameObj.getIntegrate());
        }
        if(this.name51ChiArr.length>0){
        	for(var i=0,len=this.name51ChiArr.length;i<len;i++){
        		ret["names"].push(this.name51ChiArr[i]);
        	}
        }
        ret["geoLiveType"] = this.geoLiveType;
        return ret;
    }
});