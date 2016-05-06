/**
 * fastmap模块
 *
 * @module fastmap
 */

var fastmap = (function() {
    var instantiated;
    function init() {
        return {
            /**
             * fastmapApi版本号
             * @property version
             * @type String
             */
            version: "1.1.0"
        };
    }
    return !instantiated ? instantiated = init():instantiated;
})();



/**
 * mapApi类
 * 封装地图相关操作
 *
 * @namespace fastmap
 * @class mapApi
 */
fastmap.mapApi = (function() {
    var instantiated;
    function init() {
        return { };
    }
    return !instantiated ? instantiated = init():instantiated;
})();


/**
 * uiKit类
 * 封装地图界面类
 *
 * @namespace fastmap
 * @class uiKit
 */
fastmap.uikit = (function() {
    var instantiated;
    function init() {
        return { };
    }
    return !instantiated ? instantiated = init():instantiated;
})();

/**
 * dataApi类
 * 封装相关地图数据类
 *
 * @namespace fastmap
 * @class dataApi
 */
fastmap.dataApi=(function(){
    var instantiated;
    function init() {
        return { id:"test" };
    }
    return !instantiated ? instantiated = init():instantiated;
})();
;/**
 * Created by wangtun on 2016/4/21.
 * GeoLive模型枚举，统一用枚举来判断类型及服务表名
 */

fastmap.dataApi.GeoLiveModelType={
    /*
     行政区划点
     */
    "ADADMIN":"ADADMIN",
    /*
     行政区划点名称
     */
    "ADADMINNAME":"ADADMINNAME",
    /*
     行政区划面
     */
    "ADFACE":"ADFACE",
    /*
     行政区划线
     */
    "ADLINK":"ADLINK",
    /*
      分歧
     */
    "RDBRANCH":"RDBRANCH",
    /*
      分歧详细信息
     */
    "RDBRANCHDETAIL":"RDBRANCHDETAIL",
    /*
      分歧名称
     */
    "RDBRANCHNAME":"RDBRANCHNAME",
    /*
      分歧实景图
     */
    "RDBRANCHREALIMAGE":"RDBRANCHREALIMAGE",
    /*
     分歧模式图
     */
    "RDBRANCHSCHEMATIC":"RDBRANCHSCHEMATIC",
    /*
      连续分歧
     */
    "RDBRANCHSERIESBRANCH":"RDBRANCHSERIESBRANCH",
     /*
      实景看板
      */
    "RDBRANCHSIGNASREAL":"RDBRANCHSIGNASREAL",
    /*
      方向看板名称
     */
    "RDBRANCHSIGNBOARDNAME":"RDBRANCHSIGNBOARDNAME",
    /*
     分歧经过
     */
    "RDBRANCHVIA":"RDBRANCHVIA",

    /*
      路口
     */
    "RDCROSS":"RDCROSS",
    /*
      路口内道路
     */
    "RDCROSSLINK":"RDCROSSLINK",
    /*
     路口名称
     */
    "RDCROSSNAME":"RDCROSSNAME",
    /*
      路口内道路端点
     */
    "RDCROSSNODE":"RDCROSSNODE",
    /*
      立交
     */
    "RDGSC":"RDGSC",
    /*
      立交组成道路
     */
    "RDGSCLINK":"RDGSCLINK",
    /*
       车信
     */
    "RDLANECONNEXITY":"RDLANECONNEXITY",
    /*
      车信联通
     */
    "RDLANETOPOLOGY":"RDLANETOPOLOGY",
    /*
      车信经过LINK
     */
    "RDLANEVIA":"RDLANEVIA",
    /*
     道路形态
     */
    "RDLINKFORM":"RDLINKFORM",
    /*
      道路与Rtic关系（互联网客户）
     */
    "RDLINKINTRTIC":"RDLINKINTRTIC",
    /*
      道路名
     */
    "RDLINKNAME":"RDLINKNAME",
    /*
    "道路与RTIC关系"
     */
    "RDLINKRTIC":"RDLINKRTIC",
    /*
     道路人行便道
     */
    "RDLINKSIDEWALK":"RDLINKSIDEWALK",
    /*
     道路限速
     */
    "RDLINKSPEEDLIMIT":"RDLINKSPEEDLIMIT",
    /*
     道路卡车限速
     */
    "RDLINKTRUCKLIMIT":"RDLINKTRUCKLIMIT",
    /*
     道路人行阶梯
     */
    "RDLINKWALKSTAIR":"RDLINKWALKSTAIR",
    /*
     道路与ZONE关系
     */
    "RDLINKZONE":"RDLINKZONE",
    /*
       道路
     */
    "RDLINK":"RDLINK",
    /*
       道路端点
     */
    "RDNODE":"RDNODE",
    /*
      道路端点形态
     */
    "RDNODEFORM":"RDNODEFORM",
    /*

     */
    /*
      交限
     */
    "RDRESTRICTION":"RDRESTRICTION",
    /*
      交限时间段与车辆限制
     */
    "RDRESTRICTIONCONDITION":"RDRESTRICTIONCONDITION",
    /*
      交限详细信息
     */
    "RDRESTRICTIONDETAIL":"RDRESTRICTIONDETAIL",
    /*
      限速
     */
    "RDSPEEDLIMIT":"RDSPEEDLIMIT",
    /*
      铁路
     */
    "RWLINK":"RWLINK"
};/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class GeoDataModel 数据模型基类
 */

fastmap.dataApi.GeoDataModel = L.Class.extend({
    options: {},

    /***
     *
     * @param id
     * 模型ID
     */
    id:null,
    /***
     *
     * @param id
     * 模型几何
     */
    geometry:null,

    /***
     *
     * @param attributes
     * 对象属性
     */
    attributes:null,

    /***
     *
     * @param snapShot
     * 对象简要属性
     */
    snapShot:null,

    /***
     *
     * @param integrate
     * 对象全部属性
     */
    integrate:null,

    /***
     *
     * @param options
     */
    initialize: function (geometry,attributes,options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.geometry = geometry;
        this.snapShot = this.getSnapShot(attributes);
        this.integrate = this.getIntegrate(attributes);
    },

    /***
     * 设置对象概要属性信息
     * @param snapshot
     */
    getSnapShot: function (snapshot) {

        return null;
    },

    /***
     * 设置对象完整信息
     * @param integrate
     */
    getIntegrate: function (integrate) {
        return null;
    },

    getDiffProperties:function(integrateJson){
        var difJson={};
        var originJson = this.getIntegrate();
        for  (property in originJson.hasOwnProperty()) {
            if (typeof originJson[property]=="number"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="string"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="boolean"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="object"){
                if(JSON.stringify(originJson[property]) != JSON.stringify(integrateJson[property])){
                    difJson[property] = originJson[property];
                }
            }
        }
        return difJson;
    },
    /**
     * 通过GeoJson生成模型对象
     * @method fromGeoJson
     *
     * @param {string} geoJson.
     * @return {fastmap.mapApi.Geometry} geometry.
     */
    fromGeoJson: function (geoJson) {

        return null;
    },

    /**
     * 几何生成GeoJSON
     * @method toGeoJSON
     *
     * @return {string} geoJsonString.
     */
    toGeoJSON: function () {
        return null;
    }
});

;/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranch = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCH";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.outLinkPid = data["outLinkPid"];
        this.relationshipType = data["relationshipType"] || 1;
        this.realimages = [];
        if (data["realimages"].length > 0) {
            for (var i = 0; i < data["realimages"].length; i++) {
                var realImage = fastmap.dataApi.rdBranchRealImage(data["realimages"][i]);
                this.realimages.push(realImage);
            }
        }

        this.schematics = [];
        if (data["schematics"].length > 0) {
            for (var i = 0; i < data["schematics"].length; i++) {
                var schemtic = fastmap.dataApi.rdBranchSchematic(data["schematics"][i]);
                this.schematics.push(schemtic);
            }
        }

        this.seriesbranches = [];
        if (data["seriesbranches"].length > 0) {
            for (var i = 0; i < data["seriesbranches"].length; i++) {
                var seriesBranch = fastmap.dataApi.rdBranchSeriesBranch(data["seriesbranches"][i]);
                this.seriesbranches.push(seriesBranch);
            }
        }

        this.signasreals = [];
        if (data["signasreals"].length > 0) {
            for (var i = 0; i < data["signasreals"].length; i++) {
                var signasReal = fastmap.dataApi.rdBranchSignAsreal(data["signasreals"][i]);
                this.signasreals.push(signasReal);
            }
        }

        this.signboards = [];
        if (data["signboards"].length > 0) {
            for (var i = 0; i < data["signboards"].length; i++) {
                var signBoard = fastmap.dataApi.rdBranchSignBoard(data["signboards"][i]);
                this.signboards.push(signBoard);
            }
        }

        this.vias = [];
        if (data["vias"].length > 0) {
            for (var i = 0; i < data["vias"].length; i++) {
                var via = fastmap.dataApi.rdBranchVia(data["vias"][i]);
                this.vias.push(via);
            }
        }

        this.details = [];
        if (data["details"].length > 0) {
            for (var i = 0; i < data["details"].length; i++) {
                var detail = fastmap.dataApi.rdBranchDetail(data["details"][i]);
                this.details.push(detail);
            }
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["relationshipType"] = this.relationshipType;
        data["geoLiveType"] = this.geoLiveType;
        data["realimages"] = [];
        for (var i = 0; i < this.realimages.length; i++) {
            data["realimages"].push(this.realimages[i].getIntegrate());
        }

        data["schematics"] = [];
        for (var i = 0; i < this.schematics.length; i++) {
            data["schematics"].push(this.schematics[i].getIntegrate());
        }

        data["seriesbranches"] = [];
        for (var i = 0; i < this.seriesbranches.length; i++) {
            data["seriesbranches"].push(this.seriesbranches[i].getIntegrate());
        }

        data["signasreals"] = [];
        for (var i = 0; i < this.signasreals.length; i++) {
            data["signasreals"].push(this.signasreals[i].getIntegrate());
        }

        data["signboards"] = [];
        for (var i = 0; i < this.signboards.length; i++) {
            data["signboards"].push(this.signboards[i].getIntegrate());
        }

        data["vias"] = [];
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias[i].getIntegrate());
        }

        data["details"] = [];
        for (var i = 0; i < this.details.length; i++) {
            data["details"].push(this.details[i].getIntegrate());
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["geoLiveType"] = this.geoLiveType;
        data["relationshipType"] = this.relationshipType;
        data["realimages"] = [];
        for (var i = 0; i < this.realimages.length; i++) {
            data["realimages"].push(this.realimages[i].getIntegrate());
        }

        data["schematics"] = [];
        for (var i = 0; i < this.schematics.length; i++) {
            data["schematics"].push(this.schematics[i].getIntegrate());
        }

        data["seriesbranches"] = [];
        for (var i = 0; i < this.seriesbranches.length; i++) {
            data["seriesbranches"].push(this.seriesbranches[i].getIntegrate());
        }

        data["signasreals"] = [];
        for (var i = 0; i < this.signasreals.length; i++) {
            data["signasreals"].push(this.signasreals[i].getIntegrate());
        }

        data["signboards"] = [];
        for (var i = 0; i < this.signboards.length; i++) {
            data["signboards"].push(this.signboards[i].getIntegrate());
        }

        data["vias"] = [];
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias[i].getIntegrate());
        }

        data["details"] = [];
        for (var i = 0; i < this.details.length; i++) {
            data["details"].push(this.details[i].getIntegrate());
        }

        return data;
    }
});
/***
 * rdBranch初始化函数
 * @param data 分歧数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdBranch}
 */
fastmap.dataApi.rdBranch = function (data, options) {
    return new fastmap.dataApi.RdBranch(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchDetail=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHDETAIL";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.branchType = data["branchType"] || 0;
        this.estabType = data["estabType"]|| 0;
        this.exitNum = data["exitNum"] || "";
        this.guideCode = data["guideCode"] || 0;
        this.nameKind = data["nameKind"] || 0;
        this.patternCode = data["patternCode"] || "";
        this.voiceDir = data["voiceDir"]||0;
        this.arrowCode = data["arrowCode"] || "";
        this.arrowFlag = data["arrowFlag"] || 0;
        this.names=[];
        for(var i=0;i<data["names"].length;i++){
            var name= fastmap.dataApi.rdBranchName(data["names"][i]);
            this.names.push(name);
        }
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["branchType"] = this.branchType;
        data["estabType"] = this.estabType;
        data["exitNum"] = this.exitNum;
        data["guideCode"] = this.guideCode;
        data["nameKind"] = this.nameKind;
        data["patternCode"] = this.patternCode;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["arrowFlag"] = this.arrowFlag;
        data["geoLiveType"] = this.geoLiveType;
        data["names"] = [];
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["branchType"] = this.branchType;
        data["estabType"] = this.estabType;
        data["exitNum"] = this.exitNum;
        data["guideCode"] = this.guideCode;
        data["nameKind"] = this.nameKind;
        data["patternCode"] = this.patternCode;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["arrowFlag"] = this.arrowFlag;
        data["geoLiveType"] = this.geoLiveType;
        data["names"] = [];
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }

        return data;
    }
})

fastmap.dataApi.rdBranchDetail = function (data, options) {
    return new fastmap.dataApi.RdBranchDetail(data, options);
}
;/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchName=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHNAME";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.seqNum = data["seqNum"] || 1;
        this.nameGroupid = data["nameGroupid"] || 1;
        this.detailId = data["detailId"];
        this.nameClass = data["nameClass"] || 0;
        this.langCode = data["langCode"] || "CHI";
        this.codeType = data["codeType"] || 0;
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
        this.voiceFile = data["voiceFile"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupid"] = this.nameGroupid;
        data["detailId"] = this.detailId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["voiceFile"] = this.voiceFile;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupid"] = this.nameGroupid;
        data["detailId"] = this.detailId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["voiceFile"] = this.voiceFile;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})
/***
 * rdBranchName 名字初始化函数
 * @param data 分歧名字数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdBranchName}
 */
fastmap.dataApi.rdBranchName = function (data, options) {
    return new fastmap.dataApi.RdBranchName(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchRealImage=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHREALIMAGE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.branchPid = data["branchPid"];
        this.imageType = data["imageType"] || 0;
        this.realCode = data["realCode"] || "";
        this.arrowCode = data["arrowCode"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["branchPid"] = this.pid;
        data["imageType"] = this.imageType;
        data["realCode"] = this.realCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["branchPid"] = this.pid;
        data["imageType"] = this.imageType;
        data["realCode"] = this.realCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSchematic=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSCHEMATIC";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.schematicCode = data["schematicCode"] || "";
        this.arrowCode = data["arrowCode"] || "";
        this.memo = data["memo"] || "";

    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["schematicCode"] = this.schematicCode;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["schematicCode"] = this.schematicCode;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSchematic = function (data, options) {
    return new fastmap.dataApi.RdBranchSchematic(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSeriesBranch=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSERIESBRANCH";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.voiceDir = data["voiceDir"] || 0;
        this.arrowCode = data["arrowCode"] || "";
        this.type = data["type"] || 0;
        this.patternCode = data["patternCode"] || "";
        this.arrowFlag = data["arrowFlag"] || 0;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["type"] = this.type;
        data["patternCode"] = this.patternCode;
        data["arrowFlag"] = this.arrowFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["type"] = this.type;
        data["patternCode"] = this.patternCode;
        data["arrowFlag"] = this.arrowFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSeriesBranch = function (data, options) {
    return new fastmap.dataApi.RdBranchSeriesBranch(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSignAsreal=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSIGNASREAL";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.signboardId = data["signboardId"];
        this.arrowCode = data["arrowCode"] || "";
        this.memo = data["memo"] || "";
        this.svgfileCode = data["svgfileCode"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["signboardId"] = this.signboardId;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["svgfileCode"] = this.svgfileCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["signboardId"] = this.signboardId;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["svgfileCode"] = this.svgfileCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.RdBranchSignAsreal = function (data, options) {
    return new fastmap.dataApi.RdBranchSignAsreal(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSignBoard=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSIGNBOARD";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.backimageCode = data["backimageCode"] || "";
        this.arrowCode = data["arrowCode"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["backimageCode"] = this.backimageCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["backimageCode"] = this.backimageCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSignBoard = function (data, options) {
    return new fastmap.dataApi.RdBranchSignBoard(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSignBoardName=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSIGNBOARDNAME";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.seqNum = data["seqNum"] || 1;
        this.nameGroupId = data["nameGroupId"] || 1;
        this.signboardId = data["signboardId"];
        this.nameClass = data["nameClass"] || 0;
        this.langCode = data["langCode"] || "CHI";
        this.codeType = data["codeType"] || 0;
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.voiceFile = data["voiceFile"] || "";
        this.srcFlag = data["srcFlag"] || 0;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupId"] = this.nameGroupId;
        data["signboardId"] = this.signboardId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["voiceFile"] = this.voiceFile;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupId"] = this.nameGroupId;
        data["signboardId"] = this.signboardId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["voiceFile"] = this.voiceFile;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSignBoardName = function (data, options) {
    return new fastmap.dataApi.RdBranchSignBoardName(data, options);
};/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchVia=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHVIA";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.groupId = data["groupId"] || 1;
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchVia = function (data, options) {
    return new fastmap.dataApi.RdBranchVia(data, options);
};/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLink = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data geometry
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINK";
        this.setAttributeData(data);
    },

    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributeData: function (data) {
        this.pid = data["pid"] || null;
        this.geometry = data["geometry"]||null;
        this.sNodePid = data["sNodePid"] || null;
        this.eNodePid = data["eNodePid"] || null;
        this.kind = data["kind"] || 7;
        this.direct = data["direct"] || 1;
        this.appInfo = data["appInfo"] || 1;
        this.tollInfo = data["tollInfo"] || 2;
        this.routeAdopt = data["routeAdopt"] || 2;
        this.multiDigitized = data["multiDigitized"] || 0;
        this.developState = data["developState"] || 0;
        this.imiCode = data["imiCode"] || 0;
        this.specialTraffic = data["specialTraffic"] || 0;
        this.functionClass = data["functionClass"] || 5;
        this.urban = data["urban"] || 0;
        this.paveStatus = data["paveStatus"] || 0;
        this.laneNum = data["laneNum"] || 2;
        this.laneLeft = data["laneLeft"] || 0;
        this.laneRight = data["laneRight"] || 0;
        this.laneWidthLeft = data["laneWidthLeft"] || 1;
        this.laneWidthRight = data["laneWidthRight"] || 1;
        this.laneClass = data["laneClass"] || 2;
        this.width = data["width"] || 0;
        this.isViaduct = data["isViaduct"] || 0;
        this.leftRegionId = data["leftRegionId"] || 0;
        this.rightRegionId = data["rightRegionId"] || 0;
        this.length = data["length"] || 0;
        this.meshId = data["meshId"] || 0;
        this.onewayMark = data["onewayMark"] || 0;
        this.streetLight = data["streetLight"] || 0;
        this.parkingLot = data["parkingLot"] || 0;
        this.adasFlag = data["adasFlag"] || 0;
        this.sidewalkFlag = data["sidewalkFlag"] || 0;
        this.walkstairtFlag = data["walkstairtFlag"] || 0;
        this.diciType = data["diciType"] || 0;
        this.walkFlag = data["walkFlag"] || 0;
        this.difGroupid = data["difGroupid"] || "";
        this.srcFlag = data["srcFlag"] || 6;
        this.digitalLevel = data["digitalLevel"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.truckFlag = data["truckFlag"] || 0;
        this.feeStd = data["feeStd"] || 0;
        this.feeFlag = data["feeFlag"] || 0;
        this.systemId = data["systemId"] || 0;
        this.originLinkPid = data["originLinkPid"] || 0;
        this.centerDivider = data["centerDivider"] || 0;
        this.parkingFlag = data["parkingFlag"] || 0;
        this.memo = data["memo"] || "";
        this.reserved = data["reserved"] || "";

        this.forms = [];
        if (data["forms"]&&data["forms"].length > 0) {
            for (var i = 0, len = data["forms"].length; i < len; i++) {
                var form =fastmap.dataApi.rdLinkForm(data["forms"][i]);
                this.forms.push(form);
            }


        }
        this.names = [];
        if (data["names"]&&data["names"].length > 0) {

            for (var i = 0, len = data["names"].length; i < len; i++) {

                var name =  fastmap.dataApi.rdLinkName(data["names"][i]);
                this.names.push(name);
            }


        }
        this.rtics = [];
        if (data["rtics"]&&data["rtics"].length > 0) {
            for (var i = 0, len = data["rtics"].length; i < len; i++) {

                var rtic =fastmap.dataApi.rdLinkRtic(data["rtics"][i]);
                this.rtics.push(rtic);
            }


        }
        this.intRtics = [];
        if (data["intRtics"]&&data["intRtics"].length > 0) {
            for (var i = 0, len = data["intRtics"].length; i < len; i++) {

                var intRtics =fastmap.dataApi.rdLinkIntRtic(data["intRtics"][i]);
                this.intRtics.push(intRtics);
            }


        }
        this.sidewalks = [];
        if (data["sidewalks"]&&data["sidewalks"].length > 0) {
            for (var i = 0, len = data["sidewalks"].length; i < len; i++) {

                var sideWalk =  fastmap.dataApi.rdLinkSideWalk(data["sidewalks"][i]);
                this.sidewalks.push(sideWalk);
            }


        }
        this.speedlimits = [];
        if (data["speedlimits"]&&data["speedlimits"].length > 0) {
            for(var i= 0,len=data["speedlimits"].length;i<len;i++) {
                var speeedLimit =  fastmap.dataApi.rdLinkSpeedLimit(data["speedlimits"][i]);
                this.speedlimits.push(speeedLimit);
            }


        }
        this.limits = [];
        if (data["limits"]&&data["limits"].length > 0) {
            for(var i= 0,len=data["limits"].length;i<len;i++) {
                var limit=  fastmap.dataApi.rdLinkLimit(data["limits"][i]);
                this.limits.push(limit);
            }


        }
        this.limitTrucks = [];
        if (data["limitTrucks"]&&data["limitTrucks"].length > 0) {
            for(var i= 0,len=data["limitTrucks"].length;i<len;i++) {

                var truckLimit = fastmap.dataApi.rdLinkTruckLimit(data["limitTrucks"][i]);
                this.limitTrucks.push(truckLimit);
            }

        }
        this.walkstairs = [];
        if (data["walkstairs"]&&data["walkstairs"].length > 0) {
            for(var i= 0,len=data["walkstairs"].length;i<len;i++) {

                var walkStair =  fastmap.dataApi.rdLinkWalkStair(data["walkstairs"][i]);
                this.walkstairs.push(walkStair);
            }

        }
        this.zones = [];
        if (data["zones"]&&data["zones"].length > 0) {
            for(var i= 0,len=data["zones"].length;i<len;i++) {

                var zone =  fastmap.dataApi.rdLinkZone(data["zones"][i]);
                this.zones.push(zone);
            }

        }
    },

    /**
     * 获取道路简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["geometry"] = this.geometry;
        data["kind"] = this.kind;
        data["direct"] = this.direct;
        data["appInfo"] = this.appInfo;
        data["tollInfo"] = this.tollInfo;
        data["routeAdopt"] = this.routeAdopt;
        data["multiDigitized"] = this.multiDigitized;
        data["developState"] = this.developState;
        data["imiCode"] = this.imiCode;
        data["geoLiveType"] = this.geoLiveType;

        return data;
    },

    /**
     * 获取道路详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["direct"] = this.direct;
        data["appInfo"] = this.appInfo;
        data["tollInfo"] = this.tollInfo;
        data["routeAdopt"] = this.routeAdopt;
        data["multiDigitized"] = this.multiDigitized;
        data["developState"] = this.developState;
        data["imiCode"] = this.imiCode;
        data["specialTraffic"] = this.specialTraffic;
        data["functionClass"] = this.functionClass;
        data["urban"] = this.urban;
        data["paveStatus"] = this.paveStatus;
        data["laneNum"] = this.laneNum;
        data["laneLeft"] = this.laneLeft;
        data["laneRight"] = this.laneRight;
        data["laneWidthLeft"] = this.laneWidthLeft;
        data["laneWidthRight"] = this.laneWidthRight;
        data["laneClass"] = this.laneClass;
        data["width"] = this.width;
        data["isViaduct"] = this.isViaduct;
        data["leftRegionId"] = this.leftRegionId;
        data["rightRegionId"] = this.rightRegionId;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["meshId"] = this.meshId;
        data["onewayMark"] = this.onewayMark;
        data["streetLight"] = this.streetLight;
        data["parkingLot"] = this.parkingLot;
        data["adasFlag"] = this.adasFlag;
        data["sidewalkFlag"] = this.sidewalkFlag;
        data["walkstairtFlag"] = this.walkstairtFlag;
        data["diciType"] = this.diciType;
        data["walkFlag"] = this.walkFlag;
        data["difGroupid"] = this.difGroupid;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["editFlag"] = this.editFlag;
        data["truckFlag"] = this.truckFlag;
        data["feeStd"] = this.feeStd;
        data["feeFlag"] = this.feeFlag;
        data["systemId"] = this.systemId;
        data["originLinkPid"] = this.originLinkPid;
        data["centerDivider"] = this.centerDivider;
        data["parkingFlag"] = this.parkingFlag;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        data["reserved"] = this.reserved;

        var forms = [];
        for (var i = 0, len = this.forms.length; i < len; i++) {
            forms.push(this.forms[i].getIntegrate());
        }
        data["forms"] = forms;

        var limits = [];
        for (var i = 0, len = this.limits.length; i < len; i++) {
            limits.push(this.limits[i].getIntegrate())
        }
        data["limits"] = limits;

        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }

        data["names"] = names;

        var rtics = [];
        for (var i = 0, len = this.rtics.length; i < len; i++) {
            rtics.push(this.rtics[i].getIntegrate())
        }
        data["rtics"] = rtics;

        var sidewalks = [];
        for (var i = 0, len = this.sidewalks.length; i < len; i++) {
            sidewalks.push(this.sidewalks[i].getIntegrate())
        }
        data["sidewalks"] = sidewalks;

        var speedlimits = [];
        for (var i = 0, len = this.speedlimits.length; i < len; i++) {
            speedlimits.push(this.speedlimits[i].getIntegrate())
        }
        data["speedlimits"] = speedlimits;

        var limitTrucks = [];
        for (var i = 0, len = this.limitTrucks.length; i < len; i++) {
            limitTrucks.push(this.limitTrucks[i].getIntegrate())
        }
        data["limitTrucks"] = limitTrucks;

        var walkstairs = [];
        for (var i = 0, len = this.walkstairs.length; i < len; i++) {
            walkstairs.push(this.walkstairs[i].getIntegrate())
        }
        data["walkstairs"] = walkstairs;

        var zones = [];
        for (var i = 0, len = this.zones.length; i < len; i++) {
            zones.push(this.zones[i].getIntegrate());
        }
        data["zones"] = zones;
        return data;
    }
});

/***
 * Rdlink初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLink = function (data, options) {
    return new fastmap.dataApi.RdLink(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkForm = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKFORM";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.formOfWay = data["formOfWay"] || 1;
        this.extendedForm = data["extendedForm"] || 0;
        this.auxiFlag = data["auxiFlag"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["formOfWay"] = this.formOfWay;
        data["extendedForm"] = this.extendedForm;
        data["auxiFlag"] = this.auxiFlag;
        data["kgFlag"] = this.kgFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["formOfWay"] = this.formOfWay;
        data["extendedForm"] = this.extendedForm;
        data["auxiFlag"] = this.auxiFlag;
        data["kgFlag"] = this.kgFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkform初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLinkForm = function (data, options) {
    return new fastmap.dataApi.RdLinkForm(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkLimit = fastmap.dataApi.GeoDataModel.extend({

    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.type = data["type"] || 3;
        this.limitDir = data["limitDir"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.vehicle = data["vehicle"] || 0;
        this.tollType= data["tollType"] || 9;
        this.weather = data["weather"] || 9;
        this.inputTime = data["inputTime"] || "";
        this.processFlag = data["processFlag"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["type"] = this.type;
        data["limitDir"] = this.limitDir;
        data["timeDomain"]  = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["tollType"] = this.tollType;
        data["weather"] = this.weather;
        data["inputTime"]  = this.inputTime;
        data["processFlag"] = this.processFlag;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["type"] = this.type;
        data["limitDir"] = this.limitDir;
        data["timeDomain"]  = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["tollType"] = this.tollType;
        data["weather"] = this.weather;
        data["inputTime"]  = this.inputTime;
        data["processFlag"] = this.processFlag;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkLimit = function (data, options) {
    return new fastmap.dataApi.RdLinkLimit(data, options);
};

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkName = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKNAME";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.nameGroupid = data["nameGroupid"] || 0;
        this.seqNum = data["seqNum"] || 1;
        this.name = data["name"] || "";
        this.nameClass = data["nameClass"] || 1;
        this.inputTime = data["inputTime"] || "";
        this.nameType = data["nameType"] || 0;
        this.srcFlag = data["srcFlag"] || 9;
        this.routeAtt = data["routeAtt"] || 0;
        this.code = data["code"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["nameGroupid"] = this.nameGroupid;
        data["name"] = this.name;
        data["seqNum"] = this.seqNum;
        data["nameClass"] = this.nameClass;
        data["inputTime"] = this.inputTime;
        data["nameType"] = this.nameType;
        data["srcFlag"]= this.srcFlag;
        data["routeAtt"] = this.routeAtt;
        data["code"]  = this.code;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["nameGroupid"] = this.nameGroupid;
        data["name"] = this.name;
        data["seqNum"] = this.seqNum;
        data["nameClass"] = this.nameClass;
        data["inputTime"] = this.inputTime;
        data["nameType"] = this.nameType;
        data["srcFlag"]= this.srcFlag;
        data["routeAtt"] = this.routeAtt;
        data["code"]  = this.code;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkName = function (data, options) {
    return new fastmap.dataApi.RdLinkName(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkRtic = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKRTIC";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.code = data["code"] || 0;
        this.rank = data["rank"] || 0;
        this.rticDir = data["rticDir"] || 0;
        this.updownFlag = data["updownFlag"] || 0;
        this.rangeType = data["rangeType"] || 0;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || "";
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["code"] = this.code;
        data["rank"]  = this.rank;
        data["rticDir"] = this.rticDir;
        data["updownFlag"] = this.updownFlag;
        data["rangeType"]  = this.rangeType;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["code"] = this.code;
        data["rank"]  = this.rank;
        data["rticDir"] = this.rticDir;
        data["updownFlag"] = this.updownFlag;
        data["rangeType"]  = this.rangeType;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkrtic初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkRtic}
 */
fastmap.dataApi.rdLinkRtic = function (data, options) {
    return new fastmap.dataApi.RdLinkRtic(data, options);
}

;/**
 * Created by liwanchong on 2016/3/14.
 */
fastmap.dataApi.RdLinkIntRtic = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKINTRTIC";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.code = data["code"] || 0;
        this.rank = data["rank"] || 0;
        this.rticDir = data["rticDir"] || 0;
        this.updownFlag = data["updownFlag"] || 0;
        this.rangeType = data["rangeType"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["code"] = this.code;
        data["rank"]  = this.rank;
        data["rticDir"] = this.rticDir;
        data["updownFlag"] = this.updownFlag;
        data["rangeType"]  = this.rangeType;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["code"] = this.code;
        data["rank"]  = this.rank;
        data["rticDir"] = this.rticDir;
        data["updownFlag"] = this.updownFlag;
        data["rangeType"]  = this.rangeType;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkrtic初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkRtic}
 */
fastmap.dataApi.rdLinkIntRtic = function (data, options) {
    return new fastmap.dataApi.RdLinkIntRtic(data, options);
}
;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkSideWalk = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKSIDEWALK";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.sidewalkLoc = data["sidewalkLoc"] || 0;
        this.dividerType = data["dividerType"] || 0;
        this.workDir = data["workDir"] || 0;
        this.processFlag = data["processFlag"] || 0;
        this.captureFlag= data["captureFlag"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["sidewalkLoc"] = this.sidewalkLoc;
        data["dividerType"] = this.dividerType;
        data["workDir"] = this.workDir;
        data["processFlag"] = this.processFlag;
        data["captureFlag"] = this.captureFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["sidewalkLoc"] = this.sidewalkLoc;
        data["dividerType"] = this.dividerType;
        data["workDir"] = this.workDir;
        data["processFlag"] = this.processFlag;
        data["captureFlag"] = this.captureFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkSidewalk初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkSidewalk}
 */
fastmap.dataApi.rdLinkSideWalk = function (data, options) {
    return new fastmap.dataApi.RdLinkSideWalk(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkSpeedLimit = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKSPEEDLIMIT";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.speedType = data["speedType"] || 0;
        this.fromSpeedLimit = data["fromSpeedLimit"] || 0;
        this.toSpeedLimit = data["toSpeedLimit"] || 0;
        this.speedClass = data["speedClass"] || 0;
        this.fromLimitSrc = data["fromLimitSrc"] || 0;
        this.toLimitSrc = data["toLimitSrc"] ||0;
        this.speedDependent = data["speedDependent"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.speedClassWork = data["speedClassWork"] || 1;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["speedType"] = this.speedType;
        data["fromSpeedLimit"]  = this.fromSpeedLimit;
        data["toSpeedLimit"] = this.toSpeedLimit;
        data["speedClass"] = this.speedClass;
        data["fromLimitSrc"]  = this.fromLimitSrc;
        data["toLimitSrc"] = this.toLimitSrc;
        data["speedDependent"] = this.speedDependent;
        data["timeDomain"]  = this.timeDomain;
        data["speedClassWork"] = this.speedClassWork;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["speedType"] = this.speedType;
        data["fromSpeedLimit"]  = this.fromSpeedLimit;
        data["toSpeedLimit"] = this.toSpeedLimit;
        data["speedClass"] = this.speedClass;
        data["fromLimitSrc"]  = this.fromLimitSrc;
        data["toLimitSrc"] = this.toLimitSrc;
        data["speedDependent"] = this.speedDependent;
        data["timeDomain"]  = this.timeDomain;
        data["speedClassWork"] = this.speedClassWork;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkSpeedLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkSpeedLimit}
 */
fastmap.dataApi.rdLinkSpeedLimit = function (data, options) {
    return new fastmap.dataApi.RdLinkSpeedLimit(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkTruckLimit = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKTRUCKLIMIT";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.limitDir = data["limitDir"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.resTrailer = data["resTrailer"] || 0;
        this.resWeigh = data["resWeigh"] || 0;
        this.resAxleLoad = data["resAxleLoad"] ||0;
        this.resAxleCount = data["resAxleCount"] || 0;
        this.resOut = data["resOut"] || 0;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || "";
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["limitDir"]  = this.limitDir;
        data["timeDomain"] = this.timeDomain;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"] = this.resWeigh;
        data["resAxleLoad"] = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["limitDir"]  = this.limitDir;
        data["timeDomain"] = this.timeDomain;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"] = this.resWeigh;
        data["resAxleLoad"] = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkTruckLimit = function (data, options) {
    return new fastmap.dataApi.RdLinkTruckLimit(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkWalkStair = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKWALKSTAIR";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.stairLoc = data["stairLoc"] || 0;
        this.stairFlag = data["stairFlag"] || 0;
        this.workDir = data["workDir"] || 0;
        this.captureFlag = data["captureFlag"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["stairLoc"] = this.stairLoc;
        data["stairFlag"] = this.stairFlag;
        data["workDir"] = this.workDir;
        data["captureFlag"] = this.captureFlag;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["stairLoc"] = this.stairLoc;
        data["stairFlag"] = this.stairFlag;
        data["workDir"] = this.workDir;
        data["captureFlag"] = this.captureFlag;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkWalkStair = function (data, options) {
    return new fastmap.dataApi.RdLinkWalkStair(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkZone = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKZONE";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.regionId = data["regionId"] || 0;
        this.type = data["type"] || 0;
        this.side = data["side"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["regionId"] = this.regionId;
        data["type"] = this.type;
        data["side"] = this.side;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["regionId"] = this.regionId;
        data["type"] = this.type;
        data["side"] = this.side;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkZone = function (data, options) {
    return new fastmap.dataApi.RdLinkZone(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdNode = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.id = data["nodePid"];
        this.geometry = data["geometry"];
        this.geoLiveType = "RDNODE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.kind = data["kind"] || 1;
        this.geometry = data["geometry"] || null;
        this.adasFlag = data["adasFlag"] || 2;
        this.editFlag = data["editFlag"] || 1;

        this.difGroupid = data["difGroupid"] || "";
        this.srcFlag = data["srcFlag"] || 6;
        this.digitalLevel = data["digitalLevel"] || 0;
        this.reserved = data["reserved"] || "";
        this.forms = [];

        for(var i=0;i<data["forms"].length;i++){
            var form = fastmap.dataApi.rdNodeForm(data["forms"][i]);
            this.forms.push(form);
        }
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["geometry"]  = this.geometry;
        data["adasFlag"] = this.adasFlag;
        data["editFlag"] = this.editFlag;
        data["difGroupid"] = this.difGroupid;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["reserved"]  = this.reserved;
        data["forms"]=this.forms;
        data["meshes"]=this.meshes;
        data["geoLiveType"] = this.geoLiveType;
        data["forms"] = [];

        for(var i=0;i<this.forms.length;i++){
            data["forms"].push(this.forms[i].getIntegrate());
        }
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["geometry"]  = this.geometry;
        data["adasFlag"] = this.adasFlag;
        data["editFlag"] = this.editFlag;
        data["difGroupid"] = this.difGroupid;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["reserved"]  = this.reserved;
        data["forms"]=this.forms;
        data["meshes"]=this.meshes;
        data["geoLiveType"] = this.geoLiveType;
        data["forms"] = [];

        for(var i=0;i<this.forms.length;i++){
            data["forms"].push(this.forms[i].getIntegrate());
        }
        return data;
    }
});

/***
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdNode = function (data, options) {
    return new fastmap.dataApi.RdNode(data, options);
}

;/**
 * Created by wangtun on 2016/3/23.
 */
/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdNodeForm = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDNODEFORM";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.nodePid = data["nodePid"] || "";
        this.formOfWay = data["formOfWay"] || 1;
        this.auxiFlag = data["auxiFlag"] || 0;
        this.rowId = data["rowId"] || "";
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["nodePid"] = this.nodePid;
        data["formOfWay"] = this.formOfWay;
        data["auxiFlag"]  = this.auxiFlag;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["nodePid"] = this.nodePid;
        data["formOfWay"] = this.formOfWay;
        data["auxiFlag"]  = this.auxiFlag;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdNodeForm = function (data, options) {
    return new fastmap.dataApi.RdNodeForm(data, options);
}

;/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdRestriction = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if (!data["pid"]) {
            throw "对象没有对应pid"
        }
        this.geoemtry = data["geometry"];
        this.geoLiveType = "RDRESTRICTION" ;
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"] || null;
        this.inLinkPid = data["inLinkPid"] || null;
        this.restricInfo = data["restricInfo"] || null;
        this.kgFlag = data["kgFlag"] || 0;

        this.details = [];
        if (data["details"] && data["details"].length > 0) {
            for (var i = 0, len = data["details"].length; i < len; i++) {
                var detail = fastmap.dataApi.rdRestrictionDetail(data["details"][i])
                this.details.push(detail);
            }
        }
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["restricInfo"] = this.restricInfo;
        data["kgFlag"] = this.kgFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["restricInfo"] = this.restricInfo;
        data["geoLiveType"] = this.geoLiveType;
        data["kgFlag"] = this.kgFlag;

        var details = [];
        for (var i = 0, len = this.details.length; i < len; i++) {
            details.push(this.details[i].getIntegrate());

        }
        data["details"]=details


        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdRestriction = function (data, options) {
    return new fastmap.dataApi.RdRestriction(data, options);
};/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdRestrictionDetail = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDRESTRICTIONDETAIL";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){

        this.pid = data["pid"] || 0;
        this.restricPid = data["restricPid"] || 0;
        this.outLinkPid = data["outLinkPid"] || 0;
        this.flag = data["flag"] || 2;
        this.restricInfo = data["restricInfo"] ||0;
        this.type = data["type"] || 1;
        this.relationshipType = data["relationshipType"] || 1;

        this.conditions = [];
        if (data["conditions"]&&data["conditions"].length > 0) {
            for (var i = 0, len = data["conditions"].length; i < len; i++) {
                var condition =fastmap.dataApi.rdRestrictionCondition(data["conditions"][i]);
                this.conditions.push(condition);
            }


        }
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;

        var conditions = [];
        for (var i = 0, len = this.conditions.length; i < len; i++) {
            conditions.push(this.conditions[i].getIntegrate());
        }
        data["conditions"] = conditions;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdRestrictionDetail = function (data, options) {
    return new fastmap.dataApi.RdRestrictionDetail(data, options);
};/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdRestrictionCondition = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDRESTRICTIONCONDITION";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){

        this.pid = data["pid"] || null;
        this.timeDomain = data["timeDomain"] || null;
        this.rowId = data["rowId"] || "";
        this.vehicle = data["vehicle"] || 0;
        this.resTrailer = data["resTrailer"] || 0;
        this.resWeigh = data["resWeigh"] || 0;
        this.resAxleLoad = data["resAxleLoad"] || 0;
        this.resAxleCount = data["resAxleCount"] || 0;
        this.resOut = data["resOut"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["rowId"] = this.rowId;
        data["timeDomain"] = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"]  = this.resWeigh;
        data["resAxleLoad"]  = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["rowId"] = this.rowId;
        data["timeDomain"] = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"]  = this.resWeigh;
        data["resAxleLoad"]  = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdRestrictionCondition = function (data, options) {
    return new fastmap.dataApi.RdRestrictionCondition(data, options);
};/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdCross = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSS";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.type = data["type"] || 0;
        this.signal = data["signal"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.electroeye = data["electroeye"] || 0;
        this.names = [];
        if (data["names"].length > 0) {
            for (var i = 0; i < data["names"].length; i++) {
                var name = fastmap.dataApi.rdCrossName(data["names"][i]);
                this.names.push(name);
            }
        }
        this.links = [];
        if (data["links"].length > 0) {
            for (var i = 0; i < data["links"].length; i++) {
                var link = fastmap.dataApi.rdCrossLink(data["links"][i]);
                this.links.push(link);
            }
        }
        this.nodes = [];
        if (data["nodes"].length > 0) {
            for (var i = 0; i < data["nodes"].length; i++) {
                var node = fastmap.dataApi.rdCrossNode(data["nodes"][i]);
                this.nodes.push(node);
            }
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["type"] = this.type;
        data["signal"] = this.signal;
        data["electroeye"] = this.electroeye;
        data["geoLiveType"] = this.geoLiveType;
        data["kgflag"] = this.kgflag;
        data["links"] = [];
        for (var i = 0, len = this.data["links"].length; i < len; i++) {
            data["links"].push(this.data["links"][i].getIntegrate())
        }

        data["names"] = [];
        for (var i = 0, len = this.data["names"].length; i < len; i++) {
            data["names"].push(this.data["names"][i].getIntegrate())
        }

        data["nodes"] = [];
        for (var i = 0, len = this.data["nodes"].length; i < len; i++) {
            data["nodes"].push(this.data["nodes"][i].getIntegrate())
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["type"] = this.type;
        data["signal"] = this.signal;
        data["electroeye"] = this.electroeye;
        data["geoLiveType"] = this.geoLiveType;
        data["kgflag"] = this.kgflag;
        data["links"] = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            data["links"].push(this.links[i].getIntegrate())
        }

        data["names"] = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            data["names"].push(this.names[i].getIntegrate())
        }

        data["nodes"] = [];
        for (var i = 0, len = this.nodes.length; i < len; i++) {
            data["nodes"].push(this.nodes[i].getIntegrate())
        }

        return data;
    }
});
/***
 * rdCross初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
fastmap.dataApi.rdCross = function (data, options) {
    return new fastmap.dataApi.RdCross(data, options);
}
;/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdCrossLink=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSSLINK";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid=data["pid"];
        this.linkPid=data["linkPid"];
        this.rowId = data["rowId"];
    },

    getIntegrate:function(){
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdCrossLink = function (data, options) {
    return new fastmap.dataApi.RdCrossLink(data, options);
}
;/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdCrossName = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSSNAME";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.nameGroupid = data["nameGroupid"] || 1;
        this.nameId = data["nameId"] || 1;
        this.langCode = data["langCode"] || "CHI";
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
        this.rowId = data["rowId"];
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["nameGroupid"] = this.nameGroupid;
        data["nameId"] = this.nameId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["nameGroupid"] = this.nameGroupid;
        data["nameId"] = this.nameId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});
/***
 * rdCross中的name初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
fastmap.dataApi.rdCrossName = function (data, options) {
    return new fastmap.dataApi.RdCrossName(data, options);
}
;/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdCrossNode=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSSNODE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.isMain = data["isMain"] || 0;
        this.nodePid = data["nodePid"];
        this.rowId = data["rowId"];
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid ;
        data["isMain"] = this.isMain;
        data["nodePid"] = this.nodePid ;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid ;
        data["isMain"] = this.isMain;
        data["nodePid"] = this.nodePid ;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdCrossNode = function (data, options) {
    return new fastmap.dataApi.RdCrossNode(data, options);
};/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdLaneConnexity = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType  = "RDLANECONNEXITY";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.laneInfo = data["laneInfo"] || "";
        this.conflictFlag = data["conflictFlag"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.laneNum = data["laneNum"] || 0;
        this.leftExtend = data["leftExtend"] || 0;
        this.rightExtend = data["rightExtend"] || 0;
        this.srcFlag = data["srcFlag"] || 0;
        this.topos = [];
        for (var i = 0; i < data["topos"].length; i++) {
            var topos = fastmap.dataApi.rdLaneTopology(data["topos"][i]);
            this.topos.push(topos);
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["laneInfo"] = this.laneInfo;
        data["conflictFlag"] = this.conflictFlag;
        data["kgFlag"] = this.kgFlag;
        data["laneNum"] = this.laneNum;
        data["leftExtend"] = this.leftExtend;
        data["rightExtend"] = this.rightExtend;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        data["topos"] = [];
        for (var i = 0; i < this.topos.length; i++) {
            data["topos"].push(this.topos[i].getIntegrate())
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["laneInfo"] = this.laneInfo;
        data["conflictFlag"] = this.conflictFlag;
        data["kgFlag"] = this.kgFlag;
        data["laneNum"] = this.laneNum;
        data["leftExtend"] = this.leftExtend;
        data["rightExtend"] = this.rightExtend;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        data["topos"] = [];
        for (var i = 0; i < this.topos.length; i++) {
            data["topos"].push(this.topos[i].getIntegrate())
        }

        return data;
    }
});
/***
 * rdLaneConnexity初始化函数
 * @param data 车信数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdLaneConnexity}
 */
fastmap.dataApi.rdLaneConnexity = function (data, options) {
    return new fastmap.dataApi.RdLaneConnexity(data, options);
};/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdLaneTopology = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLANETOPOLOGY";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.busLaneInfo = data["busLaneInfo"] || 0;
        this.connexityPid = data["connexityPid"];
        this.inLaneInfo = data["inLaneInfo"] || 0;
        this.outLinkPid = data["outLinkPid"];
        this.reachDir = data["reachDir"] || 0;
        this.relationshipType = data["relationshipType"] || 1;
        this.vias = [];
        for (var i = 0; i < data["vias"].length; i++) {
            var via = fastmap.dataApi.rdLaneVIA(data["vias"][i]);
            this.vias.push(via);
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["busLaneInfo"] = this.busLaneInfo;
        data["connexityPid"] = this.connexityPid;
        data["inLaneInfo"] = this.inLaneInfo;
        data["outLinkPid"] = this.outLinkPid;
        data["reachDir"] = this.reachDir;
        data["relationshipType"] = this.relationshipType;
        data["vias"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias.getIntegrate())
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["busLaneInfo"] = this.busLaneInfo;
        data["connexityPid"] = this.connexityPid;
        data["inLaneInfo"] = this.inLaneInfo;
        data["outLinkPid"] = this.outLinkPid;
        data["reachDir"] = this.reachDir;
        data["relationshipType"] = this.relationshipType;
        data["vias"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias[i].getIntegrate())
        }
        return data;
    }
});/***
 * rdLaneConnexity topos初始化函数
 * @param data 车信数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdlanetopology}
 */
fastmap.dataApi.rdLaneTopology = function (data, options) {
    return new fastmap.dataApi.RdLaneTopology(data, options);
}
;/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdLaneVIA=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLANEVIA";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.groupId = data["groupId"] || 1;
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
        this.topologyId = data["topologyId"] || 0;
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["topologyId"] = this.topologyId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["topologyId"] = this.topologyId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdLaneVIA = function (data, options) {
    return new fastmap.dataApi.RdLaneVIA(data, options);
}
;/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdSpeedLimit = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDSPEEDLIMIT";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.linkPid = data["linkPid"];
        this.direct = data["direct"] || 0;
        this.speedValue = data["speedValue"] || 0;
        this.speedType = data["speedType"] || 0;
        this.tollgateFlag = data["tollgateFlag"] || 0;
        this.speedDependent = data["speedDependent"] || 0;
        this.speedFlag = data["speedFlag"] || 0;
        this.limitSrc = data["limitSrc"] || 1;
        this.timeDomain = data["timeDomain"] || "";
        this.captureFlag = data["captureFlag"] || 0;
        this.descript = data["descript"] || "";
        this.meshId = data["meshId"] || 0;
        this.status = data["status"] || 7;
        this.ckStatus = data["ckStatus"] || 6;
        this.adjaFlag = data["adjaFlag"] || 0;
        this.recStatusIn = data["recStatusIn"] || 0;
        this.recStatusOut = data["recStatusOut"] || 0;
        this.timeDescript = data["timeDescript"] || "";
        this.geometry = data["geometry"];
        this.laneSpeedValue = data["laneSpeedValue"] || "";
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["direct"] = this.direct;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["tollgateFlag"] = this.tollgateFlag;
        data["speedDependent"] = this.speedDependent;
        data["speedFlag"] = this.speedFlag;
        data["limitSrc"] = this.limitSrc;
        data["timeDomain"] = this.timeDomain;
        data["captureFlag"] = this.captureFlag;
        data["descript"] = this.descript;
        data["meshId"] = this.meshId;
        data["status"] = this.status;
        data["ckStatus"] = this.ckStatus;
        data["adjaFlag"] = this.adjaFlag;
        data["recStatusIn"] = this.recStatusIn;
        data["recStatusOut"] = this.recStatusOut;
        data["timeDescript"] = this.timeDescript;
        data["geometry"] = this.geometry;
        data["laneSpeedValue"] = this.laneSpeedValue;
        data["geoLiveType"]  = this.geoLiveType;

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["direct"] = this.direct;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["tollgateFlag"] = this.tollgateFlag;
        data["speedDependent"] = this.speedDependent;
        data["speedFlag"] = this.speedFlag;
        data["limitSrc"] = this.limitSrc;
        data["timeDomain"] = this.timeDomain;
        data["captureFlag"] = this.captureFlag;
        data["descript"] = this.descript;
        data["meshId"] = this.meshId;
        data["status"] = this.status;
        data["ckStatus"] = this.ckStatus;
        data["adjaFlag"] = this.adjaFlag;
        data["recStatusIn"] = this.recStatusIn;
        data["recStatusOut"] = this.recStatusOut;
        data["timeDescript"] = this.timeDescript;
        data["geometry"] = this.geometry;
        data["laneSpeedValue"] = this.laneSpeedValue;
        data["geoLiveType"]  = this.geoLiveType;

        return data;
    }
});
/***
 * rdSpeedLimit初始化函数
 * @param data 限速数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdSpeedLimit}
 */
fastmap.dataApi.rdSpeedLimit = function (data, options) {
    return new fastmap.dataApi.RdSpeedLimit(data, options);
};/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.AdLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ADLINK";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.sNodePid = data["sNodePid"];
        this.eNodePid = data["eNodePid"];
        this.kind = data["kind"] || 1;
        this.form = data["form"] || 1;
        this.geometry = data["geometry"];
        this.length = data["length"] || 0;
        this.scale = data["scale"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.meshId = data["meshId"] || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["scale"] = this.scale;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["scale"] = this.scale;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

});

    fastmap.dataApi.adLink = function (data, options) {
        return new fastmap.dataApi.AdLink(data, options);
    }




;/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.AdAdminName = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["regionId"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["regionId"];
        }
        this.geoLiveType = "ADADMINNAME";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.rowId = data["rowId"];
        this.nameId = data["nameId"];
        this.regionId = data["regionId"];
        this.nameGroupId = data["nameGroupId"] || 1;
        this.langCode = data["langCode"] || "CHI" || "CHT";
        this.nameClass = data["nameClass"] || 1;
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
        this.geoLiveType=data["geoLiveType"];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["rowId"] = this.rowId;
        data["nameId"] = this.nameId;
        data["regionId"] = this.regionId;
        data["nameGroupId"] = this.nameGroupId;
        data["langCode"] = this.langCode;
        data["nameClass"] = this.nameClass;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["rowId"] = this.rowId;
        data["nameId"] = this.nameId;
        data["regionId"] = this.regionId;
        data["nameGroupId"] = this.nameGroupId;
        data["langCode"] = this.langCode;
        data["nameClass"] = this.nameClass;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }

});

fastmap.dataApi.adAdminName = function (data, options) {
    return new fastmap.dataApi.AdAdminName(data, options);
}
;/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.AdAdmin = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ADADMIN";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.regionId = data["regionId"];
        this.adminId = data["adminId"] || 0;
        this.extendId = data["extendId"] || 0;
        this.adminType = data["adminType"] || 0;
        this.capital = data["capital"] || 0;
        this.population = data["population"] || null;
        this.geometry = data["geometry"];
        this.linkPid = data["linkPid"] || 0;
        this.side = data["side"] || 0;
        this.jisCode = data["jisCode"] || 0;
        this.meshId = data["meshId"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.memo = data["memo"] || null;

        this.names = [];
        if (data["names"]&&data["names"].length > 0) {
            for (var i = 0, len = data["names"].length; i < len; i++) {
                var name =fastmap.dataApi.adAdminName(data["names"][i]);
                this.names.push(name);
            }
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"]=this.pid;
        data["regionId"] = this.regionId;
        data["adminId"] = this.adminId;
        data["extendId"] = this.extendId;
        data["adminType"] = this.adminType;
        data["capital"] = this.capital;
        data["population"] = this.population;
        data["geometry"] = this.geometry;
        data["linkPid"] = this.linkPid;
        data["side"] = this.side;
        data["jisCode"] = this.jisCode;
        data["meshId"] = this.meshId;
        data["editFlag"] = this.editFlag;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data["names"] = names;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data["pid"]=this.pid;
        data["regionId"] = this.regionId;
        data["adminId"] = this.adminId;
        data["extendId"] = this.extendId;
        data["adminType"] = this.adminType;
        data["capital"] = this.capital;
        data["population"] = this.population;
        data["geometry"] = this.geometry;
        data["linkPid"] = this.linkPid;
        data["side"] = this.side;
        data["jisCode"] = this.jisCode;
        data["meshId"] = this.meshId;
        data["editFlag"] = this.editFlag;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data["names"] = names;
        return data;
    }

});

fastmap.dataApi.adAdmin = function (data, options) {
    return new fastmap.dataApi.AdAdmin(data, options);
}
;/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.RdGsc = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDGSC";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.geometry = data["geometry"];
        this.processFlag = data["processFlag"] || 1;

        this.links = [];
        if (data["links"]&&data["links"].length > 0) {
            for (var i = 0, len = data["links"].length; i < len; i++) {
                var link =fastmap.dataApi.rdGscLink(data["links"][i]);
                this.links.push(link);
            }

        }


    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["geometry"] = this.geometry;
        data["processFlag"] = this.processFlag;
        data["geoLiveType"] = this.geoLiveType;

        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["geometry"] = this.geometry;
        data["processFlag"] = this.processFlag;
        data["geoLiveType"] = this.geoLiveType;

        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;
        return data;
    },
});

fastmap.dataApi.rdGsc = function (data, options) {
    return new fastmap.dataApi.RdGsc(data, options);
}

;/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.RdGscLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDGSCLINK";
        if(!data["pid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["pid"];
        }

        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.zlevel = data["zlevel"] || 0;
        this.linkPid = data["linkPid"] || 0;
        this.tableName = data["tableName"]|| "";
        this.shpSeqNum = data["shpSeqNum"] || 1;
        this.startEnd = data["startEnd"] || 0;
        this.rowId = data["rowId"];

    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["zlevel"] = this.zlevel;
        data["linkPid"] = this.linkPid;
        data["tableName"] = this.tableName;
        data["shpSeqNum"] = this.shpSeqNum;
        data["startEnd"] = this.startEnd;
        data["geoLiveType"] = this.geoLiveType;
        data["rowId"] = this.rowId;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["zlevel"] = this.zlevel;
        data["linkPid"] = this.linkPid;
        data["tableName"] = this.tableName;
        data["shpSeqNum"] = this.shpSeqNum;
        data["startEnd"] = this.startEnd;
        data["geoLiveType"] = this.geoLiveType;
        data["rowId"] = this.rowId;
        return data;
    },

});

fastmap.dataApi.rdGscLink = function (data, options) {
    return new fastmap.dataApi.RdGscLink(data, options);
}
;/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.AdFace = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ADFACE";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.regionId = data["regionId"];
        this.geometry = data["geometry"];
        this.area = data["area"] || 0;
        this.perimeter = data["perimeter"] || 0;
        this.meshId = data["meshId"] || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["regionId"] = this.regionId;
        data["geometry"] = this.geometry;
        data["area"] = this.area;
        data["perimeter"] = this.perimeter;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["facePid"] = this.facePid;
        data["regionId"] = this.regionId;
        data["geometry"] = this.geometry;
        data["area"] = this.area;
        data["perimeter"] = this.perimeter;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

});

fastmap.dataApi.adFace = function (data, options) {
    return new fastmap.dataApi.AdFace(data, options);
}




;/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.RwLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RWLINK";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
        this.featurePid = data["featurePid"] || 0;
        this.sNodePid = data["sNodePid"];
        this.eNodePid = data["eNodePid"];
        this.kind = data["kind"] || 1;
        this.form = data["form"] || 0;
        this.length = data["length"] || 0;
        this.geoemtry = data["geoemtry"];
        this.meshId = data["meshId"] || 0;
        this.scale = data["scale"] || 0;
        this.detailFlag = data["detailFlag"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.color = data["color"] || null;

       /* this.links = [];
        if (data["links"]&&data["links"].length > 0) {
            for (var i = 0, len = data["links"].length; i < len; i++) {
                var link =fastmap.dataApi.rdgsclink(data["links"][i]);
                this.links.push(link);
            }

        }*/


    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["featurePid"] = this.featurePid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["length"] = this.length;
        data["geometry"] = this.geometry;
        data["meshId"] = this.meshId;
        data["scale"] = this.scale;
        data["detailFlag"] = this.detailFlag;
        data["editFlag"] = this.editFlag;
        data["color"] = this.color;
        data["geoLiveType"] = this.geoLiveType;
      /*  var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;*/
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["featurePid"] = this.featurePid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["length"] = this.length;
        data["geometry"] = this.geometry;
        data["meshId"] = this.meshId;
        data["scale"] = this.scale;
        data["detailFlag"] = this.detailFlag;
        data["editFlag"] = this.editFlag;
        data["color"] = this.color;
        data["geoLiveType"] = this.geoLiveType;
/*
        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;*/
        return data;
    },

});

fastmap.dataApi.rwLink = function (data, options) {
    return new fastmap.dataApi.RwLink(data, options);
}

;/**
 * Geometry
 * 基于leaflet的几何基类
 *
 * @namespace mapApi
 * @class Geometry
 */
fastmap.mapApi.Geometry = L.Class.extend({
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "Geometry",

    /**
     * @method initialize
     * 初始化构造函数
     *
     */
    initialize: function () {
        this.bounds = null;
    },

    /**
     * 深度拷贝几何.
     * @method clone
     * @return {!fastmap.mapApi.Geometry} Clone.
     */
    clone: fastmap.abstractMethod,

    /**
     * 获取几何的外包框.
     * @method  getExtent
     * @param {fastmap.mapApi.Extent} opt_extent Extent.
     * @return {fastmap.mapApi.Extent} extent Extent.
     */
    getExtent: fastmap.abstractMethod,

    /**
     * 清除外包框
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }
    },

    /**
     * 通过wkt生成几何类
     * @method fromWkt
     *
     * @param {string} wkt.
     * @return {fastmap.mapApi.Geometry} geometry.
     */
    fromWkt: function (wkt) {
        return null;
    },

    /**
     * 几何类生成wkt
     * @method toWkt
     *
     * @return {string} geoJsonString.
     */
    toWkt: function () {
        return "";
    },

    /**
     * 计算两个几何之间的距离
     * @method distanceTo
     *
     * @param {fastmap.mapApi.Geometry} 用于计算距离的另外一个几何
     * @param {Object} Optional 计算距离时所需要的其他参数
     *
     * @return {Number | Object} 返回距离和相应的两个点
     */
    distanceTo: function (geometry, options) {

    }
});

/**
 * Function: OpenLayers.Geometry.fromWKT
 * Generate a geometry given a Well-Known Text string.  For this method to
 *     work, you must include the OpenLayers.Format.WKT in your build
 *     explicitly.
 *
 * Parameters:
 * wkt - {String} A string representing the geometry in Well-Known Text.
 *
 * Returns:
 * {<OpenLayers.Geometry>} A geometry of the appropriate class.
 */
fastmap.mapApi.Geometry.fromWKT = function(wkt) {
    var geom;
    if (OpenLayers.Format && OpenLayers.Format.WKT) {
        var format = OpenLayers.Geometry.fromWKT.format;
        if (!format) {
            format = new OpenLayers.Format.WKT();
            OpenLayers.Geometry.fromWKT.format = format;
        }
        var result = format.read(wkt);
        if (result instanceof OpenLayers.Feature.Vector) {
            geom = result.geometry;
        } else if (OpenLayers.Util.isArray(result)) {
            var len = result.length;
            var components = new Array(len);
            for (var i=0; i<len; ++i) {
                components[i] = result[i].geometry;
            }
            geom = new OpenLayers.Geometry.Collection(components);
        }
    }
    return geom;
};

/**
 * Method: OpenLayers.Geometry.segmentsIntersect
 * Determine whether two line segments intersect.  Optionally calculates
 *     and returns the intersection point.  This function is optimized for
 *     cases where seg1.x2 >= seg2.x1 || seg2.x2 >= seg1.x1.  In those
 *     obvious cases where there is no intersection, the function should
 *     not be called.
 *
 * Parameters:
 * seg1 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * seg2 - {Object} Object representing a segment with properties x1, y1, x2,
 *     and y2.  The start point is represented by x1 and y1.  The end point
 *     is represented by x2 and y2.  Start and end are ordered so that x1 < x2.
 * options - {Object} Optional properties for calculating the intersection.
 *
 * Valid options:
 * point - {Boolean} Return the intersection point.  If false, the actual
 *     intersection point will not be calculated.  If true and the segments
 *     intersect, the intersection point will be returned.  If true and
 *     the segments do not intersect, false will be returned.  If true and
 *     the segments are coincident, true will be returned.
 * tolerance - {Number} If a non-null value is provided, if the segments are
 *     within the tolerance distance, this will be considered an intersection.
 *     In addition, if the point option is true and the calculated intersection
 *     is within the tolerance distance of an end point, the endpoint will be
 *     returned instead of the calculated intersection.  Further, if the
 *     intersection is within the tolerance of endpoints on both segments, or
 *     if two segment endpoints are within the tolerance distance of eachother
 *     (but no intersection is otherwise calculated), an endpoint on the
 *     first segment provided will be returned.
 *
 * Returns:
 * {Boolean | <OpenLayers.Geometry.Point>}  The two segments intersect.
 *     If the point argument is true, the return will be the intersection
 *     point or false if none exists.  If point is true and the segments
 *     are coincident, return will be true (and the instersection is equal
 *     to the shorter segment).
 */
fastmap.mapApi.Geometry.segmentsIntersect = function(seg1, seg2, options) {
    var point = options && options.point;
    var tolerance = options && options.tolerance;
    var intersection = false;
    var x11_21 = seg1.x1 - seg2.x1;
    var y11_21 = seg1.y1 - seg2.y1;
    var x12_11 = seg1.x2 - seg1.x1;
    var y12_11 = seg1.y2 - seg1.y1;
    var y22_21 = seg2.y2 - seg2.y1;
    var x22_21 = seg2.x2 - seg2.x1;
    var d = (y22_21 * x12_11) - (x22_21 * y12_11);
    var n1 = (x22_21 * y11_21) - (y22_21 * x11_21);
    var n2 = (x12_11 * y11_21) - (y12_11 * x11_21);
    if(d == 0) {
        // parallel
        if(n1 == 0 && n2 == 0) {
            // coincident
            intersection = true;
        }
    } else {
        var along1 = n1 / d;
        var along2 = n2 / d;
        if(along1 >= 0 && along1 <= 1 && along2 >=0 && along2 <= 1) {
            // intersect
            if(!point) {
                intersection = true;
            } else {
                // calculate the intersection point
                var x = seg1.x1 + (along1 * x12_11);
                var y = seg1.y1 + (along1 * y12_11);
                intersection = new fastmap.mapApi.Point(x, y);
            }
        }
    }
    if(tolerance) {
        var dist;
        if(intersection) {
            if(point) {
                var segs = [seg1, seg2];
                var seg, x, y;
                // check segment endpoints for proximity to intersection
                // set intersection to first endpoint within the tolerance
                outer: for(var i=0; i<2; ++i) {
                    seg = segs[i];
                    for(var j=1; j<3; ++j) {
                        x = seg["x" + j];
                        y = seg["y" + j];
                        dist = Math.sqrt(
                                Math.pow(x - intersection.x, 2) +
                                Math.pow(y - intersection.y, 2)
                        );
                        if(dist < tolerance) {
                            intersection.x = x;
                            intersection.y = y;
                            break outer;
                        }
                    }
                }

            }
        } else {
            // no calculated intersection, but segments could be within
            // the tolerance of one another
            var segs = [seg1, seg2];
            var source, target, x, y, p, result;
            // check segment endpoints for proximity to intersection
            // set intersection to first endpoint within the tolerance
            outer: for(var i=0; i<2; ++i) {
                source = segs[i];
                target = segs[(i+1)%2];
                for(var j=1; j<3; ++j) {
                    p = {x: source["x"+j], y: source["y"+j]};
                    result = fastmap.mapApi.Geometry.distanceToSegment(p, target);
                    if(result.distance < tolerance) {
                        if(point) {
                            intersection = new fastmap.mapApi.Point(p.x, p.y);
                        } else {
                            intersection = true;
                        }
                        break outer;
                    }
                }
            }
        }
    }
    return intersection;
};

/**
 * Function: OpenLayers.Geometry.distanceToSegment
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with distance, along, x, and y properties.  The distance
 *     will be the shortest distance between the input point and segment.
 *     The x and y properties represent the coordinates along the segment
 *     where the shortest distance meets the segment. The along attribute
 *     describes how far between the two segment points the given point is.
 */
fastmap.mapApi.Geometry.distanceToSegment = function(point, segment) {
    var result = fastmap.mapApi.Geometry.distanceSquaredToSegment(point, segment);
    result.distance = Math.sqrt(result.distance);
    return result;
};

/**
 * Function: OpenLayers.Geometry.distanceSquaredToSegment
 *
 * Usually the distanceToSegment function should be used. This variant however
 * can be used for comparisons where the exact distance is not important.
 *
 * Parameters:
 * point - {Object} An object with x and y properties representing the
 *     point coordinates.
 * segment - {Object} An object with x1, y1, x2, and y2 properties
 *     representing endpoint coordinates.
 *
 * Returns:
 * {Object} An object with squared distance, along, x, and y properties.
 *     The distance will be the shortest distance between the input point and
 *     segment. The x and y properties represent the coordinates along the
 *     segment where the shortest distance meets the segment. The along
 *     attribute describes how far between the two segment points the given
 *     point is.
 */
fastmap.mapApi.Geometry.distanceSquaredToSegment = function(point, segment) {
    var x0 = point.x;
    var y0 = point.y;
    var x1 = segment.x1;
    var y1 = segment.y1;
    var x2 = segment.x2;
    var y2 = segment.y2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
        (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if(along <= 0.0) {
        x = x1;
        y = y1;
    } else if(along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
        x: x, y: y,
        along: along
    };
};

fastmap.mapApi.geometry=function() {
    return new fastmap.mapApi.Geometry();
};
;/**
 * Created by zhongxiaoming on 2015/10/14.
 * Class Collection 组成几何对象的几何集合
 */
fastmap.mapApi.Collection = fastmap.mapApi.Geometry.extend({

    /**
     * 几何类型
     * type
     * @property type
     * @type Collection
     */
    type:"Collection",

    /**
     * 组成部分
     * components
     * @property components
     */
    components:[],

    initialize: function (components) {
        this.components = [];
        if (components != null) {
            this.addComponents(components);
        }
    },

    /***
     * 返回组成集合的字符串
     * @returns {string}
     */
    getComponentsString: function(){
        var strings = [];
        for(var i=0, len=this.components.length; i<len; i++) {
            strings.push(this.components[i].toShortString());
        }
        return strings.join(",");
    },

    /***
     * 计算外包框
     */
    calculateBounds: function() {},

    /***
     * 向几何对象中加入组件数组
     * @param components
     */
    addComponents: function(components){
        if(!(L.Util.isArray(components))) {
            components = [components];
        }
        for(var i=0, len=components.length; i<len; i++) {
            this.addComponent(components[i]);
        }
    },

    /***
     * 向几何对象中加入组件
     * @param component
     * @param index
     */
    addComponent: function(component, index) {
        var added = false;
        if(component) {
            if(this.componentTypes == null ||
                (OpenLayers.Util.indexOf(this.componentTypes,
                    component.CLASS_NAME) > -1)) {

                if(index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index,
                        this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },

    /***
     * 删除指定的组件数组
     * @param components
     */
    removeComponents: function(components) {},

    /***
     * 删除指定的组件
     * @param component
     */
    removeComponent: function(component) {},

    /***
     * 获取几何对象节点
     * @param nodes
     */
    getVertices: function(nodes) {}
});/**
 * Point
 * 基于Geometry的Point类
 *
 * @namespace mapApi
 * @class Point
 */
fastmap.mapApi.Point = fastmap.mapApi.Geometry.extend({
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "Point",
    /**
     * 点的横坐标
     * x
     * @property x
     * @type Number
     */
    x: null,

    /**
     * 点的纵坐标
     * y
     * @property y
     * @type Number
     */
    y: null,

    /**
     * @method initialize
     * 初始化构造函数
     *
     * @param {Number} x 横坐标
     * @param {Number} y 纵坐标
     *
     */
    initialize: function (x, y) {
        fastmap.mapApi.Geometry.prototype.initialize.apply(this, arguments);

        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },

    /**
     * 深度拷贝几何.
     * @method clone
     * @return {fastmap.mapApi.Point} Clone.
     */
    clone: function () {
        var obj = new fastmap.mapApi.Point(this.x, this.y);

        return obj;
    },

    /**
     * 与传入几何对象间的距离
     * @method distanceTo
     * @return {object} result.
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var distance, x0, y0, x1, y1, result;
        if(geometry instanceof fastmap.mapApi.Point) {
            x0 = this.x;
            y0 = this.y;
            x1 = geometry.x;
            y1 = geometry.y;
            distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            result = !details ?
                distance : {x0: x0, y0: y0, x1: x1, y1: y1, distance: distance};
        } else {
            result = geometry.distanceTo(this, options);
            if(details) {
                result = {
                    x0: result.x1, y0: result.y1,
                    x1: result.x0, y1: result.y0,
                    distance: result.distance
                };
            }
        }
        return result;
    },

    /**
     * 计算点对象的外包框
     * @method calculateBounds
     *
     * @return {fastmap.mapApi.Bounds}.
     */
    calculateBounds: function () {
        this.bounds = new fastmap.mapApi.Bounds(this.x, this.y, this.x, this.y);
        return this.bounds;
    },
    /**
     * 移动点
     * @method move
     * @param {Number}x
     * @param {Number}y
     */
    move: function (x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.bounds = null;
    },

    /**
     * 获取中心点
     * @method getCentroid
     * @returns {fastmap.mapApi.Point}
     */
    getCentroid: function () {
        return new fastmap.mapApi.Point(this.x, this.y);
    },

    /**
     * 判断点与几何相关空间位置关系，是否相交
     * @method intersects
     * @param {Geometry}geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        if (geometry.type == "Point") {
            intersect = this.equals(geometry);
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    getVertices: function(nodes) {
        return [this];
    }
});
fastmap.mapApi.point=function(x,y) {
    return new fastmap.mapApi.Point(x, y);
};

;/**
 * Created by liwanchong on 2015/9/8.
 * lineString对象
 * @namespace fast.mapApi
 * @class LineString
 */
fastmap.mapApi.LineString = fastmap.mapApi.Collection.extend({
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "LineString",

    /**
     * @class LineString
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}Points
     */
    initialize: function (points) {
        fastmap.mapApi.Collection.prototype.initialize.apply(this, arguments);
        this.points = points;
    },

    /**
     * 删除点
     * @method removeComponent
     * @return ｛boolean｝ 是否删除成功.
     */
    removeComponent: function(point) {
        var removed = this.components && (this.components.length > 2);
        if (removed) {
            fastmap.mapApi.Collection.prototype.removeComponent.apply(this,
                arguments);
        }
        return removed;
    },

    /**
     * 复制整个lineString
     * @method clone
     * @return LineString Clone.
     */
    clone: function () {
        var newpoints = new Array();
        newpoints = this.points.slice(0);
        var lineString = new fastmap.mapApi.LineString(newpoints);
        return lineString;
    },
    /**
     *获取lineString坐标数据
     * @method getCoordinates
     * @param {Array}coordinates
     */

    getCoordinates: function () {
    },
    /**
     * 获取开始点
     * @method getStartPoint
     * @param {Point}coordinates
     */
    getStartPoint: function (coordinates) {

    },
    /**
     * 获取线的结束点
     * @method getEndPoint
     * @param {Point} coordinates
     */
    getEndPoint: function (coordinates) {

    },
    /**
     *点到线的小片段的距离
     * @method pointToSegmentDistance
     * @param {Point}p
     * @param {Point}p1
     * @param {Point}p2
     * @returns {number}
     */
    pointToSegmentDistance: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
        return this._sqClosestPointOnSegment(p, p1, p2);
    },

    _sqClosestPointOnSegment: function(p, p1, p2){
        var x0 = p.x;
        var y0 = p.y;
        var x1 = p1.x;
        var y1 = p1.y;
        var x2 = p2.x;
        var y2 = p2.y;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
            (Math.pow(dx, 2) + Math.pow(dy, 2));
        var x, y;
        if(along <= 0.0) {
            x = x1;
            y = y1;
        } else if(along >= 1.0) {
            x = x2;
            y = y2;
        } else {
            x = x1 + along * dx;
            y = y1 + along * dy;
        }
        return {
            distance:Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)) ,
            x: x, y: y,
            along: along
        };
    },
    /**
     *判断线是否交汇
     * @method intersects
     * @param {Geometry}geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        var type = geometry.type;
        if(type == "LineString" ||
            type == "LinearRing" ||
            type == "Point") {
            var segs1 = this.getSortedSegments();
            var segs2;
            if(type == "Point") {
                segs2 = [{
                    x1: geometry.x, y1: geometry.y,
                    x2: geometry.x, y2: geometry.y
                }];
            } else {
                segs2 = geometry.getSortedSegments();
            }
            var seg1, seg1x1, seg1x2, seg1y1, seg1y2,
                seg2, seg2y1, seg2y2;
            // sweep right
            outer: for(var i=0, len=segs1.length; i<len; ++i) {
                seg1 = segs1[i];
                seg1x1 = seg1.x1;
                seg1x2 = seg1.x2;
                seg1y1 = seg1.y1;
                seg1y2 = seg1.y2;
                inner: for(var j=0, jlen=segs2.length; j<jlen; ++j) {
                    seg2 = segs2[j];
                    if(seg2.x1 > seg1x2) {
                        // seg1 still left of seg2
                        break;
                    }
                    if(seg2.x2 < seg1x1) {
                        // seg2 still left of seg1
                        continue;
                    }
                    seg2y1 = seg2.y1;
                    seg2y2 = seg2.y2;
                    if(Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
                        // seg2 above seg1
                        continue;
                    }
                    if(Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
                        // seg2 below seg1
                        continue;
                    }
                    if(fastmap.mapApi.Geometry.segmentsIntersect(seg1, seg2)) {
                        intersect = true;
                        break outer;
                    }
                }
            }
        } else {
            intersect = geometry.intersects(this);
        }
        return intersect;
    },
    /**
     * 获取组成线的片段
     *@method getSortedSegments
     * @param {Boolean}boolsort 是否返回排序的片段
     * Returns:
     * {Array} An array of segment objects.  Segment objects have properties
     *     x1, y1, x2, and y2.  The start point is represented by x1 and y1.
     *     The end point is represented by x2 and y2.  Start and end are
     *     ordered so that x1 < x2.
     */
    getSortedSegments: function (boolsort) {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg), point1, point2;
        for(var i=0; i<numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if(point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }
        // more efficient to define this somewhere static
        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }

        if(boolsort == true){
            return segments.sort(byX1)
        }else{
            return segments;
        }
    },
    /**
     *把线分离成多个片段
     *@method splitWithSegment
     * @param {Object}seg
     * @param {Object}options
     */
    splitWithSegment: function(seg, options) {
        var edge = !(options && options.edge === false);
        var tolerance = options && options.tolerance;
        var lines = [];
        var verts = this.getVertices();
        var points = [];
        var intersections = [];
        var split = false;
        var vert1, vert2, point;
        var node, vertex, target;
        var interOptions = {point: true, tolerance: tolerance};
        var result = null;
        for(var i=0, stop=verts.length-2; i<=stop; ++i) {
            vert1 = verts[i];
            points.push(vert1.clone());
            vert2 = verts[i+1];
            target = {x1: vert1.x, y1: vert1.y, x2: vert2.x, y2: vert2.y};
            point = fastmap.mapApi.Geometry.segmentsIntersect(
                seg, target, interOptions
            );
            if(point instanceof fastmap.mapApi.Point) {
                if((point.x === seg.x1 && point.y === seg.y1) ||
                    (point.x === seg.x2 && point.y === seg.y2) ||
                    point.equals(vert1) || point.equals(vert2)) {
                    vertex = true;
                } else {
                    vertex = false;
                }
                if(vertex || edge) {
                    // push intersections different than the previous
                    if(!point.equals(intersections[intersections.length-1])) {
                        intersections.push(point.clone());
                    }
                    if(i === 0) {
                        if(point.equals(vert1)) {
                            continue;
                        }
                    }
                    if(point.equals(vert2)) {
                        continue;
                    }
                    split = true;
                    if(!point.equals(vert1)) {
                        points.push(point);
                    }
                    lines.push(new fastmap.mapApi.LineString(points));
                    points = [point.clone()];
                }
            }
        }
        if(split) {
            points.push(vert2.clone());
            lines.push(new fastmap.mapApi.LineString(points));
        }
        if(intersections.length > 0) {
            // sort intersections along segment
            var xDir = seg.x1 < seg.x2 ? 1 : -1;
            var yDir = seg.y1 < seg.y2 ? 1 : -1;
            result = {
                lines: lines,
                points: intersections.sort(function(p1, p2) {
                    return (xDir * p1.x - xDir * p2.x) || (yDir * p1.y - yDir * p2.y);
                })
            };
        }
        return result;
    },
    /**
     * 根据参数分离geometry
     *@method split
     * @param {Object}target
     * @param {Object}options
     */
    split: function(target, options) {
        var results = null;
        var mutual = options && options.mutual;
        var sourceSplit, targetSplit, sourceParts, targetParts;
        if(target instanceof fastmap.mapApi.LineString) {
            var verts = this.getVertices();
            var vert1, vert2, seg, splits, lines, point;
            var points = [];
            sourceParts = [];
            for(var i=0, stop=verts.length-2; i<=stop; ++i) {
                vert1 = verts[i];
                vert2 = verts[i+1];
                seg = {
                    x1: vert1.x, y1: vert1.y,
                    x2: vert2.x, y2: vert2.y
                };
                targetParts = targetParts || [target];
                if(mutual) {
                    points.push(vert1.clone());
                }
                for(var j=0; j<targetParts.length; ++j) {
                    splits = targetParts[j].splitWithSegment(seg, options);
                    if(splits) {
                        // splice in new features
                        lines = splits.lines;
                        if(lines.length > 0) {
                            lines.unshift(j, 1);
                            Array.prototype.splice.apply(targetParts, lines);
                            j += lines.length - 2;
                        }
                        if(mutual) {
                            for(var k=0, len=splits.points.length; k<len; ++k) {
                                point = splits.points[k];
                                if(!point.equals(vert1)) {
                                    points.push(point);
                                    sourceParts.push(new fastmap.mapApi.LineString(points));
                                    if(point.equals(vert2)) {
                                        points = [];
                                    } else {
                                        points = [point.clone()];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(mutual && sourceParts.length > 0 && points.length > 0) {
                points.push(vert2.clone());
                sourceParts.push(new fastmap.mapApi.LineString(points));
            }
        } else {
            results = target.splitWith(this, options);
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetSplit || sourceSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    splitWith: function(geometry, options) {
        return geometry.split(this, options);
    },

    /**
     * 距线最近的点
     * @method distanceTo
     * @param {Geometry}geometry
     * @param {Object}options
     * @returns {{}}
     */
    distanceTo: function(geometry, options) {
        var edge = !(options && options.edge === false);
        var details = edge && options && options.details;
        var result, best = {};
        var min = Number.POSITIVE_INFINITY;
        if(geometry instanceof fastmap.mapApi.Point) {
            var segs = this.getSortedSegments();
            var x = geometry.x;
            var y = geometry.y;
            var seg;
            for(var i=0, len=segs.length; i<len; ++i) {
                seg = segs[i];
                result = fastmap.mapApi.Geometry.distanceToSegment(geometry, seg);
                if(result.distance < min) {
                    min = result.distance;
                    best = result;
                    if(min === 0) {
                        break;
                    }
                } else {
                    // if distance increases and we cross y0 to the right of x0, no need to keep looking.
                    if(seg.x2 > x && ((y > seg.y1 && y < seg.y2) || (y < seg.y1 && y > seg.y2))) {
                        break;
                    }
                }
            }
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x, y0: best.y,
                    x1: x, y1: y
                };
            } else {
                best = best.distance;
            }
        } else if(geometry instanceof fastmap.mapApi.LineString) {
            var segs0 = this.getSortedSegments();
            var segs1 = geometry.getSortedSegments();
            var seg0, seg1, intersection, x0, y0;
            var len1 = segs1.length;
            var interOptions = {point: true};
            outer: for(var i=0, len=segs0.length; i<len; ++i) {
                seg0 = segs0[i];
                x0 = seg0.x1;
                y0 = seg0.y1;
                for(var j=0; j<len1; ++j) {
                    seg1 = segs1[j];
                    intersection = fastmap.mapApi.Geometry.segmentsIntersect(seg0, seg1, interOptions);
                    if(intersection) {
                        min = 0;
                        best = {
                            distance: 0,
                            x0: intersection.x, y0: intersection.y,
                            x1: intersection.x, y1: intersection.y
                        };
                        break outer;
                    } else {
                        result = fastmap.mapApi.Geometry.distanceToSegment({x: x0, y: y0}, seg1);
                        if(result.distance < min) {
                            min = result.distance;
                            best = {
                                distance: min,
                                x0: x0, y0: y0,
                                x1: result.x, y1: result.y
                            };
                        }
                    }
                }
            }
            if(!details) {
                best = best.distance;
            }
            if(min !== 0) {
                // check the final vertex in this line's sorted segments
                if(seg0) {
                    result = geometry.distanceTo(
                        new fastmap.mapApi.Point(seg0.x2, seg0.y2),
                        options
                    );
                    var dist = details ? result.distance : result;
                    if(dist < min) {
                        if(details) {
                            best = {
                                distance: min,
                                x0: result.x1, y0: result.y1,
                                x1: result.x0, y1: result.y0
                            };
                        } else {
                            best = dist;
                        }
                    }
                }
            }
        } else {
            best = geometry.distanceTo(this, options);
            // swap since target comes from this line
            if(details) {
                best = {
                    distance: best.distance,
                    x0: best.x1, y0: best.y1,
                    x1: best.x0, y1: best.y0
                };
            }
        }
        return best;
    },

    getVertices: function(nodes) {
        var vertices;
        if(nodes === true) {
            vertices = [
                this.components[0],
                this.components[this.components.length-1]
            ];
        } else if (nodes === false) {
            vertices = this.components.slice(1, this.components.length-1);
        } else {
            vertices = this.components.slice();
        }
        return vertices;
    },

    /**
     *根据容差获取数据
     * @method simplify
     * @param {Number}tolerance
     */
    simplify: function(tolerance){
        if (this && this !== null) {
            var points = this.getVertices();
            if (points.length < 3) {
                return this;
            }
            var compareNumbers = function(a, b){
                return (a-b);
            };
            /**
             * Private function doing the Douglas-Peucker reduction
             */
            var douglasPeuckerReduction = function(points, firstPoint, lastPoint, tolerance){
                var maxDistance = 0;
                var indexFarthest = 0;

                for (var index = firstPoint, distance; index < lastPoint; index++) {
                    distance = perpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }

                if (maxDistance > tolerance && indexFarthest != firstPoint) {
                    //Add the largest point that exceeds the tolerance
                    pointIndexsToKeep.push(indexFarthest);
                    douglasPeuckerReduction(points, firstPoint, indexFarthest, tolerance);
                    douglasPeuckerReduction(points, indexFarthest, lastPoint, tolerance);
                }
            };

            /**
             * Private function calculating the perpendicular distance
             * TODO: check whether OpenLayers.Geometry.LineString::distanceTo() is faster or slower
             */
            var perpendicularDistance = function(point1, point2, point){
                //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
                //Base = v((x1-x2)²+(x1-x2)²)                               *Base of Triangle*
                //Area = .5*Base*H                                          *Solve for height
                //Height = Area/.5/Base

                var area = Math.abs(0.5 * (point1.x * point2.y + point2.x * point.y + point.x * point1.y - point2.x * point1.y - point.x * point2.y - point1.x * point.y));
                var bottom = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
                var height = area / bottom * 2;

                return height;
            };

            var firstPoint = 0;
            var lastPoint = points.length - 1;
            var pointIndexsToKeep = [];

            //Add the first and last index to the keepers
            pointIndexsToKeep.push(firstPoint);
            pointIndexsToKeep.push(lastPoint);

            //The first and the last point cannot be the same
            while (points[firstPoint].equals(points[lastPoint])) {
                lastPoint--;
                //Addition: the first point not equal to first point in the LineString is kept as well
                pointIndexsToKeep.push(lastPoint);
            }

            douglasPeuckerReduction(points, firstPoint, lastPoint, tolerance);
            var returnPoints = [];
            pointIndexsToKeep.sort(compareNumbers);
            for (var index = 0; index < pointIndexsToKeep.length; index++) {
                returnPoints.push(points[pointIndexsToKeep[index]]);
            }
            return new OpenLayers.Geometry.LineString(returnPoints);

        }
        else {
            return this;
        }
    }
});
fastmap.mapApi.lineString=function(coordiates) {
    return new fastmap.mapApi.LineString(coordiates);
};

;/**
 * Created by wangtun on 2015/9/10.
 * Polygon 对象
 * @namespace fast.mapApi
 * @class Polygon
 */
fastmap.mapApi.Polygon = fastmap.mapApi.Collection.extend({
    type: "Polygon",
    components: [],
    options: {},
    /**
     * 构造函数
     * @class Polygon
     * @constructor
     * @param {Array}components
     * @param {Object}options
     */
    initialize: function (components, options) {
        this.components = components;
        this.options = options;
    },
    /**
     * 获取面积
     * @method getArea
     * @returns {number}
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i=1, len=this.components.length; i<len; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },
    /**
     * 是否包含某点
     * @method containsPoint
     * @param {Point}point
     * @returns {boolean}
     */
    containsPoint: function (point) {
        var numRings = this.components.length;
        var contained = false;
        if(numRings > 0) {
            // check exterior ring - 1 means on edge, boolean otherwise
            contained = this.components[0].containsPoint(point);
            if(contained !== 1) {
                if(contained && numRings > 1) {
                    // check interior rings
                    var hole;
                    for(var i=1; i<numRings; ++i) {
                        hole = this.components[i].containsPoint(point);
                        if(hole) {
                            if(hole === 1) {
                                // on edge
                                contained = 1;
                            } else {
                                // in hole
                                contained = false;
                            }
                            break;
                        }
                    }
                }
            }
        }
        return contained;
    },
    /**
     * 相交
     * @method intersects
     * @param {Geometry}geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        var i, len;
        if(geometry.type == "Point") {
            intersect = this.containsPoint(geometry);
        } else if(geometry.type == "LineString" ||
            geometry.type == "LinearRing") {
            // check if rings/linestrings intersect
            for(i=0, len=this.components.length; i<len; ++i) {
                intersect = geometry.intersects(this.components[i]);
                if(intersect) {
                    break;
                }
            }
            if(!intersect) {
                // check if this poly contains points of the ring/linestring
                for(i=0, len=geometry.components.length; i<len; ++i) {
                    intersect = this.containsPoint(geometry.components[i]);
                    if(intersect) {
                        break;
                    }
                }
            }
        } else {
            for(i=0, len=geometry.components.length; i<len; ++ i) {
                intersect = this.intersects(geometry.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        // check case where this poly is wholly contained by another
        if(!intersect && geometry.type == "Polygon") {
            // exterior ring points will be contained in the other geometry
            var ring = this.components[0];
            for(i=0, len=ring.components.length; i<len; ++i) {
                intersect = geometry.containsPoint(ring.components[i]);
                if(intersect) {
                    break;
                }
            }
        }
        return intersect;
    },
    /**
     * 获取到polygon最近的点
     * @method distanceTo
     * @param {Geometry}geometry
     * @param {Object}options
     * @returns {*}
     */
    distanceTo: function (geometry, options) {
        var edge = !(options && options.edge === false);
        var result;
        // this is the case where we might not be looking for distance to edge
        if(!edge && this.intersects(geometry)) {
            result = 0;
        } else {
            result = fastmap.mapApi.Collection.prototype.distanceTo.apply(
                this, [geometry, options]
            );
        }
        return result;
    },
    /**
     * 复制完整的Polygon
     * @method Polygon
     * @returns {.mapApi.Polygon}
     */
    clone: function () {
        var polygon = new fastmap.mapApi.Polygon(null);
        return polygon;
    },
    /**
     * 获取多少为小数
     * @param num
     * @param sig
     * @returns {number}
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    }
});
fastmap.mapApi.polygon=function(components,options) {
    return new fastmap.mapApi.Polygon(components, options);
};
;/**
 * Created by liwanchong on 2015/9/8.
 * LinearRing对象
 * @namespace fast.mapApi
 * @class LinearRing
 */
fastmap.mapApi.LinearRing = fastmap.mapApi.LineString.extend({
    options: {},
    components: [],

    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "LinearRing",

    /**
     * 构造函数
     * @class LinearRing
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}components
     * @param {Object}options
     */
    initialize: function (components, options) {
        this.components = components;
        this.options = options;
    },
    /**
     *  在geometry中添加点
     *  @method addComponent
     * @param point
     * @param index
     * @returns {boolean}
     */
    addComponent: function (point, index) {
        var added = false;

        //remove last point
        var lastPoint = this.components.pop();

        // given an index, add the point
        // without an index only add non-duplicate points
        if (index != null || !point.equals(lastPoint)) {
            added = fastmap.mapApi.Collection.prototype.addComponent.apply(this,
                arguments);
        }

        //append copy of first point
        var firstPoint = this.components[0];
        fastmap.mapApi.Collection.prototype.addComponent.apply(this,
            [firstPoint]);

        return added;
    },
    /**
     * 删除geometry中的点
     * @method removeComponent
     * @param point
     * @returns {Array}
     */
    removeComponent: function (point) {
        var removed = this.components && (this.components.length > 3);
        if (removed) {
            //remove last point
            this.components.pop();

            //remove our point
            fastmap.mapApi.Collection.prototype.removeComponent.apply(this,
                arguments);
            //append copy of first point
            var firstPoint = this.components[0];
            fastmap.mapApi.Collection.prototype.addComponent.apply(this,
                [firstPoint]);
        }
        return removed;
    },
    /**
     * 根据x,y的值移动geometry
     * @method move
     * @param x
     * @param y
     */
    move: function (x, y) {
        for (var i = 0, len = this.components.length; i < len - 1; i++) {
            this.components[i].move(x, y);
        }
    },

    rotate: function (angle, origin) {
        for (var i = 0, len = this.components.length; i < len - 1; ++i) {
            this.components[i].rotate(angle, origin);
        }
    },
    /**
     * 调整geometry的大小
     * @method resize
     * @param scale
     * @param origin
     * @param ratio
     * @returns {fastmap.mapApi.LinearRing}
     */
    resize: function (scale, origin, ratio) {
        for (var i = 0, len = this.components.length; i < len - 1; ++i) {
            this.components[i].resize(scale, origin, ratio);
        }
        return this;
    },

    transform: function (source, dest) {
        if (source && dest) {
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var component = this.components[i];
                component.transform(source, dest);
            }
            this.bounds = null;
        }
        return this;
    },

    /**
     * 获取中心点坐标
     * @method getCentroid
     */
    getCentroid: function () {
        if (this.components) {
            var len = this.components.length;
            if (len > 0 && len <= 2) {
                return this.components[0].clone();
            } else if (len > 2) {
                var sumX = 0.0;
                var sumY = 0.0;
                var x0 = this.components[0].x;
                var y0 = this.components[0].y;
                var area = -1 * this.getArea();
                if (area != 0) {
                    for (var i = 0; i < len - 1; i++) {
                        var b = this.components[i];
                        var c = this.components[i + 1];
                        sumX += (b.x + c.x - 2 * x0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                        sumY += (b.y + c.y - 2 * y0) * ((b.x - x0) * (c.y - y0) - (c.x - x0) * (b.y - y0));
                    }
                    var x = x0 + sumX / (6 * area);
                    var y = y0 + sumY / (6 * area);
                } else {
                    for (var i = 0; i < len - 1; i++) {
                        sumX += this.components[i].x;
                        sumY += this.components[i].y;
                    }
                    var x = sumX / (len - 1);
                    var y = sumY / (len - 1);
                }
                return new OpenLayers.Geometry.Point(x, y);
            } else {
                return null;
            }
        }
    },
    /**
     * geometry面积
     * @method getArea
     * @returns {number}
     */
    getArea: function () {
        var area = 0.0;
        if (this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i = 0, len = this.components.length; i < len - 1; i++) {
                var b = this.components[i];
                var c = this.components[i + 1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = -sum / 2.0;
        }
        return area;
    },
    /**
     * 获取geometry 周长
     * @method getGeodesicLength
     * @param projection
     * @returns {number}
     */
    getGeodesicLength: function (projection) {
        var length = 0.0;
        return length;
    },
    /**
     * 获取一份完整的LinearRing
     * @returns {fastmap.mapApi.LinearRing}
     */
    clone: function () {
        var linearRing = new fastmap.mapApi.LinearRing(null);
        return linearRing;
    },
    limitSigDigs: function (num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    /**
     * 是否包含某点
     * @method containsPoint
     * @param point
     * @returns {boolean}
     */
    containsPoint: function (point) {
        var digs = 14;
        var px = this.limitSigDigs(point.x, digs);
        var py = this.limitSigDigs(point.y, digs);

        function getX(y, x1, y1, x2, y2) {
            return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2;
        }

        var numSeg = this.components.length - 1;
        var start, end, x1, y1, x2, y2, cx, cy;
        var crosses = 0;
        for (var i = 0; i < numSeg; ++i) {
            start = this.components[i];
            x1 = this.limitSigDigs(start.x?start.x:start[0], digs);
            y1 = this.limitSigDigs(start.y?start.y:start[1], digs);
            end = this.components[i + 1];
            x2 = this.limitSigDigs(end.x?end.x:end[0], digs);
            y2 = this.limitSigDigs(end.y?end.y:end[1], digs);

            /**
             * The following conditions enforce five edge-crossing rules:
             *    1. points coincident with edges are considered contained;
             *    2. an upward edge includes its starting endpoint, and
             *    excludes its final endpoint;
             *    3. a downward edge excludes its starting endpoint, and
             *    includes its final endpoint;
             *    4. horizontal edges are excluded; and
             *    5. the edge-ray intersection point must be strictly right
             *    of the point P.
             */
            if (y1 == y2) {
                // horizontal edge
                if (py == y1) {
                    // point on horizontal line
                    if (x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
                        x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
                        // point on edge
                        crosses = -1;
                        break;
                    }
                }
                // ignore other horizontal edges
                continue;
            }
            cx = this.limitSigDigs(getX(py, x1, y1, x2, y2), digs);
            if (cx == px) {
                // point on line
                if (y1 < y2 && (py >= y1 && py <= y2) || // upward
                    y1 > y2 && (py <= y1 && py >= y2)) { // downward
                    // point on edge
                    crosses = -1;
                    break;
                }
            }
            if (cx <= px) {
                // no crossing to the right
                continue;
            }
            if (x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                // no crossing
                continue;
            }
            if (y1 < y2 && (py >= y1 && py < y2) || // upward
                y1 > y2 && (py < y1 && py >= y2)) { // downward
                ++crosses;
            }
        }
        var contained = (crosses == -1) ?
            // on edge
            1 :
            // even (out) or odd (in)
            !!(crosses & 1);

        return contained;
    },
    /**
     * 相交
     * @method intersects
     * @param geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            intersect = this.containsPoint(geometry);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            intersect = geometry.intersects(this);
        } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
            intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(
                this, [geometry]
            );
        } else {
            // check for component intersections
            for (var i = 0, len = geometry.components.length; i < len; ++i) {
                intersect = geometry.components[i].intersects(this);
                if (intersect) {
                    break;
                }
            }
        }
        return intersect;
    },
    /**
     * 是否获取geometry的坐标串
     * @method getVertices
     * @param nodes
     */
    getVertices: function (nodes) {
        return (nodes === true) ? [] : this.components.slice(0, this.components.length - 1);
    }
})
fastmap.mapApi.linearRing = function (coordiates, options) {
    return new fastmap.mapApi.LinearRing(coordiates, options);
};

;/**
 * Created by wangtun on 2015/9/10.
 */
fastmap.mapApi.MultiPolygon = fastmap.mapApi.Collection.extend({
    options: {},
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "MultiPolygon",
    /**
     * 构造函数
     * @class MultiPolygon
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}coordinates
     * @param {Object}options
     */
    initialize: function (coordinates, options) {
        this.coordinates = coordinates;
        this.options = options;
    },
    /**
     *添加polygon到MultiPolygon
     * @method appendPolygon
     * @param {Polygon}polygon
     */
    appendPolygon: function (polygon) {
    },
    /**
     * 复制一个完全的MultiPolygon
     * @method clone
     * @returns {.mapApi.MultiPolygon}
     */
    clone: function () {
        var polygons = new fastmap.mapApi.MultiPolygon(null);
        return polygons;
    },
    /**
     * 获取最近的点
     * @method closestPointXY
     * @param {Number}x
     * @param {Number}y
     * @param {Point}closestPoint
     * @param {Number}minSquaredDistance
     */
    closestPointXY: function (x, y, closestPoint, minSquaredDistance) {

    },
    /**
     * 是否包含x,y点
     * @method containsXY
     * @param {Number}x
     * @param {Number}y
     */
    containsXY: function (x, y) {

    },
    /**
     * 获取MultiPolygon的面积
     * @method getArea
     */
    getArea: function () {

    },
    /**
     * MultiPolygon坐标组
     * @method getCoordinates
     */
    getCoordinates: function () {

    },
    /**
     * 获取MultiPolygon内环
     * @param {Number}squaredTolerance
     * @returns {.mapApi.MultiPolygon}
     */
    getSimplifiedGeometryInternal: function (squaredTolerance) {
        var simplifiedMultiPolygonString = new fastmap.mapApi.MultiPolygon(null);
        return simplifiedMultiPolygonString;
    },
    /**
     * 获取MultiPolygon中的polygon
     * @method getPolygon
     * @param {Number}index
     * @returns {L.Polygon}
     */
    getPolygon: function (index) {
        var polygon = new fastmap.mapApi.Polygon(null);
        return polygon;
    },
    /**
     * 获取MultiPolygon中的polygons
     * @method getPolygons
     * @returns {Array}
     */
    getPolygons: function () {
        var polygons = [];
        return polygons;
    },
    /**
     *相交
     * @method intersectsExtend
     * @param {Object}extend
     */
    intersectsExtent: function (extend) {

    }
});
fastmap.mapApi.multiPolygon=function(coordiates,options) {
    return new fastmap.mapApi.MultiPolygon(coordiates, options);
};
;/**
 * Created by wangtun on 2015/9/10.
 * MultiPolyline对象
 * @namespace fast.mapApi
 * @class MultiPolyline
 */
fastmap.mapApi.MultiPolyline = fastmap.mapApi.Collection.extend({
    /**
     * 几何类型
     * type
     * @property type
     * @type String
     */
    type: "MultiPolyline",
    /**
     * 构造函数
     * @class MultiPolyline
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}coordinates
     * @param {Object}options
     */
    initialize: function (coordinates, options) {
        this.coordinates = coordinates;
        this.options = options;
    },
    /**
     * 在MultiPolylineZ中怎加lineString
     * @method appendLineString
     * @param {LineString}lineString
     */
    appendLineString: function (lineString) {

    },
    /**
     * 获取一份完整的MultiPolyline
     * @method clone
     * @returns {L.MultiPolyline}
     */
    clone: function () {
        var lineStrings = new fastmap.mapApi.MultiPolyline(null);
        return lineStrings;
    },

    /**
     * 切分几何.
     * @method splitWith
     * @return {Array} 几何对象集合
     */
    split:function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, sourceLine, sourceLines, sourceSplit, targetSplit;
        var sourceParts = [];
        var targetParts = [geometry];
        for(var i=0, len=this.components.length; i<len; ++i) {
            sourceLine = this.components[i];
            sourceSplit = false;
            for(var j=0; j < targetParts.length; ++j) {
                splits = sourceLine.split(targetParts[j], options);
                if(splits) {
                    if(mutual) {
                        sourceLines = splits[0];
                        for(var k=0, klen=sourceLines.length; k<klen; ++k) {
                            if(k===0 && sourceParts.length) {
                                sourceParts[sourceParts.length-1].addComponent(
                                    sourceLines[k]
                                );
                            } else {
                                sourceParts.push(
                                    new fastmap.mapApi.multiPolyline([
                                        sourceLines[k]
                                    ])
                                );
                            }
                        }
                        sourceSplit = true;
                        splits = splits[1];
                    }
                    if(splits.length) {
                        // splice in new target parts
                        splits.unshift(j, 1);
                        Array.prototype.splice.apply(targetParts, splits);
                        break;
                    }
                }
            }
            if(!sourceSplit) {
                // source line was not hit
                if(sourceParts.length) {
                    // add line to existing multi
                    sourceParts[sourceParts.length-1].addComponent(
                        sourceLine.clone()
                    );
                } else {
                    // create a fresh multi
                    sourceParts = [
                        new fastmap.mapApi.multiPolyline(
                            sourceLine.clone()
                        )
                    ];
                }
            }
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * 切分几何.
     * @method splitWith
     * @return {Array} 几何对象集合
     */
    splitWith: function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, targetLine, sourceLines, sourceSplit, targetSplit, sourceParts, targetParts;
        if(geometry instanceof fastmap.mapApi.LineString) {
            targetParts = [];
            sourceParts = [geometry];
            for(var i=0, len=this.components.length; i<len; ++i) {
                targetSplit = false;
                targetLine = this.components[i];
                for(var j=0; j<sourceParts.length; ++j) {
                    splits = sourceParts[j].split(targetLine, options);
                    if(splits) {
                        if(mutual) {
                            sourceLines = splits[0];
                            if(sourceLines.length) {
                                // splice in new source parts
                                sourceLines.unshift(j, 1);
                                Array.prototype.splice.apply(sourceParts, sourceLines);
                                j += sourceLines.length - 2;
                            }
                            splits = splits[1];
                            if(splits.length === 0) {
                                splits = [targetLine.clone()];
                            }
                        }
                        for(var k=0, klen=splits.length; k<klen; ++k) {
                            if(k===0 && targetParts.length) {
                                targetParts[targetParts.length-1].addComponent(
                                    splits[k]
                                );
                            } else {
                                targetParts.push(
                                    new fastmap.mapApi.multiPolyline([
                                        splits[k]
                                    ])
                                );
                            }
                        }
                        targetSplit = true;
                    }
                }
                if(!targetSplit) {
                    // target component was not hit
                    if(targetParts.length) {
                        // add it to any existing multi-line
                        targetParts[targetParts.length-1].addComponent(
                            targetLine.clone()
                        );
                    } else {
                        // or start with a fresh multi-line
                        targetParts = [
                            new fastmap.mapApi.multiPolyline([
                                targetLine.clone()
                            ])
                        ];
                    }

                }
            }
        } else {
            results = geometry.split(this);
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
     * 获取坐标数组
     * @method getCoordinates
     */
    getCoordinates: function () {

    },
    /**
     * 获得MultiPolyline中的单个lineString
     * @method getLineString
     * @param {Number}index
     * @returns {fastmap.mapApi.LineString}
     */
    getLineString: function (index) {
        var lineString = new fastmap.mapApi.LineString(null);
        return lineString;
    },
    /**
     * 获得MultiPolyline中的全部lineString
     * @method getLineStrings
     * @returns {Array}
     */
    getLineStrings: function () {
        var lineStrings = [];
        return lineStrings;
    },
    /**
     * set lineStrings
     * @method setLineString
     * @param {Array}lineStrings
     */
    setLineStrings: function (lineStrings) {

    },
    /**
     * 获取最近的点
     * @method closestPointXY
     */
    closestPointXY: function () {

    },
    /**
     * 是否相交
     * @method intersectsExtend
     * @param {object}extend
     */
    intersectsExtent: function (extend) {

    },
    /**
     * 获取MultiPolyline内环
     * @param {Number}squaredTolerance
     * @returns {L.MultiPolyline}
     */
    getSimplifiedGeometryInternal: function (squaredTolerance) {
        var simplifiedFlatCoordinates = [];
        var simplifiedMultiLineString = new fastmap.mapApi.MultiPolyline(null);
        return simplifiedMultiLineString;
    }
});
fastmap.mapApi.multiPolyline=function(coordiates,options) {
    return new fastmap.mapApi.MultiPolyline(coordiates, options);
};
;/**
 * Bounds类
 * 用于表示包围框
 *
 * @namespace mapApi
 * @class Bounds
 */
fastmap.mapApi.Bounds = L.Class.extend({
    /**
     * @method initialize
     * 初始化构造函数
     *
     * @param {Number} left
     * @param {Number} bottom
     * @param {Number} right
     * @param {Number} top
     *
     * @return {fastmap.mapApi.Bounds} 返回拷贝对象
     */
    initialize: function (left, bottom, right, top) {
        if (left) {
            this.left = parseFloat(left);
        }
        if (bottom) {
            this.bottom = parseFloat(bottom);
        }
        if (right) {
            this.right = parseFloat(right);
        }
        if (top) {
            this.top = parseFloat(top);
        }
    },

    /**
     * @method clone
     * 深度拷贝当前bounds对象
     *
     * @return {fastmap.mapApi.Bounds} 返回拷贝对象
     */
    clone: function () {
        return new fastmap.mapApi.Bounds(this.left, this.bottom, this.right, this.top);
    },

    /**
     * @method equals
     * 判断两个bounds是否相等
     *
     * @param {fastmap.mapApi.Bounds} 用于比较的bounds
     * @return {Boolean} 如果两个bounds的上下左右相等，则两个bounds相等，否则不相等
     */
    equals: function (bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) &&
            (this.right == bounds.right) &&
            (this.top == bounds.top) &&
            (this.bottom == bounds.bottom));
        }
        return equals;
    }
});
fastmap.mapApi.bounds=function(options) {
    return new fastmap.mapApi.Bounds(options);
};
;fastmap.mapApi.Map = L.Map.extend({

    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,
    initialize: function (id, options) {
        L.Map.prototype.initialize.call(this, id, options);
        this.map = this;
        this.mapControl = new this._mapController(this);
        this.currentTool = null;

    },
    /**
     * 地图控件，主要包含操作地图的方法
     * @param {L.Map}map
     * @private
     */
    _mapController: function (map) {

        /***
         * 放大
         */
        this.zoomIn = function () {
            map.zoomIn()
        };

        /***
         * 缩小
         */
        this.zoomOut = function () {
            map.zoomOut()
        };

        /**
         * 平移
         * @param {L.Latlng}latlng
         */
        this.pan = function (latlng) {
            map.panTo(latlng);
        };
        this.pointSelect = function () {

        };

        this.boxSelect = function () {

        };

        this.snap = function () {

        };
    }


});
fastmap.mapApi.map = function (id, options) {
    return new fastmap.mapApi.Map(id, options);
};
;/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class mecator坐标转换类
 */
    fastmap.mapApi.MecatorTranform = function (){
        this.M_PI = Math.PI;
        this.originShift = 2 * this.M_PI * 6367447.5 / 2.0;    //原先为6378137，wt修改
        this.initialResolution = 2 * this.M_PI * 6367447.5 / 256;
    }
    /***
     * 计算当前地图分辨率
     * @param {number}zoom
     * @returns {number}
     */
    fastmap.mapApi.MecatorTranform.prototype.resolution = function(zoom){
        return this.initialResolution / Math.pow(2, zoom);
    }

    /**
     * 经纬度到mecator转换
     * @param {Number}lon
     * @param {Number}lat
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.lonLat2Mercator = function(lon,lat){
        var xy = [];
        var x = lon * this.originShift / 180;
        var y = Math.log(Math.tan((90 + lat) * this.M_PI / 360)) / (this.M_PI / 180);
        y = y * this.originShift / 180;
        xy.push(x);
        xy.push(y);
        return xy;
    }

    /***
     *
     * mercator到经纬度坐标转化
     * @param {number}mx
     * @param {number}my
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.mer2lonlat = function(mx, my) {
        var lonlat = [];

        lonlat.push((mx / this.originShift) * 180);

        lonlat.push((my / this.originShift) * 180);

        lonlat[1] = 180 / this.M_PI
        * (2 * Math.atan(Math.exp(lonlat[1] * this.M_PI / 180)) - this.M_PI / 2);

        return lonlat;
    }
    /***
     * mecator到像素坐标转换
     * @param {number}x
     * @param {number}y
     * @param {number}zoom
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.mercator2Pixel = function( x,  y,  zoom){
        var res = this.resolution(zoom);

        var px = (x + this.originShift) / res;

        var py = (-y + this.originShift) / res;
        var xy = [];
        xy.push(px);
        xy.push(py);
        return xy;
    }

    /***
     * mecator到qq地图像素坐标转换
     * @param {number}x
     * @param {number}y
     * @param {number}zoom
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.mercator2PixelQQ = function(x,  y,  zoom){
        var res = this.resolution(zoom);

        var px = (x + originShift) / res;

        var py = (y + originShift) / res;

        var  xy = [];

        xy.push(px);
        xy.push(py)

        return xy;
    }

    /***
     * 像素坐标到瓦片坐标转换
     * @param {number}x
     * @param {number}y
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.pixels2Tile = function(x,y){
        var tx = Math.ceil(x / 256) - 1;

        var ty =  Math.ceil(y / 256) - 1;


        var xy =[];
        xy.push(tx);
        xy.push(ty);

        return xy;
    }

    /***
     * mecator到瓦片坐标转换
     * @param {number}x
     * @param {number}y
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.mercator2Tile = function(x, y, zoom){
        var merXY =[];
        merXY = this.mercator2Pixel(x, y, zoom);

        var xy = [];
        xy = this.pixels2Tile(merXY[0], merXY[1]);

        return xy;
    }

    /***
     * 经纬度到瓦片坐标转换
     * @param {number}x
     * @param {number}y
     * @returns {Array}
     */
    fastmap.mapApi.MecatorTranform.prototype.lonlat2Tile = function(lon, lat, zoom){
        var xy =[];
        xy = this.lonLat2Mercator(lon, lat);

        xy = this.mercator2Pixel(xy[0], xy[1], zoom);

        var res = this.pixels2Tile(xy[0], xy[1]);

        return res;
    }
/***
 * 经纬度到像素坐标转换
 * @param {number}x
 * @param {number}y
 * @returns {Array}
 */
fastmap.mapApi.MecatorTranform.prototype.lonlat2Pixel = function (lon, lat, zoom) {
    var xy = [];
    xy = this.lonLat2Mercator(lon, lat);

    xy = this.mercator2Pixel(xy[0], xy[1], zoom);
    return xy;
};

fastmap.mapApi.MecatorTranform.prototype.PixelToLonlat = function (pixelX, pixelY, zoom) {

    var x = 360 * ((pixelX / ( 256 << zoom)) - 0.5);
    var y = 0.5 - (pixelY / (256 << zoom));
    y = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;

    return [x, y];
};
;/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class Tile
 */
    fastmap.mapApi.Tile = L.Class.extend({

        options: {
        },

        /***
         *
         * @param {String}url 初始化url
         * @param {Object}options 可选参数
         */
        initialize: function (url,options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.url = url;
            this.data = {};
            this.xmlhttprequest = {};
        },

        /***
         * 获得当前tile的url
         * @returns {tileJson.url}
         */
        getUrl:function(){
            return this.url;
        },

        /***
         * 获得tile的data
         * @returns {*}
         */
        getData:function(){
            return this.data;
        },

        /***
         * 设置tile的data
         * @param {Object}data
         */
        setData:function(data){
            this.data = data;
        },

        /***
         * 获得tile的httmxmlrequest对象
         * @returns {{}|*}
         */
        getRequest:function(){
            return this.xmlhttprequest;
        }
        ,

        /***
         * 设置tile的httmxmlrequest对象
         * @param {XMLHttpRequest}xmlhttprequest
         */
        setRequest:function(xmlhttprequest){

            this.xmlhttprequest =xmlhttprequest;
        }
    });

/***
 * 初始化tile
 * @param {String}url  初始化url
 * @param {Object}options 可选参数
 * @returns {.mapApi.Tile}
 */
fastmap.mapApi.tile = function (url, options) {
    return new fastmap.mapApi.Tile(url, options)
};
;/**
 * Created by wangtun on 2016/4/21.
 */
fastmap.mapApi.ShapeOptionType={
    /*
       画线操作
     */
    'DRAWPATH': "drawPath",
    /*
      画AdLink操作
     */
    'DRAWADLINK': "drawAdLink",
    /*
      画面操作
     */
    'DRAWPOLYGON': "drawPolygon",
    /*
     拷贝线操作
     */
    'PATHCOPY': "pathcopy",
    /*
     剪切线操作
     */
    'PATHCUT': "pathcut",
    /*
     插入线形状点操作
     */
    'PATHVERTEXINSERT': "pathVertexInsert",
    /*
      线节点移动操作
     */
    'PATHVERTEXMOVE': "pathVertexMove",
    /*
      线节点删除操作
     */
    'PATHVERTEXREMOVE': "pathVertexReMove",
    /*
      添加线节点操作
     */
    'PATHVERTEXADD': "pathVertexAdd",
    /*
      打断线操作
     */
    'PATHBREAK': "pathBreak",
    /*
     改变道路方向操作
     */
    'TRANSFORMDIRECT':"transformDirect",
    /*
      线端点移动操作
     */
    'PATHNODEMOVE':"pathNodeMove",
    /*
      添加端点操作
     */
    'POINTVERTEXADD':"pointVertexAdd",
    /*
    移动行政区划代表点
     */
    'ADADMINMOVE':"adAdminMove"

};/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class Ilayer接口
 */
    fastmap.mapApi.Layer =  L.Class.extend({
        /***
         *
         * @param {Object}options
         * isVisiable图层是否可见，默认为false
         * isSelectable吐槽呢过是否可选择，默认为false
         */
        initialize: function (options) {
            this.options = options || {};
            this.isVisiable = options.isVisiable ? true : false;
            this.isSelectable = options.isSelectable ? true : false;
        },

        /***
         * 图层加入到地图时调用
         * onAdd所有继承Ilayer接口的类需要重写该方法
         * @param {L.Map}map
         */
        onAdd: function (map) {
            this._map = map;
            //map.addLayer(this)
        },

        /***
         * 图层被移除时调用
         * onRemove所有继承Ilayer接口的类需要重写该方法
         * @param {L.Map}map
         */
        onRemove: function (map) {
            //map.removeLayer(this);
            this._map = null;

        }

});
fastmap.mapApi.layer= function (options) {
    return new fastmap.mapApi.Layer(options);
};;/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class WholeLayer 整福地图图层由一个canvas组成
 */
fastmap.mapApi.WholeLayer = fastmap.mapApi.Layer.extend({

    /***
     *
     * @param options 初始化可选options
     */
    initialize: function (options) {
        this.options = options || {};
        fastmap.mapApi.Layer.prototype.initialize.call(this,options);
    },

    /***
     * 图层添加到地图时调用
     * @param map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.map, this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param map
     */
    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    /***
     * 初始化图层容器
     * @param options
     * @private
     */
    _initContainer: function (options) {
        this.options = options || {};
        var container = L.DomUtil.create('div', 'leaflet-canvas-container');
        container.style.position = 'absolute';
        container.style.width = this.map.getSize().x + "px";
        container.style.height = this.map.getSize().y + "px";

        this.canv = document.createElement("canvas");
        this._ctx = this.canv.getContext('2d');
        this.canv.width = this.map.getSize().x;
        this.canv.height = this.map.getSize().y;
        this.canv.style.width = this.canv.width + "px";
        this.canv.style.height = this.canv.height + "px";
        container.appendChild(this.canv);
        this._div = container;
        this.map.getPanes().tilePane.appendChild(this._div);

        this._div.style.zIndex = this.options.zIndex;
    },
    setZIndex:function(zIndex){
        this._div.style.zIndex = zIndex;

        return this;
    },
    bringToFront: function () {

        this._div.style.zIndex = 100;

        return this;
    },

    bringToBack: function () {

        this._div.style.zIndex = 0;

        return this;
    },

    _setAutoZIndex: function (pane, compare) {



        this.options.zIndex = this._div.style.zIndex = 100;
    },


    /***
     * 绘制图层内容
     */
    draw: function () {
    },

    /***
     * 重绘图层
     * @private
     */
    _redraw: function () {
        this._resetCanvasPosition();
    },

    /***
     * 清空图层
     */
    clear: function () {
    },

    /***
     * 重新调整图层位置
     * @private
     */
    _resetCanvasPosition: function () {
        var bounds = this.map.getBounds();
        var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);

    }

});
fastmap.mapApi.wholeLayer=function(options) {
    return new fastmap.mapApi.WholeLayer(options);
};
;/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class 1:25000图幅图层
 */
fastmap.mapApi.MeshLayer = fastmap.mapApi.WholeLayer.extend({
    /***
     * 初始化可选参数
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.url = url;
        this.options = options || {};
        fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 20;
    },
    /***
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function (map) {
        map.getPanes().tilePane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    /***
     * 根据bounds绘制图幅
     * @param {L.Bounds}bounds
     */
    draw: function (bounds) {
        var pointDL = bounds.getSouthWest();
        //右上角点
        var pointUR = bounds.getNorthEast();
        //var ret= this.CalculateMeshIds(pointDL.lng, pointUR.lng, pointDL.lat, pointUR.lat);
        var minPoint = this.Calculate25TMeshCorner(pointDL);
        var minLon = minPoint.lng;
        var minLat = minPoint.lat;
        this.gridArr = [];
        var labelArr = [];
        while (minLon <= pointUR.lng) {
            var gridObj = this.createGrid(minLon, minLon + 0.125, minLat, pointUR.lat);
            this.gridArr = this.gridArr.concat(gridObj);
            minLon += 0.125;
        }

        for (var i = 0, len = this.gridArr.length; i < len; i++) {
            var latlngbounds = this.gridArr[i].getBounds();
            var bound = L.bounds(this.map.latLngToContainerPoint(latlngbounds.getNorthWest()), this.map.latLngToContainerPoint(latlngbounds.getSouthEast()));
            var size = bound.getSize();
            this.drawRect(this._ctx, this.gridArr[i].options.meshid, {
                x: bound.min.x,
                y: bound.min.y,
                width: size.x,
                height: size.y
            });
        }
    },

    /***
     * 绘制图幅
     * @param {Object}context canvas context
     * @param meshId 图幅id
     * @param options 可选参数
     */
    drawRect: function (context, meshId, options) {
        context.strokeStyle = '#B3ADE9'//边框颜色
        context.font = "30px Verdana";
        //context.fillText(meshId, options.x, options.y);
        context.strokeStyle = '#00ff00'//边框颜色

        context.linewidth = 3;  //边框宽
        context.strokeRect(options.x, options.y, options.width, options.height);  //填充边框 x y坐标 宽 高
        context.stroke()

    },

    /***
     * 重绘
     * @returns {fastmap.mapApi.MeshLayer}
     * @private
     */
    _redraw: function () {
        this._resetCanvasPosition();
        this.clear();

        if (this.map.getZoom() >= this.minShowZoom && this.map.getZoom() <= this.maxShowZoom) {
            this.draw(this.map.getBounds())
        }
        return this;
    },

    /***
     * 生成图幅格网
     * @param {number}minLon 最小经度
     * @param {number}maxLon 最大经度
     * @param {number}origin 原点
     * @param {number}destination 最大经度
     * @returns {Array}
     */
    createGrid: function (minLon, maxLon, origin, destination) {
        //保存生成的网格
        var grid = [];
        var labels = []
        while (origin <= destination) {
            var components = [];
            components.push([origin, minLon]);
            components.push([origin + 0.083333333333333, minLon]);
            components.push([origin + 0.083333333333333, maxLon]);
            components.push([origin, maxLon]);
            var meshId = this.Calculate25TMeshId({
                lng: (minLon + maxLon) / 2,
                lat: (origin + origin + 0.083333333333333) / 2
            });
            var bound = this.Calculate25TMeshBorder(meshId);

            var b = L.latLngBounds([bound.minLat, bound.minLon], [bound.maxLat, bound.maxLon]);
            var polygon = L.rectangle(b, {meshid: meshId});
            grid.push(polygon);
            origin += 0.083333333333333;
        }

        return grid
    },

    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },

    /***
     * 重新调整图层位置
     * @private
     */
    _resetCanvasPosition: function () {
        var bounds = this.map.getBounds();
        var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    },

    /*
     *	根据纬度计算该点位于理想图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateIdealRowIndex: function (lat, remainder) {
        //相对区域纬度 = 绝对纬度 - 0.0
        var regionLatitude = lat - 0.0;

        //相对的以秒为单位的纬度
        var secondLatitude = regionLatitude * 3600;

        var longsecond;

        //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        if (secondLatitude * 1000 < 0) {
            longsecond = Math.ceil(secondLatitude * 1000);
        }
        else {
            longsecond = Math.floor(secondLatitude * 1000)
        }

        remainder = (longsecond % 300000);

        return {value: Math.floor(longsecond / 300000), reminder: remainder};
    },


    /*
     *	根据纬度计算该点位于实际图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateRealRowIndex: function (lat, remainder) {
        //理想行号
        var idealRow = this.CalculateIdealRowIndex(lat, remainder);


        switch (idealRow % 3)//三个一组的余数
        {
            case 0: //第一行
            {
                if (300000 - idealRow.remainder <= 12) //余数距离上框小于0.012秒
                    idealRow.value++;
            }
                break;
            case 1: //第二行
                break;
            case 2: //第三行
            {
                if (idealRow.remainder < 12) //余数距离下框小于等于0.012秒
                    idealRow.value--;
            }
                break;
        }

        return idealRow;
    },

    /*
     *	根据经度计算该点位于实际图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     */

    CalculateRealColumnIndex: function (lon, remainder) {
        return this.CalculateIdealColumnIndex(lon, remainder);
    },

    /*
     * 根据经度计算该点位于理想图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     *  @param{number}reminder           余数 单位“千秒”
     */

    CalculateIdealColumnIndex: function (lon, remainder) {
        //相对区域经度 = 绝对经度 - 60.0
        var regionLongitude = lon - 60.0;

        //相对的以秒为单位的经度
        var secondLongitude = regionLongitude * 3600;

        //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        var longsecond = Math.floor(secondLongitude * 1000);

        remainder = Math.floor(longsecond % 450000);

        return {value: Math.floor(longsecond / 450000), reminder: remainder};
    },

    MeshLocator_25T: function (lon, lat) {
        if (0x01 == (this.IsAt25TMeshBorder(lon, lat) & 0x0F)) //为了保证它总返回右上的图幅
            lat += 0.00001;


        var remainder = 0;

        var rowResult = this.CalculateRealRowIndex(lat, remainder);

        var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);

        //第1、2位 : 纬度取整拉伸1.5倍
        var M1M2 = Math.floor(lat * 1.5);

        //第3、4位 : 经度减去日本角点 60度
        var M3M4 = Math.floor(lon) - 60;

        //第5位 :
        var M5 = rowResult.value % 8;

        //第6位 : 每列450秒，每度包含8列
        var M6 = colResult.value % 8;

        //连接以上数字,组成图幅号
        var sMeshId = "" + M1M2 + M3M4 + M5 + M6;

        while (sMeshId.length < 6) {
            sMeshId = "0" + sMeshId;
        }

        return sMeshId;
    },

    /*
     *  点所在的图幅号,如果点在图幅边界上,返回右上的图幅号
     *
     *  @param {L.Latlng}point   经纬度点
     */
    Calculate25TMeshId: function (point) {
        var mesh = this.MeshLocator_25T(point.lng, point.lat);

        return mesh;
    },

    /*
     *	快速计算点所在的图幅左下角点
     *
     *  @param{L.Latlng}point          经纬度点
     */
    Calculate25TMeshCorner: function (point) {
        return this.Calculate25TMeshCornerByMeshId(this.Calculate25TMeshId(point));
    },

    /***
     * 计算图幅角点坐标
     * @param {String}mesh
     * @returns {*}
     * @constructor
     */
    Calculate25TMeshCornerByMeshId: function (mesh) {
        var cc = mesh.split("");

        var M1 = parseInt(cc[0]);
        var M2 = parseInt(cc[1]);
        var M3 = parseInt(cc[2]);
        var M4 = parseInt(cc[3]);
        var M5 = parseInt(cc[4]);
        var M6 = parseInt(cc[5]);

        var x = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        var y = (M1 * 10 + M2) * 2400 + M5 * 300;

        var point = L.latLng(y / 3600.0, x / 3600.0);

        return point;
    },

    /***
     *  计算图幅border
     * @param {String}mesh
     * @returns {{minLon: (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng), minLat: (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat), maxLon: (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng), maxLat: (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat)}}
     * @constructor
     */
    Calculate25TMeshBorder: function (mesh) {
        var cc = mesh.split("");

        var M1 = parseInt(cc[0]);
        var M2 = parseInt(cc[1]);
        var M3 = parseInt(cc[2]);
        var M4 = parseInt(cc[3]);
        var M5 = parseInt(cc[4]);
        var M6 = parseInt(cc[5]);

        var x_conner = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        var y_conner = (M1 * 10 + M2) * 2400 + M5 * 300;

        var x_upper = x_conner + 450.0;
        var y_upper = y_conner + 300.0;


        var leftBottom = L.latLng(y_conner / 3600.0, x_conner / 3600.0);

        var rightTop = L.latLng(y_upper / 3600.0, x_upper / 3600.0);

        return {minLon: leftBottom.lng, minLat: leftBottom.lat, maxLon: rightTop.lng, maxLat: rightTop.lat};
    },
    /*
     * 	点是否在图框上
     *
     *  @param{number}lon               经度
     *  @param{number}lat               纬度
     */

    IsAt25TMeshBorder: function (lon, lat) {
        var model = 0;

        var remainder = 0;
        var rowResult = this.CalculateIdealRowIndex(lat, remainder);
        switch (rowResult.value % 3) {
            case 0: //第一行
            {
                if (300000 - rowResult.remainder == 12) //余数距离上框等于0.012秒
                    model |= 0x01;
                else if (rowResult.remainder == 0)
                    model |= 0x01;
            }
                break;
            case 1: //第二行由于上下边框均不在其内，因此不在图框上
                break;
            case 2: //第三行
            {
                if (rowResult.remainder == 12) //余数距离下框等于0.012秒
                    model |= 0x01;
            }
                break;
        }

        var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);

        if (0 == colResult.remainder)
            model |= 0x10;

        return model;
    }

});
fastmap.mapApi.meshLayer=function(url, options) {
    return new fastmap.mapApi.MeshLayer(url, options);
};
;/**
 * Created by zhongxiaoming on 2016/3/23.
 * Class fastmap.mapApi.LayerRender
 */
fastmap.mapApi.LayerRender = {


    /***
     * 绘制点
     * @param ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param geom 点对象
     * @param style 样式
     * @param boolPixelCrs 是否是像素坐标
     * @private
     */
    _drawPoint: function (ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, geom);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.beginPath();
        g.fillStyle = style.color;
        g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
        g.closePath();
        g.fill();
        g.restore();
    },  /***
     * 绘制空心圆
     * @param ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param geom 点对象
     * @param style 样式
     * @param boolPixelCrs 是否是像素坐标
     * @private
     */
    _drawCircle: function (ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, geom);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.beginPath();
        g.fillStyle = style.color;
        g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
        g.stroke();//画空心圆
        g.closePath();
    },


    /***
     *
     * @param options
     * @param geo几何对象
     * @param boolPixelCrs是否以像素坐标绘制
     * @param ctx 绘制上下文
     * @param rotate旋转角度
     * @param scaley 缩放比例
     * @param drawx 绘制时x方向平移
     * @param drawy 绘制时y方向平移
     * @param fillStyle边框填充样式
     * @private
     */
    _drawImg: function (options) {

            var p = null;
            var style = options.style;
            if (options.boolPixelCrs) {
                p = {x: options.geo[0], y: options.geo[1]}
            } else {
                p = this._tilePoint(options.ctx, options.geom);
            }

            var c = options.ctx.canvas;

            var g = c.getContext('2d');

            var image = new Image();

            var rotate = options.rotate;

            image.src = style.src;
            image.onload = function () {
                var scalex = options.scalex ? options.scalex : 1;
                var scaley = options.scaley ? options.scaley : 1;
                var drawx = options.drawx ? options.drawx : -image.width * scalex / 2;
                var drawy = options.drawy ? options.drawy : -image.height * scalex / 2;
                //var drawx = -options.c * image.width/2;
                //var drawy = 0
                g.save();
                g.translate(p.x, p.y);
                if (options.fillStyle) {
                    g.strokeStyle = options.fillStyle.lineColor;  //边框颜色
                    g.fillStyle = options.fillStyle.fillColor;
                    g.linewidth = options.fillStyle.lineWidth;  //边框宽
                    g.fillRect(drawx + options.fillStyle.dx, drawy + options.fillStyle.dy, options.fillStyle.width, options.fillStyle.height);  //填充颜色 x y坐标 宽 高
                    g.strokeRect(drawx + options.fillStyle.dx, drawy + options.fillStyle.dy, options.fillStyle.width, options.fillStyle.height);  //填充边框 x y坐标 宽 高
                }

                if (rotate) {
                    g.rotate(rotate);//旋转度数
                }

                g.drawImage(image, drawx, drawy, image.width * scalex, image.height * scaley);
                g.restore();
            }

    },

    _drawBackground: function (options) {

        var p = null;
        if (options.boolPixelCrs) {
            p = {x: options.geo[0], y: options.geo[1]}
        } else {
            p = this._tilePoint(options.ctx, options.geom);
        }

        var c = options.ctx.canvas;

        var g = c.getContext('2d');
        var rotate = options.rotate;
        var scalex = options.scalex ? options.scalex : 1;
        var scaley = options.scaley ? options.scaley : 1;
        var drawx = options.drawx;
        var drawy = options.drawy;
        g.save();
        g.translate(p.x, p.y);
        if (rotate) {
            g.rotate(rotate);//旋转度数
        }

        g.strokeStyle = options.lineColor;  //边框颜色
        g.fillStyle = options.fillColor;
        g.linewidth = options.lineWidth;  //边框宽
        g.fillRect(drawx, drawy, options.width, options.height);  //填充颜色 x y坐标 宽 高
        g.strokeRect(drawx, drawy, options.width, options.height);  //填充边框 x y坐标 宽 高


        g.restore();

    },

    _drawLinkNameText: function (ctx, geom, name) {
        var startLen = geom.concat().length;

        geom = this._clip(ctx, geom);
        var endLen = geom.length;
        if(startLen!==endLen) {
            console.log("开始的长度为: "+startLen+"处理后的长度:"+endLen);
        }

        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = "10px Courier New";
        g.textAlign = "center";
        var angle,
            nameArr = name.split(""),
            nameLen = name.length * 10, lineLen = 0;
        if (geom.length === 2) {
            angle = this._rotateAngle(geom[0], geom[1]);
            lineLen = this.distance(geom[0], geom[1]);
            if (nameLen < lineLen / 2 && lineLen > 160) {
                this._showTextOfAngle(ctx, 0, name, angle,
                    [(geom[0][0] + geom[1][0]) / 2, (geom[0][1] + geom[1][1]) / 2]);
            }

        } else {
            var startPoint = geom[0], startPointForLen = geom[0],
                endPoint = geom[geom.length - 1],
                textLength = 0, startText = 0, textIndex = 0,
                betPointsLen, realLineLen = 0, linkArrLen = geom.length;
            for (var m = 1; m < linkArrLen; m++) {
                betPointsLen = this.distance(geom[m], startPointForLen);
                realLineLen += betPointsLen;
                startPointForLen = geom[m];
            }
            if (nameLen < realLineLen / 2 && realLineLen > 50) {
                startPoint = geom[2]
                for (var linkFLag = 1; linkFLag < linkArrLen; linkFLag++) {
                    if (textLength < nameArr.length) {
                        betPointsLen = this.distance(geom[linkFLag], startPoint);
                        angle = this._rotateAngle(startPoint, geom[linkFLag]);
                        if (betPointsLen > 10) {
                            textIndex = parseInt(betPointsLen / 10);
                            this._showTextOfAngle(ctx, 0, name, angle, startPoint);
                            break;
                        } else {
                            startPoint = geom[linkFLag];
                        }

                    }

                }
            }
        }
    },

    _drawBridge: function (cav, geom, that) {
        var c = cav.canvas;
        var ctx = c.getContext('2d');
        var oriStart, oriEnd;
        oriStart = geom[0][0];
        for (var i = 1, len = geom.length; i < len; i++) {
            oriEnd = geom[i][0];
            var angle = that._rotateAngle(oriStart, oriEnd),
                points = [];
            points = that._pointsFromAngle([oriStart, oriEnd], angle);
            that._drawObliqueLine(ctx, points, angle);
            oriStart = geom[i][0];
        }

    },
    _drawObliqueLine: function (ctx, points, angle) {
        var len = Math.floor(this.distance(points[0], points[1]) / 20);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        ctx.save();
        ctx.translate(points[0][0], points[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < len; i++) {
            ctx.moveTo(i * 20, 0);
            ctx.lineTo(i * 20, -6);
        }
        //最后一个点
        ctx.moveTo(points[1][0] - points[0][0], 0);
        ctx.lineTo(points[1][0] - points[0][0], -6);
        ctx.stroke();
        ctx.restore();

    },
    /**
     * 字体的旋转角度
     * @param startPoint
     * @param endPoint
     * @returns {*}
     * @private
     */
    _rotateAngle: function (startPoint, endPoint) {
        var angle;
        if ((startPoint[0] - endPoint[0]) === 0) {
            angle = Math.PI / 2;
        } else {
            if ((startPoint[1] - endPoint[1]) === 0) {
                angle = 0;
            } else {
                angle = Math.atan((startPoint[1] - endPoint[1]) / (startPoint[0] - endPoint[0]));

            }
        }
        return angle;


    },
    _showTextOfAngle: function (ctx, start, name, angle, textGeom, font, align) {

        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = font ? font : "10px Courier New";
        g.textAlign = align ? align : "center";

        var nameArr = name.split(""), PI = Math.PI, end = nameArr.length;
        if (angle === 0) {
            g.fillText(name, textGeom[0], textGeom[1]);
            g.save();
        } else if ((angle < PI && angle > 2 * (PI / 5))) {
            for (var i = start; i < end; i++) {
                g.fillText(nameArr[i], textGeom[0], textGeom[1] + i * 13);
                g.save();
            }
        } else {

            var showName = name.substr(start, end);
            g.save();
            g.translate(textGeom[0], textGeom[1]);
            g.rotate(angle);
            g.fillText(showName, 0, 0);
            g.restore();

        }

    },
    //_drawConditionSpeedLimit: function (ctx, name, angle, textGeom, font, align) {
    _drawText: function (options) {
        var c = options.ctx.canvas;
        var g = c.getContext('2d');
        g.font = options.font ? options.font : "10px Courier New";
        g.textAlign = options.textAlign ? options.textAlign : "center";

        g.save();
        g.translate(options.geo[0], options.geo[1]);
        if(options.rotate){
            g.rotate(options.rotate);
        }
        //g.fillText(options.text, 0, 12 / 2);
        g.fillText(options.text, options.drawx, options.drawy);
        g.restore();

    },
    /***
     * _drawArrow绘制方向箭头
     * @param {Object}ctx
     * @param {Number}direct 绘制方向
     * @param {Array}data 点数组
     * @private
     */
    _drawArrow: function (ctx, direct, data) {
        var g = ctx.canvas.getContext('2d');
        g.linewidth = 2;
        g.strokeStyle = this.directColor;
        if (direct == 0 || direct == 1) {
            return;
        }

        for (var i = 0, len = data.length; i < len; i++) {
            for (var j = 0, len2 = data[i].length; j < len2 - 1; j = j + 2) {

                g.beginPath();
                g.translate(0, 0, 0);

                var point1 = data[i][j];
                var point2 = data[i][j + 1];
                var distance = this.distance(point1, point2);
                if (distance < 30) {
                    return;
                }

                g.save()
                var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);

                g.translate(centerPoint.x, centerPoint.y);
                //先计算向量与y轴负方向向量(0,-1)的夹角


                var ang = 0;
                if (point1.y - point2.y == 0) {
                    if (point1.x - point2.x > 0) {
                        ang = Math.PI / -2;
                    }
                    else {
                        ang = Math.PI / 2;
                    }
                }
                else {
                    ang = (point1.x - point2.x) / (point1.y - point2.y);
                    ang = Math.atan(ang);
                }
                if (point2.y - point1.y >= 0) {
                    if (direct == 2) {
                        g.rotate(-ang);
                    } else if (direct == 3) {
                        g.rotate(-ang + Math.PI);
                    }
                } else {
                    if (direct == 2) {
                        g.rotate(Math.PI - ang); //加个180度，反过来
                    } else if (direct == 3) {
                        g.rotate(-ang);
                    }

                }
                g.lineTo(-3, -6);
                g.lineTo(0, 1);
                g.lineTo(3, -6);
                g.lineTo(0, 0);
                g.stroke();
                g.fill(); //箭头是个封闭图形
                g.closePath();
                g.restore();   //恢复到堆的上一个状态，其实这里没什么用。
            }
        }
    },
    /**
     * 画区域内的道路
     * @param ctx
     * @param points
     * @param dashLength
     * @param that
     * @private
     */
    _drawDashLineOfAngle: function (ctx, points, dashLength, that) {
        var endPoint,
            startPoint = points[0][0];
        for (var i = 1, len = points.length; i < len; i++) {
            endPoint = points[i][0];
            var angle = that._rotateAngle(startPoint, endPoint);
            that._drawDashLine(ctx, [startPoint, endPoint], angle, dashLength, that);
            startPoint = points[i][0];

        }
    },
    /**
     * 画虚线
     * @param ctx
     * @param points
     * @param angle
     * @param dashLength
     * @param self
     * @private
     */
    _drawDashLine: function (ctx, points, angle, dashLength, self) {

        var pointsOfChange = self._pointsFromAngle(points, angle);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        var xPos = points[1][0] - points[0][0],
            yPos = points[1][1] - points[0][1];
        var dash = Math.floor(Math.sqrt(xPos * xPos + yPos * yPos) / dashLength);
        ctx.save();
        ctx.translate(pointsOfChange[0][0], pointsOfChange[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < dash; i++) {
            if (i % 2) {

                ctx.lineTo(dashLength * i, 0);
            } else {
                ctx.moveTo(dashLength * i, 0);
            }

        }
        ctx.stroke();
        ctx.restore();
    },
    /***
     * 绘制线
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 绘制几何对象
     * @param {Object}style 样式
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawLineString: function (ctx, geom, boolPixelCrs, linestyle, nodestyle, properties) {
        if (!linestyle) {
            return;
        }
        var proj = [],

        coords = this._clip(ctx, geom);

        for (var i = 0; i < coords.length; i++) {
            if (this._map.getZoom() >= this.showNodeLevel && (i == 0 || i == coords.length - 1)) {
                this._drawPoint(ctx, coords[i], nodestyle, true);
            }

            if (boolPixelCrs) {
                proj.push({x: coords[i][0], y: coords[i][1]});
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }

        }
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.strokeColor;
        g.lineWidth = linestyle.strokeWidth;
        g.beginPath();
        for (var j = 0; j < proj.length; j++) {
            var method = (j === 0 ? 'move' : 'line') + 'To';
            g[method](proj[j].x, proj[j].y);

        }
        g.stroke();
        g.restore();

    },

    /***
     * 绘制polygon
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 几何对象
     * @param {Object}style 样式
     * @private
     */
    _drawPolygon: function (ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }

        var coords = geom[0], proj = [], i;
        coords = this._clip(ctx, coords);

        for (var i = 0; i < coords.length; i++) {

            if (boolPixelCrs) {
                proj.push({x: coords[i][0], y: coords[i][1]});
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }

        }

        var g = ctx.canvas.getContext('2d');
        g.globalAlpha = style.fillOpacity;

        g.fillStyle = style.fillColor;
        if (style.strokeWidth>0) {
            g.strokeStyle = style.strokeColor;
            g.lineWidth = style.strokeWidth;
        }
        g.beginPath();
        for (i = 0; i < proj.length; i++) {
            var method = (i === 0 ? 'move' : 'line') + 'To';
            g[method](proj[i].x, proj[i].y);
        }
        g.closePath();
        g.fill();
        if (style.strokeWidth>0) {
            g.stroke();
        }

    }

    ,
    /**互联网rtic*/
    _drawrdrtic: function (ctx, geom, properties, boolPixelCrs) {
        var direct = null, stolecolor = null, reversecolor = null, coords = geom, proj = [], arrowlist = [];
        coords = this._clip(ctx, coords);
        for (var rtic = 0; rtic < coords.length; rtic++) {
            if (boolPixelCrs) {
                proj.push({x: coords[rtic][0][0], y: coords[rtic][0][1]});
            } else {
                proj.push(this._tilePoint(ctx, coords[rtic]));
            }
        }
        var g = ctx.canvas.getContext('2d');
        for (var rticj = 0; rticj < proj.length; rticj++) {
            var method = (rticj === 0 ? 'move' : 'line') + 'To';
            g[method](proj[rticj].x, proj[rticj].y);
            if (rticj < proj.length - 1) {
                var oneArrow = [proj[rticj], proj[rticj + 1]];
                arrowlist.push(oneArrow);
            }
        }
        if (properties.forwardLevel == 0) {
            stolecolor = "#808080";//灰色
        } else if (properties.forwardLevel == 1) {
            stolecolor = "#FF0000";//红色
        } else if (properties.forwardLevel == 2) {
            stolecolor = "#006400";//绿色
        } else if (properties.forwardLevel == 3) {
            stolecolor = "#00008B";//蓝色
        } else if (properties.forwardLevel == 4) {
            stolecolor = "#FF1493";//粉色
        }
        if (properties.reverseLevel == 0) {
            reversecolor = "#808080";//灰色
        } else if (properties.reverseLevel == 1) {
            reversecolor = "#FF0000";//红色
        } else if (properties.reverseLevel == 2) {
            reversecolor = "#006400";//绿色
        } else if (properties.reverseLevel == 3) {
            reversecolor = "#00008B";//蓝色
        } else if (properties.reverseLevel == 4) {
            reversecolor = "#FF1493";//粉色
        }
        if (properties.forwardLevel && properties.reverseLevel) {
            if (this._map.getZoom() >= this.showNodeLevel) {
                this._drawIntRticArrow(g, 2, arrowlist, stolecolor);
                this._drawIntRticArrow(g, 3, arrowlist, reversecolor);
                this._drawIntRticText(ctx, geom, properties.forwardInformation + "上", 2);
                this._drawIntRticText(ctx, geom, properties.reverseInformation + "下", 3);
            }
        } else {
            if (properties.forwardLevel) {
                direct = 2;//顺方向
            } else if (properties.reverseLevel) {
                direct = 3;//逆方向
            }

            if (direct == null || typeof(direct) == "undefined" || direct == "") {
            } else {
                if (this._map.getZoom() >= this.showNodeLevel) {
                    this._drawIntRticArrow(g, direct, arrowlist, (direct == 2 ? stolecolor : reversecolor));
                    if (direct === 2) {
                        this._drawIntRticText(ctx, geom, properties.forwardInformation + "上", 2);
                    }
                    if (direct === 3) {
                        this._drawIntRticText(ctx, geom, properties.reverseInformation + "下", 3);
                    }

                }
            }
        }
    },
    /***
     * _drawArrow绘制方向箭头
     * @param {Object}ctx
     * @param {Number}direct 绘制方向
     * @param {Array}data 点数组
     * * @param colors 点数组
     * @private
     */
    _drawIntRticArrow: function (ctx, direct, data, colors) {
        var ctx = ctx.canvas.getContext('2d');
        ctx.linewidth = 2;
        ctx.fillStyle = colors;
        if (direct == 0 || direct == 1) {
            return;
        }

        ctx.beginPath();
        var point1, point2;
        if (direct === 2) {
            point1 = data[data.length - 1][0];
            point2 = data[data.length - 1][1];
        } else if (direct === 3) {
            point1 = data[0][0];
            point2 = data[0][1];
        }
        var distance = this.distance(point1, point2);
        if (distance < 30) {
            return;
        }
        ctx.save();
        //var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
        if (direct == 2) {
            var centerPoint = L.point(point2.x, point2.y);
        } else {
            var centerPoint = L.point(point1.x, point1.y);
        }

        ctx.translate(centerPoint.x, centerPoint.y);
        //先计算向量与y轴负方向向量(0,-1)的夹角


        var ang = 0;
        if (point1.y - point2.y == 0) {
            if (point1.x - point2.x > 0) {
                ang = Math.PI / -2;
            }
            else {
                ang = Math.PI / 2;
            }
        }
        else {
            ang = (point1.x - point2.x) / (point1.y - point2.y);
            ang = Math.atan(ang);
        }
        if (point2.y - point1.y >= 0) {
            if (direct == 2) {
                ctx.rotate(-ang);
            } else if (direct == 3) {
                ctx.rotate(-ang + Math.PI);

            }
        } else {
            if (direct == 2) {
                ctx.rotate(Math.PI - ang); //加个180度，反过来
            } else if (direct == 3) {
                ctx.rotate(-ang);
            }
        }
        ctx.lineTo(-6, -9);
        ctx.lineTo(0, 1);
        ctx.lineTo(6, -9);
        ctx.stroke();
        ctx.fill(); //箭头是个封闭图形
        ctx.closePath();
        ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。


    },
    _drawIntRticText: function (ctx, geom, name, direct) {
        geom = this._clip(ctx, geom);
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = "10px Courier New";
        g.textAlign = "center";
        var angle,
            nameArr = name.split(""),
            nameLen = name.length * 10, lineLen = 0;
        if (geom.length === 2) {
            angle = this._rotateAngle(geom[0], geom[1]);
            lineLen = this.distance(geom[0], geom[1]);
            if (nameLen < lineLen / 2 && lineLen > 160) {
                this._showIntRticTextOfAngle(g, 0, nameArr.length, name, angle, [(geom[0][0] + geom[1][0]) / 2, (geom[0][1] + geom[1][1]) / 2], direct);
            }

        } else {
            var startPoint = geom[0], startPointForLen = geom[0], endPoint = geom[geom.length - 1],
                textLength = 0, startText = 0, textIndex = 0,
                betPointsLen, realLineLen = 0, linkArrLen = geom.length;
            for (var m = 1; m < linkArrLen; m++) {
                betPointsLen = this.distance(geom[m], startPointForLen);
                realLineLen += betPointsLen;
                startPointForLen = geom[m];
            }
            if (nameLen < realLineLen / 2 && realLineLen > 50) {
                startPoint = geom[1]
                for (var linkFLag = 1; linkFLag < linkArrLen; linkFLag++) {
                    if (textLength < nameArr.length) {
                        betPointsLen = this.distance(geom[linkFLag], startPoint);
                        angle = this._rotateAngle(startPoint, geom[linkFLag]);
                        if (betPointsLen > 10) {
                            textIndex = parseInt(betPointsLen / 10);
                            this._showIntRticTextOfAngle(g, 0, nameArr.length, name, angle, startPoint, direct);
                            break;
                        } else {
                            startPoint = geom[linkFLag];
                        }

                    }

                }
            }
        }
    },
    _showIntRticTextOfAngle: function (ctx, start, end, name, angle, textGeom, direct) {
        var nameArr = name.split(""), PI = Math.PI;
        if (angle === 0) {
            if (direct === 2) {
                ctx.fillText(name, textGeom[0], textGeom[1] - 10);
            } else {
                ctx.fillText(name, textGeom[0], textGeom[1] + 13);
            }
            ctx.save();
        } else if ((angle < PI && angle > 2 * (PI / 5))) {
            if (direct === 2) {
                for (var l = start; l < end; l++) {
                    ctx.fillText(nameArr[l], textGeom[0] - 8, textGeom[1] + l * 14);
                    ctx.save();
                }
            } else {
                for (var i = start; i < end; i++) {
                    ctx.fillText(nameArr[i], textGeom[0] + 8, textGeom[1] + i * 14);
                    ctx.save();
                }
            }

        } else {
            var showName = name.substr(start, end);
            ctx.save();
            if (direct === 2) {
                ctx.translate(textGeom[0], textGeom[1] - 10);
            } else {
                ctx.translate(textGeom[0], textGeom[1] + 13);
            }
            ctx.rotate(angle);
            ctx.fillText(showName, 0, 0);
            ctx.restore();

        }

    },
    /**
     *行政区划画点画线
     * @param ctx
     * @param geom
     * @param boolPixelCrs
     * @param linestyle
     * @param nodestyle
     * @param properties
     * @private
     */
    _drawAdLineString: function (ctx, geom, boolPixelCrs, linestyle, nodestyle, properties) {
        if (!linestyle) {
            return;
        }
        var coords = geom, proj = [],
            arrowlist = [];
        coords = this._clip(ctx, coords);

        for (var i = 0; i < coords.length; i++) {

            if (this._map.getZoom() >= this.showNodeLevel && (i == 0 || i == coords.length - 1)) {
                if(i==0){
                    this._drawCircle(ctx, coords[i][0], nodestyle, true);
                }else if(coords[0][0][0]!=coords[coords.length - 1][0][0]&&coords[0][0][1]!=coords[coords.length - 1][0][1]){
                    this._drawCircle(ctx, coords[coords.length - 1][0], nodestyle, true);
                }
            }

            if (boolPixelCrs) {
                proj.push({x: coords[i][0][0], y: coords[i][0][1]});
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }
        }
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.color;
        g.lineWidth = linestyle.size;
        g.beginPath();
        for (var j = 0; j < proj.length; j++) {
            var method = (j === 0 ? 'move' : 'line') + 'To';
            g[method](proj[j].x, proj[j].y);
        }
        g.stroke();
        g.restore();
    }
};/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class canvas瓦片图层
 */
fastmap.mapApi.TileJSON = L.TileLayer.Canvas.extend({
    options: {
        debug: true
    },
    includes: [L.Mixin.Events, fastmap.mapApi.LayerRender],
    tileSize: 256,

    /***
     *
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.options = this.options || {};
        L.Util.setOptions(this, options);
        this.url = url;
        this.style = this.options.style || "";
        this.type = this.options.type || "";
        this.editable = this.options.editable || "";
        this.requestType = this.options.requestType || "";
        this.gap = this.options.gap || 30;
        this.tiles = {};
        this.directColor = this.options.directColor || "#ff0000";
        this.mecator = this.options.mecator || "";
        this.showNodeLevel = this.options.showNodeLevel;
        this.clickFunction = this.options.clickFunction || null;
        this.eventController = fastmap.uikit.EventController();

        this.redrawTiles = [];
        this.drawTile = function (canvas, tilePoint, zoom) {
            var ctx = {
                canvas: canvas,
                tile: tilePoint,
                zoom: zoom
            };

            if (this.options.debug) {
                this._drawDebugInfo(ctx);
            }
            this._draw(ctx, this.options.boolPixelCrs, this.options.parse);
        };

    },
    /***
     * 根据瓦片id移除瓦片
     * @param {String}key
     * @private
     */
    _removeTile: function (key) {
        var tile = this._tiles[key];

        this.fire('tileunload', {tile: tile, url: tile.src});

        if (this.options.reuseTiles) {
            L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
            this._unusedTiles.push(tile);

        } else if (tile.parentNode === this._tileContainer) {
            this._tileContainer.removeChild(tile);
        }

        // for https://github.com/CloudMade/Leaflet/issues/137
        if (!L.Browser.android) {
            tile.onload = null;
            tile.src = L.Util.emptyImageUrl;
        }
        if (this.tiles[key] !== undefined) {
            this.tiles[key].xmlhttprequest.abort();
        }

        delete this.tiles[key];
        delete this._tiles[key];
    },

    /***
     * 重置图层
     * @param {Object}e
     * @private
     */
    _reset: function (e) {
        for (var key in this._tiles) {
            this.fire('tileunload', {tile: this._tiles[key]});
            if (this.tiles[key] !== undefined) {
                this.tiles[key].xmlhttprequest.abort();
            }

            delete this.tiles[key];
        }

        this._tiles = {};
        this._tilesToLoad = 0;

        if (this.options.reuseTiles) {
            this._unusedTiles = [];
        }

        this._tileContainer.innerHTML = '';

        if (this._animated && e && e.hard) {
            this._clearBgBuffer();
        }

        this._initContainer();
    },

    /***
     * 打印调试信息
     * @param {Object}ctx
     * @private
     */
    _drawDebugInfo: function (ctx) {
        var max = this.tileSize;
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = '#000000';
        g.fillStyle = '#FFFF00';
        g.strokeRect(0, 0, max, max);
        g.font = "12px Arial";
        g.fillRect(0, 0, 5, 5);
        g.fillRect(0, max - 5, 5, 5);
        g.fillRect(max - 5, 0, 5, 5);
        g.fillRect(max - 5, max - 5, 5, 5);
        g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
        g.strokeText(ctx.tile.x + ' ' + ctx.tile.y + ' ' + ctx.zoom, max / 2 - 30, max / 2 - 10);
    },

    /***
     * 计算tilepoint
     * @param {Object}ctx  {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}coords 坐标
     * @returns {{x: number, y: number}}
     * @private
     */
    _tilePoint: function (ctx, coords) {
        // start coords to tile 'space'
        var s = ctx.tile.multiplyBy(this.tileSize);

        // actual coords to tile 'space'
        var p = this._map.project(new L.LatLng(coords[1], coords[0]));

        // point to draw
        var x = Math.round(p.x - s.x);
        var y = Math.round(p.y - s.y);
        return {
            x: x,
            y: y
        };
    },

    /***
     *  根据鼠标坐标计算所处的瓦片编号
     * @param coords
     */
    mousePointToTilepoint: function (coords) {
        var p = this._map.project(new L.LatLng(coords[1], coords[0]));
        return p.divideBy(this.tileSize, false);
    },
    /***
     *
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}points 计算瓦片范围内的点
     * @returns {Array}
     * @private
     */
    _clip: function (ctx, points) {
        var nw = ctx.tile.multiplyBy(this.tileSize);
        var se = nw.add(new L.Point(this.tileSize, this.tileSize));
        var bounds = new L.Bounds([nw, se]);
        var len = points.length;
        var out = [];

        for (var i = 0; i < len - 1; i++) {
            var seg = L.LineUtil.clipSegment(points[i], points[i + 1], bounds, i);
            if (!seg) {
                continue;
            }
            out.push(seg[0]);
            // if segment goes out of screen, or it's the last one, it's the end of the line part
            if ((seg[1] !== points[i + 1]) || (i === len - 2)) {
                out.push(seg[1]);
            }
        }
        return out;
    },

    /***
     * 计算点是否可见
     * @param {Array}coords
     * @returns {boolean}
     * @private
     */
    _isActuallyVisible: function (coords) {
        var coord = coords[0];
        var min = [coord.x, coord.y], max = [coord.x, coord.y];
        for (var i = 1; i < coords.length; i++) {
            coord = coords[i];
            min[0] = Math.min(min[0], coord.x);
            min[1] = Math.min(min[1], coord.y);
            max[0] = Math.max(max[0], coord.x);
            max[1] = Math.max(max[1], coord.y);
        }
        var diff0 = max[0] - min[0];
        var diff1 = max[1] - min[1];
        if (this.options.debug) {
            console.log(diff0 + ' ' + diff1);
        }
        var visible = diff0 > 1 || diff1 > 1;
        return visible;
    },


    /**
     * 为了兼容返回的数据不是geojson的形式的情况，增加了一个parse参数处理返回数据
     * @param {Object}ctx
     * @param {Boolean}boolPixelCrs
     * @param parse
     * @private
     */
    _draw: function (ctx, boolPixelCrs, parse) {

        var loader = $.getJSON;
        //
        this.options.zoomlevel = this._map;

        var nwPoint = ctx.tile.multiplyBy(this.tileSize);
        var sePoint = nwPoint.add(new L.Point(this.tileSize, this.tileSize));

        // optionally, enlarge request area.
        // with this I can draw points with coords outside this tile area,
        // but with part of the graphics actually inside this tile.
        // NOTE: that you should use this option only if you're actually drawing points!
        var buf = this.options.buffer;
        if (buf > 0) {
            var diff = new L.Point(buf, buf);
            nwPoint = nwPoint.subtract(diff);
            sePoint = sePoint.add(diff);
        }

        var nwCoord = this._map.unproject(nwPoint, ctx.zoom, true);
        var seCoord = this._map.unproject(sePoint, ctx.zoom, true);
        var bounds = [nwCoord.lng, seCoord.lat, seCoord.lng, nwCoord.lat];

        var url = this.createUrl(bounds);
        if (url) { //如果url未定义的话，不请求
            this.key = ctx.tile.x + ":" + ctx.tile.y;
            var self = this;

            this.tileobj = fastmap.mapApi.tile(url);
            this.tileobj.options.context = ctx.canvas;
            this.tiles[this.key] = this.tileobj;

            this.request = this._ajaxLoader(function (geo) {
                if (parse != null || parse != undefined) {

                    data = parse(geo);
                }
                if (data.length == 0) {
                    return;
                }
                self._drawFeature(data, ctx, boolPixelCrs);
            }, url, this.key, parse);

            this.tiles[this.key].setRequest(this.request);
        }
    },
    /***
     *
     * @param func func回调函数
     * @param url url当前请求的url
     * @param {String}key 瓦片key
     * @param {String}parse 瓦片key
     * @returns parse {XDomainRequest}
     * @private
     */
    _ajaxLoader: function (func, url, key, parse) {
        var self = this
        if (document.getElementById) {
            var x = (window.XDomainRequest) ? new XDomainRequest() : new XMLHttpRequest();
            if (window.XDomainRequest) {
                x.xdomain = 1
            }
        }
        if (x) {
            x.onreadystatechange = function () {
                var el = el || {};
                if (x.xdomain || x.readyState == 4) {
                    var d = 0;
                    var el;
                    if (x.xdomain || x.status == 200) {
                        //el = x.dest;

                        if (x.responseText && x.responseText[0] != "<" && x.responseText != "[0]") {
                            if (window.JSON) {
                                if (window.JSON.parse(x.responseText).data != null) {
                                    d = window.JSON.parse(x.responseText);
                                    d = Object.prototype.toString.call(d.data[self.requestType]) === '[object Array]' ? d.data[self.requestType] : d.data;
                                }

                            } else {
                                d = eval("(" + x.responseText + ")")
                            }
                            if (d.length === 0) {
                                return;
                            }
                            self.tiles[key].setData(parse(d));

                            func(d);
                        }
                    }
                }
            };
            if (x.xdomain) {
                x.onerror = function () {
                    //if (active_loaders[this.seq]) {
                    //    delete active_loaders[this.seq]
                    //}
                };
                x.ontimeout = function () {
                    //if (active_loaders[this.seq]) {
                    //    delete active_loaders[this.seq]
                    //}
                };
                x.onprogress = function () {
                };
                x.onload = x.onreadystatechange
            }
            x.open("GET", url);
            x._url = url;
            x.send()


        }
        return x;
    },
    _loadImg: function (url, callBack) {
        var img = new Image();
        img.onload = function () {
            callBack(img);
        };
        img.src = url;
    },
    /***
     * 绘制要素
     * @param data data绘制的数据
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawFeature: function (data, ctx, boolPixelCrs) {
        for (var i = 0; i < data.length; i++) {
            var feature = data[i];
            var geom = feature.geometry;
            var type = geom.type;
            var style = feature.properties.style;
            switch (type) {
                case 'Point':

                    var icons = feature.properties.markerStyle.icon;
                    for (var item in icons) {

                        if (icons[item].iconName) {

                            this._drawImg({
                                ctx: ctx,
                                geo: icons[item].location,
                                style: {src: icons[item].iconName},
                                boolPixelCrs: boolPixelCrs,
                                rotate: icons[item].rotate ? icons[item].rotate : "",
                                drawx: icons[item].column * icons[item].dx,
                                drawy: icons[item].row * icons[item].dy,
                                scalex: icons[item].scalex ? icons[item].scalex : 1,
                                scaley: icons[item].scaley ? icons[item].scaley : 1
                            });
                        } else {
                            var coords = geom.coordinates;
                            var arrowlist = [];
                            var direct = '';
                            for (var index = 0; index < coords.length; index++) {
                                if (index < coords.length - 1) {
                                    var oneArrow = [{
                                        x: coords[index][0],
                                        y: coords[index][1]
                                    }, {x: coords[index + 1][0], y: coords[index + 1][1]}];
                                    arrowlist.push(oneArrow);
                                }
                            }
                            if (feature.properties.forwarddirect && feature.properties.forwardtext) {
                                direct = 2;//顺方向
                                this._drawIntRticArrow(ctx, direct, arrowlist, feature.properties.color);
                            } else if (feature.properties.reversedirect) {
                                direct = 3;//逆方向
                                this._drawIntRticArrow(ctx, direct, arrowlist, feature.properties.color);
                            }


                            if (direct == 2) {
                                this._drawIntRticText(ctx, geom.coordinates, feature.properties.forwardtext, direct);
                            }
                            if (direct == 3) {
                                this._drawIntRticText(ctx, geom.coordinates, feature.properties.reversetext, direct);
                            }

                        }


                        if (icons[item].text) {
                            this._drawText({
                                ctx: ctx,
                                geo: geom.coordinates,
                                text: icons[item].text,
                                font: 'bold 15px Courier New',
                                rotate: icons[item].rotate ? icons[item].rotate : "",
                                align: 'center',
                                drawx: 0,
                                drawy: 6
                            })
                        }
                    }
                    break;

                case 'MultiPoint':
                    for (j = 0; j < len; j++) {
                        this._drawPoint(ctx, geom[j], style);
                    }
                    break;

                case 'LineString':
                    this._drawLineString(ctx, geom.coordinates, boolPixelCrs, style, {
                        color: 'rgba(105,105,105,1)',
                        radius: 3
                    }, feature.properties);

                    //如果属性中有direct属性则绘制箭头
                    if (feature.properties.direct) {
                        var coords = geom.coordinates;
                        var arrowlist = [];
                        for (var index = 0; index < coords.length; index++) {
                            if (index < coords.length - 1) {
                                var oneArrow = [{x: coords[index][0], y: coords[index][1]}, {
                                    x: coords[index + 1][0],
                                    y: coords[index + 1][1]
                                }];
                                arrowlist.push(oneArrow);
                            }
                        }
                        this._drawArrow(ctx, feature.properties.direct, arrowlist);
                    }

                    //如果属性中有name属性则绘制名称
                    if (feature.properties.name) {
                        this._drawLinkNameText(ctx, geom.coordinates, feature.properties.name);
                    }
                    break;

                case 'MultiLineString':
                    for (var j = 0; j < len; j++) {
                        this._drawLineString(ctx, geom[j], style);
                    }
                    break;

                case 'Polygon':
                    this._drawPolygon(ctx, geom.coordinates, style, true, feature.properties.id);
                    break;

                case 'MultiPolygon':
                    for (j = 0; j < len; j++) {
                        this._drawPolygon(ctx, geom[j], style);
                    }
                    break;

                default:
                    throw new Error('Unmanaged type: ' + type);
            }
        }

        this.eventController.fire(this.eventController.eventTypes.TILEDRAWEND, {
            layer: this,
            id: ctx.tile.x + ":" + ctx.tile.y,
            zoom: ctx.zoom
        });
    },

    /***
     * 根据瓦片bounds构建url
     * @param {Array}bounds 瓦片bounds
     * @returns {*}
     */
    createUrl: function (bounds) {
        var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());
        if (this.url == "") {
            return;
        }
        var url = null;
        var parameter = null;
        //从 oracle 获取
        if(this._map.getZoom() >= this.showNodeLevel){
            url = this.url.url;
            parameter = this.url.parameter;
            if (parameter != null) {
                parameter.z = this._map.getZoom();
                parameter.x = tiles[0];
                parameter.y = tiles[1];
            }
            if(parameter ==undefined){
                console.log(parameter);
            }
            url = url + 'parameter=' + JSON.stringify(parameter);

        }

        //rdlink 从hbase获取
        if(this._map.getZoom()< this.showNodeLevel && this.requestType =='RDLINK'){
            url = this.url.hbaseUrl;
            parameter = this.url.parameter;
            if(parameter ==undefined){
                console.log(parameter);
            }
            if (parameter != null) {
                parameter.z = this._map.getZoom();
                parameter.x = tiles[0];
                parameter.y = tiles[1];
            }
            url = url + 'parameter=' + JSON.stringify(parameter);
        }


        return url;
    },


    //两点之间的距离
    distance: function (pointA, pointB) {
        var len;
        if (pointA.x) {
            len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        } else {
            len = Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2);
        }

        return Math.sqrt(len);
    },
    /**
     * 根据角度重新获得开始点和结束点
     * @param points
     * @param angle
     * @returns {*[]}
     * @private
     */
    _pointsFromAngle: function (points, angle) {
        var drawPoint, endPoint;
        if (angle === 0) {
            if (points[0][0] < points[1][0]) {
                drawPoint = points[0];
                endPoint = points[1];
            } else {
                drawPoint = points[1];
                endPoint = points[0];
            }
        } else if (angle === (Math.PI / 2)) {
            if (points[0][1] < points[1][1]) {
                drawPoint = points[0];
                endPoint = points[1];
            } else {
                drawPoint = points[1];
                endPoint = points[0];
            }
        } else {
            if (angle > 0) {
                if (points[0][0] < points[1][0]) {
                    drawPoint = points[0];
                    endPoint = points[1];
                } else {
                    drawPoint = points[1];
                    endPoint = points[0];
                }

            } else {
                if (points[0][0] > points[1][0]) {
                    drawPoint = points[1];
                    endPoint = points[0];
                } else {
                    drawPoint = points[0];
                    endPoint = points[1];
                }

            }


        }
        return [drawPoint, endPoint]
    }

});


fastmap.mapApi.TileJSON.addInitHook(function () {
    this.isVisiable = this.options.isVisiable ? true : false;
    this.isSelectable = this.options.isSelectable ? true : false;
});
fastmap.mapApi.tileJSON = function (url, options) {
    return new fastmap.mapApi.TileJSON(url, options);
};
;/**
 * Created by zhongxiaoming on 2015/10/19
 * Class EditLayer 可编辑层
 */
fastmap.mapApi.EditLayer = fastmap.mapApi.WholeLayer.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     * 初始化可选参数
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.options = options || {};
        this.url = url;
        fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
        this.eventController = fastmap.uikit.EventController();
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 18;
        this.eventController = fastmap.uikit.EventController();
        this.initEvent();
        this.drawGeometry = null;
    },

    initEvent: function () {
        var that = this;
        this.shapeEditor = fastmap.uikit.ShapeEditorController();

        this.eventController.on(this.eventController.eventTypes.SNAPED, function (event) {
            that.snaped = event.snaped;
        })
        this.eventController.on(this.eventController.eventTypes.STARTSHAPEEDITRESULTFEEDBACK, delegateDraw);
        function delegateDraw(event) {
            that.selectCtrl = fastmap.uikit.SelectController();
            if (that.shapeEditor.shapeEditorResult == null) {
                return;
            }
            that.drawGeometry = that.shapeEditor.shapeEditorResult.getFinalGeometry();
            that.clear();
            that.draw(that.drawGeometry, that, event.index);
            if(that.snaped == true){
                var crosspoint = ( event.index!=null&&that.drawGeometry&&that.drawGeometry.components[event.index])?that.drawGeometry.components[event.index]:event.point;
                if(crosspoint!=undefined){
                    crosspoint = fastmap.mapApi.point(crosspoint.x,crosspoint.y);
                    crosspoint.type = 'Cross';
                    that.draw(crosspoint, that);
                }

            }

        }

        this.eventController.on(this.eventController.eventTypes.STOPSHAPEEDITRESULTFEEDBACK, function () {
            that.map._container.style.cursor = '';

            var coordinate1 = [];
            if (that.drawGeometry) {
                for (var index in that.drawGeometry.components) {
                    coordinate1.push([that.drawGeometry.components[index].x, that.drawGeometry.components[index].y]);
                }

                that._redraw();
            }
        });

        this.eventController.on(this.eventController.eventTypes.ABORTSHAPEEDITRESULTFEEDBACK, function () {
            that.drawGeometry = that.shapEditor.shapeEditorResult.getOriginalGeometry();
            that.shapEditor.shapeEditorResult.setFinalGeometry(that.drawGeometry.clone());

            that._redraw()
        });
    },
    /***
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function (map) {
        map.getPanes().tilePane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    /***
     * 绘制几何图形
     * @param currentGeo 当前几何
     * @param self
     * @param index 鼠标拖动的当前点
     */
    draw: function (currentGeo, self, index) {
        if (!currentGeo) {
            return;
        }

        switch (currentGeo.type) {

            case 'LineString':
                drawLineString(currentGeo.components, {color: 'red', size: 2}, false,null,false,false,self);
                break;
            case 'Point':
                drawPoint(currentGeo, {color: 'red', radius: 3}, false);
                break;
            case'Polygon':
                drawPolygon(currentGeo, {color: 'red', outline: 3}, false);
                break;
            case 'Cross':
                drawCross(currentGeo, {color: 'blue', width: 1}, false,self);
                break;
            case 'marker':
                drawMarker(currentGeo.point, currentGeo.orientation, currentGeo.angle, false,self);
                break;
            case 'MultiPolyline':
                drawMultiPolyline(currentGeo.coordinates,{color: 'red', width: 2},self);
                break;
            case 'intRticMarker':
                drawRticMarker(currentGeo.point, currentGeo.orientation, currentGeo.angle, false,self);
                break;
        }

        function drawCross(geom, style, boolPixelCrs,self) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }

            var verLineArr = [{x: p.x, y: p.y + 20}, {x: p.x, y: p.y - 20}];
            drawLineString(verLineArr, {color: 'blue', size: 1}, true,null,null,null,self);
            var horLineArr = [{x: p.x - 20, y: p.y}, {x: p.x + 20, y: p.y}];
            drawLineString(horLineArr, {color: 'blue', size: 1}, true,null,null,null,self);
        }

        function drawPoint(geom, style, boolPixelCrs) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }

            var g = self._ctx;
            g.beginPath();
            g.fillStyle = style.color;
            g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
            g.closePath();
            g.fill();
            g.restore();
        }


        function drawLineString(geom, style, boolPixelCrs, index,boolnode,boolselectnode,self) {
            if (!geom) {
                return;
            }

            var proj = [], i;

            for (var i = 0; i < geom.length; i++) {
                if (boolPixelCrs) {
                    proj.push({x: geom[i].x, y: geom[i].y});
                } else {

                    proj.push(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]));

                    if(boolselectnode&&self.selectCtrl)    {
                        if(self.selectCtrl.selectedFeatures.latlng&&self.selectCtrl.selectedFeatures.latlng.lat == geom[i].y && self.selectCtrl.selectedFeatures.latlng.lng == geom[i].x){
                            drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }
                    }else{
                        if(boolnode){
                            if(i==0 || i==geom.length-1){
                                drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                    color: 'blue',
                                    radius: 4
                                }, true);
                            }
                        }else{
                            drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }
                    }


                }
            }

            var g = self._ctx;
            g.strokeStyle = style.color;
            g.lineWidth = style.size;
            //g.opacity = 0.5;
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.stroke();
            g.restore();
        }


        function drawMultiPolyline(geom,style,self){

            for(var i = 0,len = geom.length;i < len;i++){
                drawLineString(geom[i].components, style, false, null, true,true,self);
            }
        }


        function drawPolygon(geom, style) {
            if (!style) {
                return;
            }

                var coords = geom.components, proj = [], i;

                for (i = 0; i < coords.length; i++) {
                    proj.push(this.map.latLngToContainerPoint([coords[i].y, coords[i].x]));
                }

                var g = self._ctx;
                var outline = style.outline;
                g.fillStyle = style.color;
                if (outline) {
                    g.strokeStyle = outline.color;
                    g.lineWidth = outline.size;
                }
                g.beginPath();
                for (i = 0; i < proj.length; i++) {
                    var method = (i === 0 ? 'move' : 'line') + 'To';
                    g[method](proj[i].x, proj[i].y);
                }
                g.closePath();
                g.fill();
                if (outline) {
                    g.stroke();
                }

        }

        function drawMarker(geom, type, angle, boolPixelCrs,self) {
            var url, p = null,angleOfTran=angle,that=this;
            if (!geom) {
                return;
            }

            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p =this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            //if(type==="3") {
            //    angleOfTran = angleOfTran + Math.PI;
            //}
            url = "../../images/road/img/" + type + ".svg";
            var g = self._ctx;
            loadImg(url, function (img) {
                g.save();
                g.translate(p.x, p.y);
                g.rotate(angleOfTran);
                g.drawImage(img, 0, 0);
                g.restore();
                currentGeo.pointForDirect = directOfPoint(p,61, 32, angle);
                self.eventController.fire(self.eventController.eventTypes.DIRECTEVENT,{"geometry":currentGeo})
            })

        }

        function drawRticMarker(geom, type, angle, boolPixelCrs,self) {
            var url, p = null,angleOfTran=angle,that=this;
            if (!geom) {
                return;
            }

            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p =this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            if(type==="2") {
                angleOfTran = angleOfTran + Math.PI;
            }
            url = "../../images/road/intRtic/" + type + ".svg";
            var g = self._ctx;
            loadImg(url, function (img) {
                g.save();
                g.translate(p.x, p.y);
                g.rotate(angleOfTran);
                g.drawImage(img, 0, 0);
                g.restore();
                currentGeo.pointForDirect = directOfPoint(p,61, 32, angle);
                self.eventController.fire(self.eventController.eventTypes.DIRECTEVENT,{"geometry":currentGeo})
            })

        }

        function loadImg(url, callBack) {
            var img = new Image();
            img.onload = function () {
                callBack(img);
            };
            img.src = url;
        }
        function directOfPoint(point,length,width,angle) {
            point.x = point.x + length;
            point.y = point.y + width / 2;
            point.x = point.x + Math.tan(angle);
            point.y = point.y + Math.tan(angle);
            //point=this.map.containerPointToLatLng(point);
            return point;
        }
    },

    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },

    _redraw: function () {

        this.clear();

        this.draw(this.drawGeometry, this);
        this._resetCanvasPosition();
        return this;
    }
});

fastmap.mapApi.editLayer = function (url, options) {
    return new fastmap.mapApi.EditLayer(url, options);
};

;/**
 * Created by wangtun on 2016/2/2.
 */
/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class 1:25000图幅图层
 */
fastmap.mapApi.GridLayer = fastmap.mapApi.MeshLayer.extend({
    /***
     * 初始化可选参数
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.url = url;
        this.options = options || {};
        fastmap.mapApi.MeshLayer.prototype.initialize(this, options);
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 18;
        this.divideX=this.options.divideX||0;
        this.divideY=this.options.divideY||0;
    },
    /***
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.options);
        var that=this;
        var center=null;
        this.canv.onclick=function(e){
            var event=e;
            event.stopPropagation();
            event.preventDefault();
            var showFlag=false;
            for(var i=0;i<that.gridArr.length;i++){
                var latlngbounds = that.gridArr[i].getBounds();
                var bound = L.bounds(that.map.latLngToContainerPoint(latlngbounds.getNorthWest()), that.map.latLngToContainerPoint(latlngbounds.getSouthEast()));
                if(e.x<=bound.max.x&& e.x>=bound.min.x&& e.y<=bound.max.y&& e.y>=bound.min.y){
                    var center=latlngbounds.getCenter();
                    if(that.options.gridInfo[that.gridArr[i].options.gridId]){
                        if(that.options.gridInfo[that.gridArr[i].options.gridId].couldBorrow){
                            that.map.openPopup('<a href="javascript:void(0)" class="btn btn-warning">借数据</a>',center);
                        }
                        else if(that.options.gridInfo[that.gridArr[i].options.gridId].couldReturn){
                            that.map.openPopup('<a href="javascript:void(0)" class="btn btn-warning">还数据</a>',center);
                        }
                        else if(that.options.gridInfo[that.gridArr[i].options.gridId].userId){
                            that.map.openPopup('<div style="width:200px;text-align: center"><img src="css/img/pie.jpg" style="width:100px;height:100px"/></div>',center);
                        }
                        showFlag=true;
                    }
                }
            }
            if(!showFlag){
                that.map.closePopup()
            }
        };

        this.canv.ondblclick=function(){
            window.location.href="edit.html";
        }
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function (map) {
        map.getPanes().tilePane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    /***
     * 根据bounds绘制图幅
     * @param {L.Bounds}bounds
     */
    draw: function (bounds) {
        var pointDL = bounds.getSouthWest();
        //右上角点
        var pointUR = bounds.getNorthEast();
        //var ret= this.CalculateMeshIds(pointDL.lng, pointUR.lng, pointDL.lat, pointUR.lat);
        var minPoint = this.Calculate25TMeshCorner(pointDL);
        var minLon = minPoint.lng;
        var minLat = minPoint.lat;
        this.gridArr = [];
        var labelArr = [];
        while (minLon <= pointUR.lng) {
            var gridObj = this.createGrid(minLon, minLon + 0.125, minLat, pointUR.lat);
            this.gridArr = this.gridArr.concat(gridObj);
            minLon += 0.125;
        }

        for (var i = 0, len = this.gridArr.length; i < len; i++) {
            var latlngbounds = this.gridArr[i].getBounds();
            var bound = L.bounds(this.map.latLngToContainerPoint(latlngbounds.getNorthWest()), this.map.latLngToContainerPoint(latlngbounds.getSouthEast()));
            var size = bound.getSize();
            this.drawRect(this._ctx, this.gridArr[i], {
                x: bound.min.x,
                y: bound.min.y,
                width: size.x,
                height: size.y
            });
        }
    },

    /***
     * 绘制图幅
     * @param {Object}context canvas context
     * @param meshId 图幅id
     * @param options 可选参数
     */
    drawRect: function (context, grid, options) {
        context.globalAlpha = 0.3;
        context.linewidth = 1;  //边框宽
        context.strokeStyle = 'red'//边框颜色
        context.strokeRect(options.x, options.y, options.width, options.height);
    },

    /***
     * 重绘
     * @returns {fastmap.mapApi.MeshLayer}
     * @private
     */
    _redraw: function () {
        this._resetCanvasPosition();
        this.clear();

        if (this.map.getZoom() >= this.minShowZoom && this.map.getZoom() <= this.maxShowZoom) {
            this.draw(this.map.getBounds())
        }
        return this;
    },

    /***
     * 生成图幅格网
     * @param {number}minLon 最小经度
     * @param {number}maxLon 最大经度
     * @param {number}origin 原点
     * @param {number}destination 最大经度
     * @returns {Array}
     */
    createGrid: function (minLon, maxLon, origin, destination) {
        //保存生成的网格
        var grid = [];
        var labels = []
        while (origin <= destination) {
            var components = [];
            components.push([origin, minLon]);
            components.push([origin + 0.083333333333333, minLon]);
            components.push([origin + 0.083333333333333, maxLon]);
            components.push([origin, maxLon]);
            var meshId = this.Calculate25TMeshId({
                lng: (minLon + maxLon) / 2,
                lat: (origin + origin + 0.083333333333333) / 2
            });
            var bound = this.Calculate25TMeshBorder(meshId);

            this.createSubGrid(grid,bound,meshId,function(){
                origin += 0.083333333333333;
            });
        }

        return grid
    },

    createSubGrid:function(grid,bound,meshId,callback){
        var differenceY=bound.maxLat-bound.minLat;
        if(this.divideY>0){
            differenceY=(bound.maxLat-bound.minLat)/this.divideY;
        }

        var differenceX=bound.maxLon-bound.minLon;
        if(this.divideX>0){
            differenceX=(bound.maxLon-bound.minLon)/this.divideX;
        }


        for(var i= 0;i<this.divideX;i++){
            var boundXmin=bound.minLon+differenceX*i;
            var boundXmax=bound.minLon+differenceX*(i+1);
            for(var j=0;j<this.divideY;j++){
                var boundYmin=bound.minLat+differenceY*j;
                var boundYmax=bound.minLat+differenceY*(j+1)

                var b = L.latLngBounds([boundYmin, boundXmin], [boundYmax, boundXmax]);
                var polygon = L.rectangle(b, {meshId: meshId,gridId:meshId+"_"+i+""+j});
                grid.push(polygon);
            }
        }
        callback();
    },

    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },

    /***
     * 重新调整图层位置
     * @private
     */
    _resetCanvasPosition: function () {
        var bounds = this.map.getBounds();
        var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    },

    /*
     *	根据纬度计算该点位于理想图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateIdealRowIndex: function (lat, remainder) {
        //相对区域纬度 = 绝对纬度 - 0.0
        var regionLatitude = lat - 0.0;

        //相对的以秒为单位的纬度
        var secondLatitude = regionLatitude * 3600;

        var longsecond;

        //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        if (secondLatitude * 1000 < 0) {
            longsecond = Math.ceil(secondLatitude * 1000);
        }
        else {
            longsecond = Math.floor(secondLatitude * 1000)
        }

        remainder = (longsecond % 300000);

        return {value: Math.floor(longsecond / 300000), reminder: remainder};
    },


    /*
     *	根据纬度计算该点位于实际图幅分割的行序号
     *
     *  @param{number}lat                 纬度      单位‘度’
     *  @param{number}remainder           余数      单位‘千秒’
     */
    CalculateRealRowIndex: function (lat, remainder) {
        //理想行号
        var idealRow = this.CalculateIdealRowIndex(lat, remainder);


        switch (idealRow % 3)//三个一组的余数
        {
            case 0: //第一行
            {
                if (300000 - idealRow.remainder <= 12) //余数距离上框小于0.012秒
                    idealRow.value++;
            }
                break;
            case 1: //第二行
                break;
            case 2: //第三行
            {
                if (idealRow.remainder < 12) //余数距离下框小于等于0.012秒
                    idealRow.value--;
            }
                break;
        }

        return idealRow;
    },

    /*
     *	根据经度计算该点位于实际图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     */

    CalculateRealColumnIndex: function (lon, remainder) {
        return this.CalculateIdealColumnIndex(lon, remainder);
    },

    /*
     * 根据经度计算该点位于理想图幅分割的列序号
     *
     *  @param{number}lon                经度，单位“度”
     *  @param{number}reminder           余数 单位“千秒”
     */

    CalculateIdealColumnIndex: function (lon, remainder) {
        //相对区域经度 = 绝对经度 - 60.0
        var regionLongitude = lon - 60.0;

        //相对的以秒为单位的经度
        var secondLongitude = regionLongitude * 3600;

        //为避免浮点数的内存影响，将秒*10的三次方(由于0.00001度为0.036秒)
        var longsecond = Math.floor(secondLongitude * 1000);

        remainder = Math.floor(longsecond % 450000);

        return {value: Math.floor(longsecond / 450000), reminder: remainder};
    },

    MeshLocator_25T: function (lon, lat) {
        if (0x01 == (this.IsAt25TMeshBorder(lon, lat) & 0x0F)) //为了保证它总返回右上的图幅
            lat += 0.00001;


        var remainder = 0;

        var rowResult = this.CalculateRealRowIndex(lat, remainder);

        var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);

        //第1、2位 : 纬度取整拉伸1.5倍
        var M1M2 = Math.floor(lat * 1.5);

        //第3、4位 : 经度减去日本角点 60度
        var M3M4 = Math.floor(lon) - 60;

        //第5位 :
        var M5 = rowResult.value % 8;

        //第6位 : 每列450秒，每度包含8列
        var M6 = colResult.value % 8;

        //连接以上数字,组成图幅号
        var sMeshId = "" + M1M2 + M3M4 + M5 + M6;

        while (sMeshId.length < 6) {
            sMeshId = "0" + sMeshId;
        }

        return sMeshId;
    },

    /*
     *  点所在的图幅号,如果点在图幅边界上,返回右上的图幅号
     *
     *  @param {L.Latlng}point   经纬度点
     */
    Calculate25TMeshId: function (point) {
        var mesh = this.MeshLocator_25T(point.lng, point.lat);

        return mesh;
    },

    /*
     *	快速计算点所在的图幅左下角点
     *
     *  @param{L.Latlng}point          经纬度点
     */
    Calculate25TMeshCorner: function (point) {
        return this.Calculate25TMeshCornerByMeshId(this.Calculate25TMeshId(point));
    },

    /***
     * 计算图幅角点坐标
     * @param {String}mesh
     * @returns {*}
     * @constructor
     */
    Calculate25TMeshCornerByMeshId: function (mesh) {
        var cc = mesh.split("");

        var M1 = parseInt(cc[0]);
        var M2 = parseInt(cc[1]);
        var M3 = parseInt(cc[2]);
        var M4 = parseInt(cc[3]);
        var M5 = parseInt(cc[4]);
        var M6 = parseInt(cc[5]);

        var x = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        var y = (M1 * 10 + M2) * 2400 + M5 * 300;

        var point = L.latLng(y / 3600.0, x / 3600.0);

        return point;
    },

    /***
     *  计算图幅border
     * @param {String}mesh
     * @returns {{minLon: (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng), minLat: (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat), maxLon: (*|a.lng|L.LatLng.lng|L.LatLngBounds._southWest.lng|L.LatLngBounds._northEast.lng|o.LatLngBounds._northEast.lng), maxLat: (*|a.lat|L.LatLng.lat|L.LatLngBounds._southWest.lat|L.LatLngBounds._northEast.lat|o.LatLngBounds._northEast.lat)}}
     * @constructor
     */
    Calculate25TMeshBorder: function (mesh) {
        var cc = mesh.split("");

        var M1 = parseInt(cc[0]);
        var M2 = parseInt(cc[1]);
        var M3 = parseInt(cc[2]);
        var M4 = parseInt(cc[3]);
        var M5 = parseInt(cc[4]);
        var M6 = parseInt(cc[5]);

        var x_conner = (M3 * 10 + M4) * 3600 + M6 * 450 + 60 * 3600;
        var y_conner = (M1 * 10 + M2) * 2400 + M5 * 300;

        var x_upper = x_conner + 450.0;
        var y_upper = y_conner + 300.0;


        var leftBottom = L.latLng(y_conner / 3600.0, x_conner / 3600.0);

        var rightTop = L.latLng(y_upper / 3600.0, x_upper / 3600.0);

        return {minLon: leftBottom.lng, minLat: leftBottom.lat, maxLon: rightTop.lng, maxLat: rightTop.lat};
    },
    /*
     * 	点是否在图框上
     *
     *  @param{number}lon               经度
     *  @param{number}lat               纬度
     */

    IsAt25TMeshBorder: function (lon, lat) {
        var model = 0;

        var remainder = 0;
        var rowResult = this.CalculateIdealRowIndex(lat, remainder);
        switch (rowResult.value % 3) {
            case 0: //第一行
            {
                if (300000 - rowResult.remainder == 12) //余数距离上框等于0.012秒
                    model |= 0x01;
                else if (rowResult.remainder == 0)
                    model |= 0x01;
            }
                break;
            case 1: //第二行由于上下边框均不在其内，因此不在图框上
                break;
            case 2: //第三行
            {
                if (rowResult.remainder == 12) //余数距离下框等于0.012秒
                    model |= 0x01;
            }
                break;
        }

        var colResult = this.CalculateRealColumnIndex(lon, rowResult.remainder);

        if (0 == colResult.remainder)
            model |= 0x10;

        return model;
    }

});
fastmap.mapApi.gridLayer=function(url, options) {
    return new fastmap.mapApi.GridLayer(url, options);
};
;/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexAdd
 */

fastmap.mapApi.adAdminAdd = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        var layerCtrl = fastmap.uikit.LayerController();
        this.currentEditLayer = layerCtrl.getLayerById('referenceLine');
        this.tiles = this.currentEditLayer.tiles;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.eventController = fastmap.uikit.EventController();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:false,snapVertex:false});
        this.snapHandler.enable();
        this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('adAdmin'));
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('tap', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },

    onMouseMove:function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },


    onMouseDown: function (event) {
        var mouseLatlng;
        if(this.snapHandler.snaped == true){
            mouseLatlng = this.targetPoint
        }else{
            mouseLatlng = event.latlng;
        }
        this.shapeEditor.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(mouseLatlng.lng, mouseLatlng.lat));
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);

    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;
            if(this.snapHandler.snaped == true){

                pixels = this.transform.lonlat2Pixel(this.targetPoint.lng, this.targetPoint.lat,this._map.getZoom());
            }else{
                pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
            }

            var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();

            var temp = 0;
            for (var i = 0; i < data.length; i++)
            {
                for (var j = 0; j < data.length - i; j++)
                {
                    if((j+1)<(data.length - i-1)){
                        if (this._TouchesPath(data[j].geometry.coordinates, x, y) > this._TouchesPath(data[j+1].geometry.coordinates, x, y))
                        {
                            temp = data[j+1];
                            data[j + 1] = data[j];
                            data[j] = temp;
                        }
                    }

                }
            }
            var point= transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
            point= new fastmap.mapApi.Point(point[0], point[1]);
            //id = data[0].properties.id;
            this.selectCtrl.selectedFeatures = data[0].properties;
        }


    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y) {
        var N = d.length;
        var p1x = d[0][0][0];
        var p1y = d[0][0][1];
        var arr=[];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0][0];
            var p2y = d[i][0][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            //if ((dx * dx + dy * dy) <= r * r) {
            //    return (dx * dx + dy * dy)
            //}
            p1x = p2x;
            p1y = p2y
            arr.push(dx * dx + dy * dy)
        }
        var temp = 0;
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = 0; j < arr.length - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr[0];


    },
    cleanHeight: function () {
        this._cleanHeight();
    },
    /***
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.currentEditLayer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;
                    if(!style) {
                        this.currentEditLayer._drawLineString(ctx, geom, true, {
                                size: 4,
                                color: '#FBD356',
                                mouseOverColor: 'rgba(255,0,0,1)',
                                clickColor: 'rgba(252,0,0,1)'
                            },
                            {
                                color: 'rgba(255,0,0,1) ',
                                radius: 3
                            }, feature.properties);
                    }else{
                        this.currentEditLayer._drawLineString(ctx, geom, true, style, {
                            color: '#696969',
                            radius: 3
                        }, feature.properties);
                    }


                }
            }

        }


    }
    ,
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    _drawHeight: function (id,point) {
        this.redrawTiles = this.tiles;
        for (var obj in this.tiles) {

            var data = this.tiles[obj].data.features;

            for (var key in data) {

                if (data[key].properties.id == id) {
                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawImg({
                        ctx:ctx,
                        geo:point,
                        style:{src:'../../images/road/img/star.png'},
                        boolPixelCrs:true
                    })
                }
            }
        }


    }

});;/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexMove
 */

fastmap.mapApi.adAdminMove = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.interLinks = [];
        this.interNodes = [];
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:true});
        this.snapHandler.enable();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
        this.eventController = fastmap.uikit.EventController();
        var layerCtrl = fastmap.uikit.LayerController();
        this.currentEditLayer = layerCtrl.getLayerById('referenceLine');
        this.tiles = this.currentEditLayer.tiles;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry();

        //for (var j = 0, len = points.length; j < len; j++) {
            var disAB = this.distance(this._map.latLngToLayerPoint([points.y,points.x]), layerPoint);
            if (disAB < 20) {
                this.targetIndex = 0;
            }
        //}
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }

        var that = this;

        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.snapHandler.targetIndex = this.targetIndex;
            this.selectCtrl.setSnapObj(this.snapHandler);
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])

        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});

        }

        that.resetVertex(layerPoint);

        that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});
    },

    contains:function(obj,arr){
        for(var item in arr){
            if(arr[item].nodePid == obj.nodePid){
                arr.splice(item,1,obj);
                return true;
            }
        }

        return false;
    },
    onMouseUp: function(event){
        this.targetIndex = null;
        this.snapHandler.setTargetIndex(this.targetIndex);

        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        var nodePid = null;

        var tileCoordinate = this.transform.lonlat2Tile(this.targetPoint.lng, this.targetPoint.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
        if(this.snapHandler.snaped == true){
            if(this.snapHandler){
                if(this.snapHandler.targetIndex == 0){
                    nodePid = this.selectCtrl.selectedFeatures.snode;
                }else if(this.snapHandler.targetIndex == this.selectCtrl.selectedFeatures.geometry.components.length-1) {
                    nodePid = this.selectCtrl.selectedFeatures.enode;
                }else{
                    nodePid = null;
                }
            }

            if(this.snapHandler.selectedVertex == true){
                if(this.interNodes.length==0 ||!this.contains(nodePid,this.interNodes )){
                if(this.snapHandler.snapIndex == 0){

                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.snode),nodePid:nodePid});
                }else{
                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.enode),nodePid:nodePid});
                }
                }


            }else{
                if(this.interLinks.length ==0 || !this.contains({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid},this.interLinks )){
                    this.snapHandler.interLinks.push({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid});
                }


            }

            if(nodePid == null){
                this.snapHandler.interNodes = [];
                this.snapHandler.interLinks = [];
            }


        }
    },

    //两点之间的距离
     distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(){
        this.shapeEditor.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        //var distance =0 , distance1 = this.targetIndex!=0?0:this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex-1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]),
        //distance2 = this.targetIndex!=this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1?this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex+1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]):0;
        //distance = distance1<distance2?distance1:distance2
        //if(distance < 2){
        //    console.log('形状点之间距离不能小于2米！')
        //}


    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;
            if(this.snapHandler.snaped == true){
                pixels = this.transform.lonlat2Pixel(this.targetPoint.lng, this.targetPoint.lat,this._map.getZoom());
            }else{
                pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
            }

            var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();

            var temp = 0;
            for (var i = 0; i < data.length; i++)
            {
                for (var j = 0; j < data.length - i; j++)
                {
                    if((j+1)<(data.length - i-1)){
                        if (this._TouchesPath(data[j].geometry.coordinates, x, y) > this._TouchesPath(data[j+1].geometry.coordinates, x, y))
                        {
                            temp = data[j+1];
                            data[j + 1] = data[j];
                            data[j] = temp;
                        }
                    }

                }
            }
            var point= transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
            point= new fastmap.mapApi.Point(point[0], point[1]);
            //id = data[0].properties.id;
            this.selectCtrl.selectedFeatures.linkPid = data[0].properties.id;
        }
    },
    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y) {
        var N = d.length;
        var p1x = d[0][0][0];
        var p1y = d[0][0][1];
        var arr=[];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0][0];
            var p2y = d[i][0][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            //if ((dx * dx + dy * dy) <= r * r) {
            //    return (dx * dx + dy * dy)
            //}
            p1x = p2x;
            p1y = p2y
            arr.push(dx * dx + dy * dy)
        }
        var temp = 0;
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = 0; j < arr.length - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr[0];
    }
});/**
 * Created by liwanchong on 2015/12/29.
 */
fastmap.mapApi.CrossingAdd = L.Handler.extend({
    /**
     * 参数
     */
    options: {
        shapeOptions: {
            stroke: true,
            color: '#f06eaa',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: null, //same as color by default
            fillOpacity: 0.2,
            clickable: true
        },
        metric: true, // Whether to use the metric meaurement system or imperial
        repeatMode: true
    },
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.type = options.type;
        this._map = options.map;
        this.boxLayer = options.layer;
        this._container = this._map._container;
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        if (this._map) {
            this._mapDraggable = this._map.dragging.enabled();

            if (this._mapDraggable) {
                this._map.dragging.disable();
            }
            this._container.style.cursor = 'crosshair';
            this._map
                .on('mousedown', this.onMouseDown, this)
                .on('mousemove', this.onMouseMove, this);
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        if (this._map) {
            if (this._mapDraggable) {
                this._map.dragging.enable();
            }

            //TODO refactor: move cursor to styles
            this._map._container.style.cursor = '';

            this._map
                .off('mousedown', this.onMouseDown, this)
                .off('mousemove', this.onMouseMove, this);

            L.DomEvent.off(document, 'mouseup', this.onMouseUp, this);

            // If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
            if (this._shape) {
                this._map.removeLayer(this._shape);
                this._map.getPanes().overlayPane.style.zIndex = "1";
                delete this._shape;
            }
        }
        this._isDrawing = false;
    },
    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function (e) {
        this._isDrawing = true;
        this._startLatLng = e.latlng;
        if (this._map.getPanes().overlayPane.style.zIndex === "1") {
            this._map.getPanes().overlayPane.style.zIndex = "4";
        }

        L.DomEvent
            .on(document, 'mouseup', this.onMouseUp, this)
            .preventDefault(e.originalEvent);
    },
    onMouseUp: function (e) {
        if (this._shape) {
            this._fireCreatedEvent();
        }

        this.disable();
        if (this.options.repeatMode) {
            this.enable();
        }
    },
    onMouseMove: function (e) {
        var latlng = e.latlng;
        if (this._isDrawing) {
            this._drawShape(latlng);

        }
    },
    _fireCreatedEvent: function () {
        var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
        //var dataOfRectangle = this._dataOfRectangle(rectangle, this.boxLayer.tiles);
        var dataOfRectangle = this._getDataOfRectangle(rectangle, this.boxLayer.tiles);

        this.eventController.fire(this.eventController.eventTypes.GETBOXDATA,
            {data: dataOfRectangle, layerType: this.type,border:rectangle});
    },
    _arrayToWeigh: function (arr) {
        var hash = {},
            len = arr.length,
            re = [];
        for (var i = 0; i < len; i++) {
            if (!hash[arr[i]]) {
                hash[[arr[i]]] = true;
                re.push(arr[i]);
            }
        }
        return re;
    },
    _getDataOfRectangle: function (layer, tiles) {
        var points = layer._latlngs, dataOfRectangle = [];
        var transform = new fastmap.mapApi.MecatorTranform();
        var startTilePoint = transform.lonlat2Tile(points[1].lng, points[1].lat, map.getZoom()),
            endTilePoint = transform.lonlat2Tile(points[3].lng, points[3].lat, map.getZoom());
        var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
        var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
        var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
        var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
        var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
        var polygon = new fastmap.mapApi.Polygon([lineString]);
        for (var i = startTilePoint[0]; i <= endTilePoint[0]; i++) {
            for (var j = startTilePoint[1]; j <= endTilePoint[1]; j++) {

                if (tiles[i + ":" + j]) {
                    var data = tiles[i + ":" + j].data;
                    for (var item in data) {
                        var pointsLen = data[item].geometry.coordinates.length;
                        var linePoints = [];
                        for(var n=0;n<pointsLen;n++) {
                            var linePoint = data[item].geometry.coordinates[n];
                            linePoint = transform.PixelToLonlat(i * 256 + linePoint[0], j * 256 + linePoint[1], map.getZoom());
                            linePoint = new fastmap.mapApi.Point(linePoint[0], linePoint[1]);
                            linePoints.push(linePoint);
                        }
                        var line = new fastmap.mapApi.LineString(linePoints);
                        if(polygon.intersects(line)) {
                            var result = {};
                            result["data"] = data[item];
                            result["line"] = line;
                            dataOfRectangle.push(result);
                        }
                    }
                }
            }
        }

        return dataOfRectangle;
    },
    _dataOfRectangle: function (layer, tiles) {
        var points = layer._latlngs, linkArr = [], nodeArr = [], dataOfRectangle = null;
        var transform = new fastmap.mapApi.MecatorTranform();
        var startTilePoint = transform.lonlat2Tile(points[1].lng, points[1].lat, map.getZoom()),
            endTilePoint = transform.lonlat2Tile(points[3].lng, points[3].lat, map.getZoom());
        var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
        var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
        var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
        var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
        var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
        var polygon = new fastmap.mapApi.Polygon([lineString]);
        for (var i = startTilePoint[0]; i <= endTilePoint[0]; i++) {
            for (var j = startTilePoint[1]; j <= endTilePoint[1]; j++) {
                var data = tiles[i + ":" + j].data.features;
                if (data) {
                    for (var item in data) {
                        var pointsLen = data[item].geometry.coordinates.length;
                            var startPoint = data[item].geometry.coordinates[0][0],
                                endPoint = data[item].geometry.coordinates[pointsLen - 1][0];
                            startPoint = transform.PixelToLonlat(i * 256 + startPoint[0], j * 256 + startPoint[1], map.getZoom());
                            startPoint = new fastmap.mapApi.Point(startPoint[0], startPoint[1]);
                            endPoint = transform.PixelToLonlat(i * 256 + endPoint[0], j * 256 + endPoint[1], map.getZoom());
                            endPoint = new fastmap.mapApi.Point(endPoint[0], endPoint[1]);
                            if (polygon.containsPoint(startPoint)) {
                                if (polygon.containsPoint(endPoint)) {
                                    linkArr.push({
                                        "node": [parseInt(data[item].properties.snode), parseInt(data[item].properties.enode)],
                                        "link": parseInt(data[item].properties.id)
                                    });

                                } else {
                                    var sObj = {
                                        "node": parseInt(data[item].properties.snode),
                                        "link": parseInt(data[item].properties.id)
                                    }
                                    nodeArr.push(sObj);
                                }


                            } else if (polygon.containsPoint(endPoint)) {

                                if (polygon.containsPoint(startPoint)) {
                                    linkArr.push({
                                        "node": [parseInt(data[item].properties.snode), parseInt(data[item].properties.enode)],
                                        "link": parseInt(data[item].properties.id)
                                    });
                                } else {
                                    var eObj = {
                                        "node": parseInt(data[item].properties.enode),
                                        "link": parseInt(data[item].properties.id)
                                    };
                                    nodeArr.push(eObj);
                                }

                            }

                            dataOfRectangle = {
                                links: linkArr,
                                nodes: nodeArr
                            };


                    }
                }
            }
        }

        return dataOfRectangle;
    },
    _drawShape: function (latlng) {
        if (!this._shape) {
            this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
            this._map.addLayer(this._shape);
        } else {
            this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
        }
    },
    //两点之间的距离
    distance: function (pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }
});/**
 * Created by zhoumingrui on 2015/11/3.
 * Class DrawPath
 */

fastmap.mapApi.DrawPath = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this.eventController = fastmap.uikit.EventController();
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.catches = [];
        this.insertPoint = null;
        this.clickcount = 1;
        this.targetGeoIndex = 0;
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: true,
            snapNode: true,
            snapVertex: true
        });
        this.snapHandler.enable();
        //this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        this.validation = fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on('click', this.onMouseDown, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);

    },


    onMouseDown: function (event) {
        var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
        var lastPoint = this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 2];
        if (lastPoint != null && lastPoint.x != 0) {
            var lpoint = this._map.latLngToLayerPoint(L.latLng(lastPoint.y, lastPoint.x));
            var dis = lpoint.distanceTo(event.layerPoint);
            if (dis < 5) {
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 1, 1);

                this.clickcount = 1;
                this.shapeEditor.stopEditing();
                fastmap.uikit.ShapeEditorController().stopEditing();
                return;
            }
        }
        if (this.snapHandler.snaped) {
            mousePoint = this.targetPoint;
        }
        if (this.clickcount == 1) {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
        } else {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 1, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
        }
        this.clickcount++;
        if (this.snapHandler.snaped) {
            mousePoint = this.targetPoint;
            if (this.snapHandler.snapIndex == 0) {
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.snode),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                });
                if (this.clickcount == 2) {
                    this.snodePid = parseInt(this.snapHandler.properties.snode);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.snode);
                }
            } else if (this.snapHandler.snapIndex == -1) {
                this.catches.push({
                    linkPid: parseInt(this.snapHandler.properties.id),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            }
            else {
                if (this.clickcount == 2) {
                    this.snodePid = parseInt(this.snapHandler.properties.enode);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.enode);
                }
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.enode),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            }
        } else {

        }

        this.shapeEditor.shapeEditorResult.setProperties({
            snodePid: this.snodePid,
            catches: this.catches,
            enodePid: this.enodePid
        });

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';
        var layerPoint = event.layerPoint;

        this.snapHandler.setTargetIndex(0);
        var that = this;
        if (this.snapHandler.snaped == true) {
            this.eventController.fire( this.eventController.eventTypes.SNAPED, {'snaped': true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0])
            this.insertPoint = fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);
            if (this.clickcount > 1) {
                var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
                if (points.length == 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 0, this.insertPoint);
                }
                if (points.length > 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 1, this.insertPoint);
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
        } else {
            this.eventController.fire( this.eventController.eventTypes.SNAPED, {'snaped': false});

            this.insertPoint = fastmap.mapApi.point(this._map.layerPointToLatLng(layerPoint).lng, this._map.layerPointToLatLng(layerPoint).lat);
            if (this.clickcount > 1) {
                var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
                if (points.length == 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 0, this.insertPoint);
                }
                if (points.length > 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 1, this.insertPoint);
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

    },
    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    /***
     * 重新设置节点
     */
    resetVertex: function () {
        if (this.start == true) {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1);
            this.start = false;
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));

    }

});
;/**
 * Created by zhongxiaoming on 2016/4/14.
 * Class DrawPolygon
 */



fastmap.mapApi.DrawPolygon = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this.eventController = fastmap.uikit.EventController();
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.catches = [];
        this.insertPoint = null;
        this.clickcount = 1;
        this.targetGeoIndex = 0;
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: true,
            snapNode: true,
            snapVertex: true
        });
        this.snapHandler.enable();
        this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        this.validation = fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);

    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);

    },


    onMouseDown: function (event) {
        var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
        var lastPoint = this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 2];
        if (lastPoint != null && lastPoint.x != 0) {
            var lpoint = this._map.latLngToLayerPoint(L.latLng(lastPoint.y, lastPoint.x));
            var dis = lpoint.distanceTo(event.layerPoint);
            if (dis < 5) {
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 1, 1);

                this.clickcount = 1;
                this.shapeEditor.stopEditing();
                fastmap.uikit.ShapeEditorController().stopEditing();
                return;
            }
        }
        if (this.snapHandler.snaped == true) {
            mousePoint = this.targetPoint;
        }
        if (this.clickcount == 1) {

            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));

        } else {

            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length - 1, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));

        }
        this.clickcount++;
        if (this.snapHandler.snaped == true) {
            mousePoint = this.targetPoint;
            if (this.snapHandler.snapIndex == 0) {
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.snode),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                });
                if (this.clickcount == 2) {
                    this.snodePid = parseInt(this.snapHandler.properties.snode);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.snode);
                }
            } else if (this.snapHandler.snapIndex == -1) {
                this.catches.push({
                    linkPid: parseInt(this.snapHandler.properties.id),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            }

            else {
                if (this.clickcount == 2) {
                    this.snodePid = parseInt(this.snapHandler.properties.enode);
                } else {
                    this.enodePid = parseInt(this.snapHandler.properties.enode);
                }
                this.catches.push({
                    nodePid: parseInt(this.snapHandler.properties.enode),
                    lon: mousePoint.lng,
                    lat: mousePoint.lat
                })
            }

        } else {

        }

        this.shapeEditor.shapeEditorResult.setProperties({
            snodePid: this.snodePid,
            catches: this.catches,
            enodePid: this.enodePid
        });

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';
        var layerPoint = event.layerPoint;

        this.snapHandler.setTargetIndex(0);
        var that = this;
        if (this.snapHandler.snaped == true) {
            this.eventController.fire( this.eventController.eventTypes.SNAPED, {'snaped': true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0])
            this.insertPoint = fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);
            if (this.clickcount > 1) {
                var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
                if (points.length == 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 0, this.insertPoint);
                }
                if (points.length > 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 1, this.insertPoint);
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
        } else {
            this.eventController.fire( this.eventController.eventTypes.SNAPED, {'snaped': false});

            this.insertPoint = fastmap.mapApi.point(this._map.layerPointToLatLng(layerPoint).lng, this._map.layerPointToLatLng(layerPoint).lat);
            if (this.clickcount > 1) {
                var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
                if (points.length == 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 0, this.insertPoint);
                }
                if (points.length > 1) {
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length - 1, 1, this.insertPoint);
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

    },
    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    /***
     * 重新设置节点
     */
    resetVertex: function () {
        if (this.start == true) {
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1);
            this.start = false;
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));

    }

});
;/**
 * Created by zhongxiaoming on 2016/1/4.
 * Class GeometryValidation
 */
fastmap.mapApi.GeometryValidation = L.Class.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.transform = this.options.transform?this.options.transform:null;
    },
    caculationDistance:function(latlngStart, latlngEnd){
        var startPoint = this.transform.lonLat2Mercator(latlngStart.x,latlngStart.y);
        var endPoint = this.transform.lonLat2Mercator(latlngEnd.x,latlngEnd.y);

        return fastmap.mapApi.point(startPoint[0],startPoint[1]).distanceTo(fastmap.mapApi.point(endPoint[0],endPoint[1]));
    }
});

fastmap.uikit.geometryValidation = function(options){
    return new fastmap.mapApi.GeometryValidation(options);
};/**
 * Created by liwanchong on 2015/11/21.
 */

fastmap.uikit.HighLightRender = L.Class.extend({
    initialize: function (layer, options) {
        this.options = options || {};
        this.layer = layer;//高亮的图层
        this.currentEditLayer = null;
        this.highLightFeatures = [];
        this.eventController = fastmap.uikit.EventController();
        var that = this;
        this.eventController.on(this.eventController.eventTypes.TILEDRAWEND, function (e) {
            that.drawHighlight();
        })
    },

    /**
     * 使高亮的dataTips随着地图的变化依然高亮
     * @param id
     * @param feature
     * @param ctx
     */
    drawTips: function (id, feature, ctx) {

        var geom = feature.geometry.coordinates;
        if(geom) {
            var newGeom = [];
            newGeom[0] = (parseInt(geom[0]));
            newGeom[1] = (parseInt(geom[1]));
            if (feature.properties.id == id) {
                if (feature.properties.kind) {  //种别
                    if (feature.properties.type == '1201') {
                        this.layer._drawBackground({
                            ctx: ctx,
                            geo: newGeom,
                            boolPixelCrs: true,
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0.2)',
                            lineWidth: 1,
                            width: 20,
                            height: 20,
                            drawx: -10,
                            drawy: -10
                        });
                    } else if (feature.properties.type == '1203') {
                        this.layer._drawBackground({
                            ctx: ctx,
                            geo: newGeom,
                            boolPixelCrs: true,
                            rotate: (feature.properties.kind - 90) * (Math.PI / 180),
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0.5)',
                            lineWidth: 1,
                            width: 20,
                            height: 20,
                            drawx: -10,
                            drawy: -10
                        });
                    } else {
                        this.layer._drawBackground({
                            ctx: ctx,
                            geo: newGeom,
                            style: null,
                            boolPixelCrs: true,
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0.5)',
                            lineWidth: 1,
                            width: 20,
                            height: 20,
                            drawx: -10,
                            drawy: -10
                        });
                    }
                } else {
                    this.layer._drawBackground({
                        ctx: ctx,
                        geo: newGeom,
                        style: null,
                        boolPixelCrs: true,
                        lineColor: 'rgb(4, 187, 245)',
                        fillColor: 'rgba(4, 187, 245, 0.5)',
                        lineWidth: 1,
                        width: 20,
                        height: 20,
                        drawx: -10,
                        drawy: -10
                    });
                }
            }
        }
    },


    drawHighlight: function (tile) {
        //绘制钱清除高亮
        this._cleanHightlight();
        if (tile) {

        } else {
            for (var item in this.highLightFeatures) {
                this.currentEditLayer = fastmap.uikit.LayerController().getLayerById(this.highLightFeatures[item].layerid);
                for (var tile in this.currentEditLayer.tiles) {
                    for (var feature in this.currentEditLayer.tiles[tile].data) {

                        if (this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.id) {
                            var ctx = {
                                canvas: this.layer._tiles[tile],
                                tile: L.point(tile.split(':')[0], tile.split(':')[1])
                            };
                            var hightlightfeature = this.currentEditLayer.tiles[tile].data[feature];
                            var id = this.highLightFeatures[item].id;
                            if (this.highLightFeatures[item].type == 'line') {
                                this.drawOfLink(id, hightlightfeature, ctx);

                            }
                            else if (this.highLightFeatures[item].type == 'node') {
                                var geo = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[0];
                                this.layer._drawPoint(ctx, geo, {color: 'red', radius: 3}, true);
                            }
                            else if (this.highLightFeatures[item].type == 'speedlimit') {

                                this.drawSpeedLimit(id, hightlightfeature, ctx);

                            } else if (this.highLightFeatures[item].type == 'rdcross') {

                                this.drawCross(id, hightlightfeature, ctx);

                            } else if (this.highLightFeatures[item].type == 'restriction') {

                                this.drawRestrict(id, hightlightfeature, ctx);

                            } else if (this.highLightFeatures[item].type == 'rdlaneconnexity') {
                                this.drawLane(id, hightlightfeature, ctx);
                            } else if (this.highLightFeatures[item].type == 'highSpeedDivergence') {
                                var feature = this.currentEditLayer.tiles[tile].data[feature];
                                this.drawBranch(this.highLightFeatures[item].id, feature, ctx);
                            } else if (this.highLightFeatures[item].type == 'gpsLine') {
                                this.layer._drawLineString(ctx, this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates, true, {
                                    size: 3,
                                    color: '#00F5FF'
                                }, {
                                    size: 3,
                                    color: '#00F5FF'
                                }, this.currentEditLayer.tiles[tile].data[feature].properties);
                            } else if (this.highLightFeatures[item].type == 'workPoint') {
                                var feature = this.currentEditLayer.tiles[tile].data[feature];
                                this.drawTips(this.highLightFeatures[item].id, feature, ctx);
                            } else if (this.highLightFeatures[item].type == 'rdgsc') {
                                var feature = this.currentEditLayer.tiles[tile].data[feature];
                                    cusFeature = this.highLightFeatures[item];
                                this.drawOverpass(this.highLightFeatures[item].id, feature, ctx ,cusFeature);
                            }
                            break;
                        }else if( this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.snode) {
                            var ctxOfSNode = {
                                canvas: this.layer._tiles[tile],
                                tile: L.point(tile.split(':')[0], tile.split(':')[1])
                            };
                            var geoOfSNode = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[0];
                            this.layer._drawPoint(ctxOfSNode, geoOfSNode, {color: 'yellow', radius: 3}, true);
                            break;
                        }else if(this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.enode) {
                            var ctxOfENode = {
                                canvas: this.layer._tiles[tile],
                                tile: L.point(tile.split(':')[0], tile.split(':')[1])
                            };
                            var len = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates.length - 1;
                            var geoOfENode = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[len];
                            this.layer._drawPoint(ctxOfENode, geoOfENode, {color: 'yellow', radius: 3}, true);
                            break;
                        }
                    }
                }
            }
        }

    }

    ,

    /**
     * 高亮link
     * @param id
     * @param feature
     * @param ctx
     */
    drawOfLink: function (id, feature, ctx) {

        var color = null;
        if (feature.hasOwnProperty('properties')) {
            color = feature.properties.style.strokeColor;
        }

        var style = feature.properties.style;

        var geom = feature.geometry.coordinates;
        if (feature.properties.id === id) {
            this.layer._drawLineString(ctx, geom, true, {
                strokeWidth: 3,
                strokeColor: '#00F5FF'
            }, {
                color: '#00F5FF',
                radius: 3
            }, feature.properties);
        } else {
            this.layer._drawLineString(ctx, geom, true, style, {
                color: '#696969',
                radius: 3
            }, feature.properties);
        }

    },

    /**
     * 高亮交限
     * @param id
     * @param feature
     * @param ctx
     */
    drawRestrict: function (id, feature, ctx) {


        if (feature.properties.id == id) {

            if (id !== undefined) {
                var laneObjArr = feature.properties.markerStyle.icon;
                for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {

                    this.layer._drawBackground(
                        {
                            ctx: ctx,
                            geo: laneObjArr[fact].location,
                            boolPixelCrs: true,
                            //rotate: feature.properties.rotate,
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0)',
                            lineWidth: 1,
                            width: 15,
                            height: 15,
                            drawx: -7.5,
                            drawy: -7.5,
                            scalex: 2 / 3,
                            scaley: 2 / 3
                        })

                }
            }
        }



    },

    drawLane: function (id, feature, ctx) {

        if (feature.properties.id == id) {

            if (id !== undefined) {
                var laneObjArr = feature.properties.markerStyle.icon;
                for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {

                    this.layer._drawBackground(
                        {
                            ctx: ctx,
                            geo: laneObjArr[fact].location,
                            boolPixelCrs: true,
                            rotate: feature.properties.rotate* (Math.PI / 180),
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0)',
                            lineWidth: 1,
                            width: 10,
                            height: 20,
                            drawx: -5,
                            drawy: -10,
                            scalex: 2 / 3,
                            scaley: 2 / 3
                        })

                }
            }
        }
    },
    drawSpeedLimit: function (id, feature, ctx) {

        var type = feature.geometry.type;
        var geom = feature.geometry.coordinates;
        if (feature.properties.id == id) {
            if (type == "Point") {

                var newGeom = [];

                newGeom[0] = (parseInt(geom[0]));
                newGeom[1] = (parseInt(geom[1]));

                this.layer._drawBackground({
                    ctx: ctx,
                    geo: newGeom,
                    boolPixelCrs: true,
                    lineColor: 'rgb(4, 187, 245)',
                    fillColor: 'rgba(4, 187, 245, 0.5)',
                    lineWidth: 1,
                    width: 20,
                    height: 20,
                    drawx: -10,
                    drawy: -10
                })

            }
        }

    },

    drawBranch: function (id, feature, context) {

        var geom = feature.geometry.coordinates;
        if (feature.properties.id && feature.properties.id == id) {

            var newGeom = [];
            newGeom[0] = (parseInt(geom[0]));
            newGeom[1] = (parseInt(geom[1]));

            this.layer._drawBackground({
                ctx: context,
                geo: newGeom,
                boolPixelCrs: true,

                lineColor: 'rgb(4, 187, 245)',
                fillColor: 'rgba(4, 187, 245, 0.5)',
                lineWidth: 1,
                width: 30,
                height: 30,
                drawx: -15,
                drawy: -15
            })

        }

    },
    drawCross: function (id, feature, ctx) {
        if (feature.properties.id == id) {
            if (feature.properties.id === undefined) {
                return;
            }
            for (var j in feature.geometry.coordinates) {
                var geo = feature.geometry.coordinates[j];
                this.layer._drawBackground({
                    ctx: ctx,
                    geo: geo,
                    boolPixelCrs: true,
                    lineColor: 'rgb(4, 187, 245)',
                    fillColor: 'rgba(4, 187, 245, 0.5)',
                    lineWidth: 1,
                    width: 6,
                    height: 6,
                    drawx: -3,
                    drawy: -3

                })
            }

        }

    },
    /**
     * 高亮立交
     * @param id
     * @param feature
     * @param ctx
     */
    drawOverpass: function (id, feature, ctx ,cusFeature) {

        var COLORTABLE = ['#33FFFF','#3399FF','#3366CC','#333366','#330000'];

        var color = null;
        if (feature.hasOwnProperty('properties')) {
            color = feature.properties.c;
        }

        var style = this.layer.styleFor(feature, color);

        var geom = feature.geometry.coordinates;
        if (feature.properties.id === id) {
            var cusStyle = {
                strokeWidth: 3,
                strokeColor: '#00F5FF'
            };
            /*如果有层级关系和自定义粗细则不使用默认值*/
            if(cusFeature){
                cusStyle.strokeWidth = cusFeature.style.strokeWidth ? cusFeature.style.strokeWidth : 3;
                cusStyle.strokeColor = cusFeature.index ? COLORTABLE[cusFeature.index] : '#00F5FF';
            }
            this.layer._drawLineString(ctx, geom, true, cusStyle, cusStyle, feature.properties);
        } else {
            this.layer._drawLineString(ctx, geom, true, style, {
                color: '#696969',
                radius: 3
            }, feature.properties);
        }

    },
    _cleanHightlight: function () {
        for (var index in this.layer._tiles) {
            this.layer._tiles[index].getContext('2d').clearRect(0, 0, 256, 256);
        }

    }


});;/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class PathVertexInsert
 */

fastmap.mapApi.PathBreak = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();

        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:true,snapLine:true});
        this.snapHandler.enable();
        this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function(){
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },

    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function(event){
        var layerPoint = event.layerPoint;
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }

        if(this.snapHandler.snaped == true){
            layerPoint = this._map.latLngToLayerPoint(this.targetPoint);
            this.resetVertex(layerPoint);
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({changeTooltips:true});
            this.disable();
        }

    },

    onMouseMove: function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped == true){
            this.shapeEditor.fire('snaped',{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.shapeEditor.fire('snaped',{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    resetVertex:function(layerPoint){

        var index = 0
        var segments = this.shapeEditor.shapeEditorResult.getFinalGeometry().getSortedSegments();
        for(var i = 0,len = segments.length; i< len; i++){
            var distance =  L.LineUtil.pointToSegmentDistance(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2)))
            if(distance < 5){
                latlng =this._map.layerPointToLatLng(L.LineUtil.closestPointOnSegment(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2))));
                index = i;
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(index+1,0,fastmap.mapApi.point(latlng.lng, latlng.lat))

                this.shapeEditor.shapeEditorResult.setFinalGeometry(this.shapeEditor.shapeEditorResult.getFinalGeometry());
            }
        }


    }

});
;/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathCopy
 */

fastmap.mapApi.PathCopy = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },


    onMouseDown: function () {
        //获取元素
        //
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    }

})
;/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathCut
 */
fastmap.mapApi.PathCut = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.targetGeo=null;
        this.copypoints = [];
        this.borderpoint=null;
        this.borderclick=false;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        //.components
        var geos = this.shapeEditor.shapeEditorResult.getFinalGeometry();

        outer:for (var j = 0, len = geos.length; j < len; j++) {
            inner:for(var i=0;i<geos[j].components.length;i++){
                //var disAB = this.distance(this._map.latLngToLayerPoint([geos[j].components[i].y,geos[j].components[i].x]), layerPoint);
                //if (disAB < 5) {
                //    this.targetIndex = i;
                //    this.targetGeo=j;
                //    this.borderclick=false;
                //    break outer;
                //
                //}
                //判断到直线的距离也可以
                if(i<geos[j].components.length-1){
                    var points1=this._map.latLngToLayerPoint([geos[j].components[i].y,geos[j].components[i].x]);
                    var points2=this._map.latLngToLayerPoint([geos[j].components[i+1].y,geos[j].components[i+1].x]);
                    var pointsm=layerPoint;

                    if(points1.x==points2){
                        var len=Math.abs(pointsm.x-points1.x);
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }else if(points1.y==points2.y){//这样就得计算了
                        var len=Math.abs(pointsm.y-points1.y);
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }else{
                        var k=(points1.y-points2.y)/(points1.x-points2.x);
                        //var k_1=-1/k;
                        var xr=((pointsm.x/k)+k*points1.x-points1.y+pointsm.y)/(1/k+k);
                        var yr=k*(xr-points1.x)+points1.y;

                        var len=Math.sqrt( Math.pow( (xr-pointsm.x) ,2 ) + Math.pow( (yr-pointsm.y) ,2) )
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }

                }


            }

        }

        //var line = fastmap.mapApi.lineString([fastmap.mapApi.point(116.391083,39.907333),fastmap.mapApi.point(116.394083,39.909333),fastmap.mapApi.point(116.391083,39.902333),fastmap.mapApi.point(116.396083,39.902933)]);

        //var arraytmp=[line,line1];
        //geos.push(line);
        //{index:this.targetIndex}
        //this.shapeEditor.shapeEditorResult.setFinalGeometry(geos);
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }
        this.resetVertex(layerPoint);//{index:this.targetIndex}
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseUp: function(event){
        this.targetIndex = null;
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        fastmap.uikit.ShapeEditorController().stopEditing();
        console.log("cut");
    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },
    /***
     * 重新设置节点
     */
    resetVertex:function(apoint){
        //this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        //var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;

        var points=this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeo].components;


        var aimPixPoint=this._map.latLngToLayerPoint([points[this.targetIndex].y,points[this.targetIndex].x]);
        var offsetx;
        var offsety;
        offsetx=apoint.x-this.borderpoint.x;
        offsety=apoint.y-this.borderpoint.y;
        //this.borderpoint.x+=offsetx;
        //this.borderclick.y+=offsety;
        this.borderpoint=apoint;
        //alert(this.borderclick);
        //if(this.borderclick==false){
        //    offsetx=apoint.x-aimPixPoint.x;
        //    offsety=apoint.y-aimPixPoint.y;
        //}else{
        //    offsetx=apoint.x-this.borderpoint.x;
        //    offsety=apoint.y-this.borderpoint.y;
        //    //this.borderpoint.x+=offsetx;
        //    //this.borderclick.y+=offsety;
        //    this.borderpoint=apoint;
        //}


        //console.log(points);
        var newpointsArray=new Array();
        for(var i=0;i<points.length;i++){
            //var latlngpoint=this._map.layerPointToLatLng(points[i]);
            var pointB=this._map.latLngToLayerPoint([points[i].y,points[i].x]);
            var pointc=this._map.layerPointToLatLng([(pointB.x+offsetx),(pointB.y+offsety)]);
            var pointd=fastmap.mapApi.point(pointc.lng,pointc.lat);

            //console.log(points[i]);
            newpointsArray.push(pointd);
            this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeo].components.splice(i, 1, pointd);

        }
        //for(var i=0)
        //var line1= fastmap.mapApi.lineString(newpointsArray);
        //var line = fastmap.mapApi.lineString([fastmap.mapApi.point(116.391083,39.907333),fastmap.mapApi.point(116.394083,39.909333),fastmap.mapApi.point(116.391083,39.902333),fastmap.mapApi.point(116.396083,39.902933)]);
        //
        //var arraytmp=[line,line1];
        //this.shapeEditor.shapeEditorResult.setFinalGeometry(arraytmp);

    }



});/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathMove
 */

fastmap.mapApi.PathMove = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.targetGeo=null;
        this.copypoints = [];
        this.borderpoint=null;
        this.borderclick=false;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },
    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        //.components
        var geos = this.shapeEditor.shapeEditorResult.getFinalGeometry();

        outer:for (var j = 0, len = geos.length; j < len; j++) {
            inner:for(var i=0;i<geos[j].components.length;i++){
                //判断到直线的距离也可以
                if(i<geos[j].components.length-1){
                    var points1=this._map.latLngToLayerPoint([geos[j].components[i].y,geos[j].components[i].x]);
                    var points2=this._map.latLngToLayerPoint([geos[j].components[i+1].y,geos[j].components[i+1].x]);
                    var pointsm=layerPoint;

                    if(points1.x==points2){
                        var len=Math.abs(pointsm.x-points1.x);
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }else if(points1.y==points2.y){//这样就得计算了
                        var len=Math.abs(pointsm.y-points1.y);
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }else{
                        var k=(points1.y-points2.y)/(points1.x-points2.x);
                        //var k_1=-1/k;
                        var xr=((pointsm.x/k)+k*points1.x-points1.y+pointsm.y)/(1/k+k);
                        var yr=k*(xr-points1.x)+points1.y;

                        var len=Math.sqrt( Math.pow( (xr-pointsm.x) ,2 ) + Math.pow( (yr-pointsm.y) ,2) )
                        if(len<5){
                            this.targetIndex = i;
                            this.targetGeo=j;
                            this.borderpoint=layerPoint;
                            this.borderclick=true;
                            break outer;

                        }
                    }

                }


            }

        }

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }
        this.resetVertex(layerPoint);//{index:this.targetIndex}
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseUp: function(event){
        this.targetIndex = null;
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        fastmap.uikit.ShapeEditorController().stopEditing();
        console.log("cut");
    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(apoint){

        var points=this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeo].components;


        var aimPixPoint=this._map.latLngToLayerPoint([points[this.targetIndex].y,points[this.targetIndex].x]);
        var offsetx;
        var offsety;
        offsetx=apoint.x-this.borderpoint.x;
        offsety=apoint.y-this.borderpoint.y;
        this.borderpoint=apoint;

        //console.log(points);
        var newpointsArray=[];
        for(var i=0;i<points.length;i++){
            //var latlngpoint=this._map.layerPointToLatLng(points[i]);
            var pointB=this._map.latLngToLayerPoint([points[i].y,points[i].x]);
            var pointc=this._map.layerPointToLatLng([(pointB.x+offsetx),(pointB.y+offsety)]);
            var pointd=fastmap.mapApi.point(pointc.lng,pointc.lat);

            //console.log(points[i]);
            newpointsArray.push(pointd);
            this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeo].components.splice(i, 1, pointd);

        }

    }


});/**
 * Created by zhongxiaoming on 2016/1/13.
 * Class PathNodeMove
 */

fastmap.mapApi.PathNodeMove = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:false});
        this.snapHandler.enable();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().coordinates;

        for (var j = 0, len = points.length; j < len; j++) {

            for(var k= 0,length = points[j].components.length; k<length; k++){

                var disAB = this.distance(this._map.latLngToLayerPoint([points[j].components[k].y,points[j].components[k].x]), layerPoint);

                if (disAB > 0 && disAB < 5) {

                    this.targetIndexs.push(j+"-"+k);

                }

            }


        }
        this.targetIndex = this.targetIndexs.length;
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function (event) {

        this.container.style.cursor = 'pointer';

        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.containerPoint;
        if(this.targetIndex == 0){
            return;
        }
        this.targetIndex = this.targetIndexs.length;
        this.targetPoint = event.latlng;

        for(var i in this.targetIndexs){
            this.resetVertex(this.targetIndexs[i],this.targetPoint);
        }
        var node = this.selectCtrl.selectedFeatures;
        this.selectCtrl.selectedFeatures = {id:node.id,latlng:this.targetPoint}

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseUp: function(event){
        this.targetIndex = 0;
        this.snapHandler.setTargetIndex(this.targetIndex);
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(index ,targetPoint){

        this.shapeEditor.shapeEditorResult.getFinalGeometry().coordinates[index.split('-')[0]].components.splice(index.split('-')[1], 1, fastmap.mapApi.point(targetPoint.lng, targetPoint.lat));
    }
});/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathSmooth
 */
fastmap.mapApi.PathSmooth = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
    },


    onMouseDown: function () {
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    }

});/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexAdd
 */

fastmap.mapApi.PathVertexAdd = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        var points = null;
        this._map._container.style.cursor = 'pointer';
        this.startPoint = null;
        this.endPoint = null;
        this.insertPoint = null;
        this.start = false;
        this.end = false;
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
        this._map.on('dblclick', this.onDbClick, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
        this._map.off('dblclick', this.onDbClick, this);
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },


    onMouseDown: function (event) {
        var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
        if(this.start == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            this.startPoint =  fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)
        }else{
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            this.endPoint =  fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)
        }


        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';

        //if (this._mapDraggable) {
        //    this._map.dragging.disable();
        //}
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;


        var disStart = this.distance(this._map.latLngToLayerPoint([this.startPoint.y, this.startPoint.x]), layerPoint);
        var disEnd = this.distance(this._map.latLngToLayerPoint([this.endPoint.y, this.endPoint.x]), layerPoint);

        this.insertPoint =  fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);

        if (disStart < disEnd) {
            this.targetIndex = 0;

            if(this.end == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1,1);
            }

            if(this.start == false && this.end ==false){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,0,this.insertPoint);
            }

            if(this.end == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,0,this.insertPoint);
            }
            if(this.end ==false)
            {
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1,this.insertPoint);
            }
            //this.startPoint = this.insertPoint;
            this.start = true;
            this.end = false;
        } else {
            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1);
            }
            this.targetIndex = this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length;
            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex,0,this.insertPoint);
            }
            else{
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex-1,1,this.insertPoint);
            }


            //this.endPoint = this.insertPoint;
            this.start = false;
            this.end = true;
        }


        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },

    onDbClick: function (event) {
        if(this.start == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1,this.insertPoint)
        }
        if(this.end == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length,1,this.insertPoint)
        }
        this.shapeEditor.stopEditing();
    },
    /***
     * 重新设置节点
     */
    resetVertex:function(){



            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1);
                this.start = false;
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
            }

            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));

    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }

});
;/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class PathVertexInsert
 */

fastmap.mapApi.PathVertexInsert = L.Handler.extend({


    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:true,snapLine:true});
        this.snapHandler.enable();
        this.eventController = fastmap.uikit.EventController();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function(){
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },

    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function(event){
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        if(this.snapHandler.snaped == true){
            //var layerPoint = event.layerPoint;
            this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({changeTooltips:true});
        }

    },

    onMouseMove: function(event){

        this.snapHandler.setTargetIndex(0);
        var that = this;
        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    resetVertex:function(layerPoint){

        var index = 0;
        var segments = this.shapeEditor.shapeEditorResult.getFinalGeometry().getSortedSegments();
        for(var i = 0,len = segments.length; i< len; i++){
            var distance =  L.LineUtil.pointToSegmentDistance(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2)))
            if(distance < 5){
                latlng =this._map.layerPointToLatLng(L.LineUtil.closestPointOnSegment(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2))));
                index = i;
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(index+1,0,fastmap.mapApi.point(latlng.lng, latlng.lat))

                this.shapeEditor.shapeEditorResult.setFinalGeometry(this.shapeEditor.shapeEditorResult.getFinalGeometry());
            }
        }


    }

});
;/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexMove
 */

fastmap.mapApi.PathVertexMove = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.interLinks = [];
        this.interNodes = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:true});
        this.snapHandler.enable();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;

        for (var j = 0, len = points.length; j < len; j++) {
            var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), layerPoint);
            if (disAB < 5) {
                this.targetIndex = j;
            }
        }
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }

        var that = this;

        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.snapHandler.targetIndex = this.targetIndex;
            this.selectCtrl.setSnapObj(this.snapHandler);
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])

        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});

        }

        that.resetVertex(layerPoint);

        that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});
    },

    contains:function(obj,arr){
        for(var item in arr){
            if(arr[item].nodePid == obj.nodePid){
                arr.splice(item,1,obj);
                return true;
            }
        }

        return false;
    },
    onMouseUp: function(event){
        this.targetIndex = null;
        this.snapHandler.setTargetIndex(this.targetIndex);

        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        var nodePid = null;
        if(this.snapHandler.snaped == true){
            if(this.snapHandler){
                if(this.snapHandler.targetIndex == 0){
                    nodePid = this.selectCtrl.selectedFeatures.snode;
                }else if(this.snapHandler.targetIndex == this.selectCtrl.selectedFeatures.geometry.components.length-1) {
                    nodePid = this.selectCtrl.selectedFeatures.enode;
                }else{
                    nodePid = null;
                }
            }

            if(this.snapHandler.selectedVertex == true){
                if(this.interNodes.length==0 ||!this.contains(nodePid,this.interNodes)){
                if(this.snapHandler.snapIndex == 0){

                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.snode),nodePid:nodePid});
                }else{
                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.enode),nodePid:nodePid});
                }
                }


            }else{
                if(this.interLinks.length ==0 || !this.contains({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid},this.interLinks )){
                    this.snapHandler.interLinks.push({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid});
                }


            }

            if(nodePid == null){
                this.snapHandler.interNodes = [];
                this.snapHandler.interLinks = [];
            }
        }
    },

    //两点之间的距离
     distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(){
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        //var distance =0 , distance1 = this.targetIndex!=0?0:this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex-1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]),
        //distance2 = this.targetIndex!=this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1?this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex+1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]):0;
        //distance = distance1<distance2?distance1:distance2
        //if(distance < 2){
        //    console.log('形状点之间距离不能小于2米！')
        //}

    }
});/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexRemove
 */

fastmap.mapApi.PathVertexRemove = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:true});
        this.snapHandler.enable();
        this.eventController = fastmap.uikit.EventController();
    },
    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;

        for (var j = 0, len = points.length; j < len; j++) {

            //两个端点不能删除
            if(j != 0 && j !=len-1){
                var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), layerPoint);

                if (disAB > 0 && disAB < 5) {


                    this.targetIndex = j;
                }
            }

        }
        if(this.targetIndex == null)
            return;
        this.resetVertex(this.targetIndex);
        this.snapHandler.setTargetIndex(this.targetIndex);
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';

        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;

        for (var j = 0, len = points.length; j < len; j++) {

            //两个端点不能删除
            if(j != 0 && j !=len-1){
                var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), layerPoint);

                if (disAB > 0 && disAB < 5) {


                    this.targetIndex = j;
                }
            }

        }


        this.snapHandler.setTargetIndex(this.targetIndex);
        var that = this;
        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0]);
            that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});
        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            that.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }


    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(){
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1);
        this.targetIndex = null;
    }
});/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class PointVertexAdd
 */
fastmap.mapApi.PointVertexAdd = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        //this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.eventController = fastmap.uikit.EventController();
        this.snapHandler = new fastmap.mapApi.Snap({
            map:this._map,
            shapeEditor:this.shapeEditor,
            selectedSnap:false,
            snapLine:true,
            snapNode:false,
            snapVertex:false
        });
        this.snapHandler.enable();
        //this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on('click', this.onMouseDown, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        this.resetVertex(this.targetPoint);
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function () {
        this.container.style.cursor = 'pointer';
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped){
            this.shapeEditor.fire('snaped',{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.selectCtrl.selectedFeatures = this.snapHandler.properties;
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.shapeEditor.fire('snaped',{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },
    onMouseUp: function () {
    },

    resetVertex:function(latlng){
        this.shapeEditor.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(latlng.lng, latlng.lat));
        this.eventController.fire(this.eventController.eventTypes.RESETCOMPLETE,
            {
                'property':this.snapHandler.properties,
                'geometry':this.snapHandler.coordinates
            }
        );
    }
});/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PointVertexMove
 */

fastmap.mapApi.PointVertexMove = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this._map._container.style.cursor = 'pointer';
        this.options = options || {};
        L.setOptions(this, options);
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function () {
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }
});/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorFactory
 */

fastmap.mapApi.ShapeEditorFactory =  L.Class.extend({

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.toolObjs = this.CreateShapeToolsObject(this.options.shapeEditor);
            },

            CreateShapeToolsObject: function (shapeEditor) {
                var toolsObject = {
                    'drawPath': new fastmap.mapApi.DrawPath({shapeEditor:shapeEditor}),
                    'drawAdLink': new fastmap.mapApi.DrawPath({shapeEditor:shapeEditor}),
                    'drawPolygon': new fastmap.mapApi.DrawPolygon({shapeEditor:shapeEditor}),
                    'pathCopy': new fastmap.mapApi.PathCopy({shapeEditor:shapeEditor}),
                    'pathCut': new fastmap.mapApi.PathCut({shapeEditor:shapeEditor}),
                    'pathVertexInsert': new fastmap.mapApi.PathVertexInsert({shapeEditor:shapeEditor}),
                    'pathVertexMove': new fastmap.mapApi.PathVertexMove({shapeEditor:shapeEditor}),
                    'pathVertexReMove': new fastmap.mapApi.PathVertexRemove({shapeEditor:shapeEditor}),
                    'pathVertexAdd': new fastmap.mapApi.PathVertexAdd({shapeEditor:shapeEditor}),
                    'pathBreak': new fastmap.mapApi.PathBreak({shapeEditor:shapeEditor}),
                    'transformDirect':new fastmap.mapApi.TransformDirection({shapeEditor:shapeEditor}),
                    'pathNodeMove':new fastmap.mapApi.PathNodeMove({shapeEditor:shapeEditor}),
                    'pointVertexAdd':new fastmap.mapApi.PointVertexAdd({shapeEditor:shapeEditor}),
                    'addAdAdmin':new fastmap.mapApi.adAdminAdd({shapeEditor:shapeEditor}),
                    'adAdminMove':new fastmap.mapApi.adAdminMove({shapeEditor:shapeEditor})
                };
                return toolsObject;
            }
        });

fastmap.mapApi.shapeeditorfactory = function (options) {
    return new fastmap.mapApi.ShapeEditorFactory(options);
}
;/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class ShapeEditorResult
 */

fastmap.mapApi.ShapeEditorResult = L.Class.extend({
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.originalObject = null;
        this.final=null;
        this.original=null;
        this.properties = null;
    },
    /***
     * 当前编辑几何对象属性信息
     * @param obj
     */
    setProperties:function(obj){
        this.properties = obj;
    },
    getProperties:function(){
        return this.properties;
    },
    setOriginalObject: function (value) {
        this.originalObject = value;
    },

    getOriginalObject: function () {
        return this.originalObject;
    },

    setOriginalGeometry: function (value) {
        this.original = value;
    },

    getOriginalGeometry: function () {
        return this.original;
    },

    setFinalGeometry: function (value) {
        this.final = value;
    },

    getFinalGeometry: function () {
        return this.final;
    }

})
;/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorResultFeedback
 */

fastmap.mapApi.ShapeEditResultFeedback = L.Class.extend({


    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);

        this.eventController = fastmap.uikit.EventController();
        this.tooltip = {};
        this.map = {};
    },

    /***
     *开始编辑
     * @param {Object}data
     * @constructor
     */
    setupFeedback: function (data) {
        this.eventController.fire(this.eventController.eventTypes.STARTSHAPEEDITRESULTFEEDBACK, data);
    },

    /***
     * 放弃编辑
     */
    abortFeedback: function(data){
        this.eventController.fire(this.eventController.eventTypes.ABORTSHAPEEDITRESULTFEEDBACK, data);
    },

    showTooltip: function () {

    },

    /***
     * 停止编辑
     */
    stopFeedback: function () {
        this.eventController.fire(this.eventController.eventTypes.STOPSHAPEEDITRESULTFEEDBACK);
    }
})
;/**
 * Created by zhongxiaoming on 2015/12/14.
 * Class Snap
 * SnapPoint or SnapLine
 */
fastmap.mapApi.Snap = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.interLinks = [];
        this.interNodes = [];
        this._map = this.options.map;
        this.snapIndex = -1;
        this.shapeEditor = this.options.shapeEditor;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.snapVertex = this.options.snapVertex == true ? this.options.snapVertex : false;
        this.snapNode = this.options.snapNode == true ? this.options.snapNode : false;
        this.snapLine = this.options.snapLine == true ? this.options.snapLine : false;
        this.selectedSnap = this.options.selectedSnap == true ? this.options.selectedSnap : false;
        //鼠标点位，按瓦片坐标计算
        this.point = null;
        this.selectedLink = null;
        this._guides = [];
        this.snaped = false;
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousemove', this.onMouseMove, this);
    },
    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousemove', this.onMouseMove, this);
    },
    addGuideLayer: function (layer) {
        for (var i = 0, n = this._guides.length; i < n; i++)
            if (L.stamp(layer) === L.stamp(this._guides[i]))
                return;
        this._guides.push(layer);
    },

    setTargetIndex: function (index) {
        this.targetindex = index;
    },

    setSelectedLink: function (link) {
        this.selectedLink = link;
    },
    setSnapOptions: function (obj) {
        if(obj.snapVertex){
            this.snapVertex = obj.snapVertex;
        }
        if(obj.snapNode){
            this.snapNode = obj.snapNode;
        }
        if(obj.snapLine){
            this.snapLine = obj.snapLine;
        }
    },
    getSnapOptions:function() {
        var obj = {};
        obj.snapVertex = this.snapVertex;
        obj.snapNode = this.snapNode;
        obj.snapLine = this.snapLine;
        return obj;
    },
    onMouseMove: function (event) {

        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        if (this.targetindex == null) {
            return;
        }
        var latlng = event.latlng;
        var pixels = this.transform.lonlat2Pixel(latlng.lng, latlng.lat, this._map.getZoom());
        //根据鼠标点计算所在的瓦片坐标
        var tiles = this.transform.lonlat2Tile(latlng.lng, latlng.lat, this._map.getZoom());

        var tilePixcel = new fastmap.mapApi.Point(pixels[0] - tiles[0] * 256, pixels[1] - tiles[1] * 256);

        for (var layerindex in this._guides) {
            this.currentTileData = this._guides[layerindex].tiles[tiles[0] + ':' + tiles[1]];
            if (this.currentTileData&&this.currentTileData.data&&this.currentTileData.data) {

                var closest = this.closeestLineSnap(this._map, this.currentTileData.data, tilePixcel, 10, this.snapVertex, this._guides[layerindex].selectedid);
                if (closest) {
                    this.snaped = true;
                    this.properties = closest.properties;
                    this.snapIndex = closest.index;
                    this.coordinates = closest.layer;
                    this.selectedVertex = closest.selectedVertexe;
                    this.snapLatlng = this.transform.PixelToLonlat(closest.latlng[0] + tiles[0] * 256, closest.latlng[1] + tiles[1] * 256, this._map.getZoom());
                    break;
                } else {
                    //this.selectedVertex = closest.selectedVertexe;
                    this.snaped = false;

                }
            }
        }
    },

    setPoint: function (point) {
        this.point = point;
    },

    enable: function () {
        this.disable();
        this.addHooks();
    },


    closeestLineSnap: function (map, data, point, tolerance, withVertices, selectedid) {
        tolerance = typeof tolerance == 'number' ? tolerance : Infinity;
        withVertices = typeof withVertices == 'boolean' ? withVertices : true;
         var result = this.closestLine(map, data, point, selectedid);
        if (!result || result.distance > tolerance)
            return null;
        var isSnapVertices = false;

        //If snapped layer is linear, try to snap on vertices (extremities and middle points)
        if (withVertices /**&& typeof result.layer.getLatLngs == 'function'**/) {

            var closest = this.closest(map, result.layer, result.latlng, withVertices);
            if (closest.distance < tolerance) {
                result.latlng = closest;
                result.distance = point.distanceTo(new fastmap.mapApi.Point(closest[0], closest[1]));
                result.index = closest.index;
                result.selectedVertexe = true;
                isSnapVertices = true;
            }
        }

        if (!this.snapLine && isSnapVertices == false) {
            return null;
        }

        return result;
    },

    closestLine: function (map, data, point, selectedid) {
        var mindist = Infinity,
            result = null,
            ll = null,
            distance = Infinity;

        for (var i = 0, n = data.length; i < n; i++) {
            if (this.selectedSnap) {
                if (selectedid == data[i].properties.id) {
                    var layer = data[i].geometry.coordinates;

                    ll = this.closest(map, layer, point);
                    if (ll) distance = ll.distance.distance;  // Can return null if layer has no points.
                    if (distance < mindist) {
                        mindist = distance;
                        result = {
                            layer: layer,
                            latlng: [ll.x, ll.y],
                            distance: distance,
                            properties: data[i].properties
                        };
                    }
                }
            } else {
                var layer = data[i].geometry.coordinates;

                ll = this.closest(map, layer, point);
                if (ll) distance = ll.distance.distance;  // Can return null if layer has no points.
                if (distance < mindist) {
                    mindist = distance;
                    result = {
                        layer: layer,
                        latlng: [ll.x, ll.y],
                        index: ll.index,
                        distance: distance,
                        properties: data[i].properties
                    };
                }
            }


        }
        return result;
    },

    closest: function (map, layer, p, vertices) {
        if (typeof layer.getLatLngs != 'function')

            var latlngs = layer,
                mindist = Infinity,
                result = null,
                i, n, distance;

        // Lookup vertices
        if (vertices) {
            for (i = 0, n = latlngs.length; i < n; i++) {
                if (this.snapNode) {
                    if (i == 0 || i == n - 1) {
                        var ll = latlngs[i];
                        var point = new fastmap.mapApi.Point(ll[0], ll[1]);

                        distance = point.distanceTo(new fastmap.mapApi.Point(p[0], p[1]));
                        if (distance < mindist) {
                            mindist = distance;
                            result = ll;
                            result.distance = distance;
                            result.index = i;
                        }
                    }
                } else {
                    var ll = latlngs[i][0];
                    var point = new fastmap.mapApi.Point(ll[0], ll[1]);

                    distance = point.distanceTo(new fastmap.mapApi.Point(p[0], p[1]));
                    if (distance < mindist) {
                        mindist = distance;
                        result = ll;
                        result.index = i;
                        result.distance = distance;
                    }
                }

            }
            return result;
        }

        if (layer instanceof L.Polygon) {
            latlngs.push(latlngs[0]);
        }

        // Keep the closest point of all segments
        for (i = 0, n = latlngs.length; i < n - 1; i++) {

            var latlngA = latlngs[i],
                latlngB = latlngs[i + 1];

            var line = new fastmap.mapApi.LineString([new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1])])
            distance = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1]));

            if (distance.distance <= mindist) {
                mindist = distance.distance;

                result = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1]));
                result.distance = distance;
                result.index = -1;
            }
        }
        return result;
    }

});;/**
 * Created by lwc on 2015/12/22.
 */
fastmap.mapApi.TransformDirection = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.flag = this.shapeEditor.shapeEditorResult.getFinalGeometry().flag;
        this.type=this.shapeEditor.shapeEditorResult.getFinalGeometry().type;
        this.angle = this.shapeEditor.angle;
        this.sign = 0;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
    },

    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        var geos = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var point = this._map.latLngToContainerPoint([geos.point.y, geos.point.x]);
        var orientation = geos.orientation;
        var len = this.distance(layerPoint, point);
        if(len<100) {
            if(this.type==="intRticMarker"){
                switch (orientation) {
                    case "1":
                        if(this.sign===0) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";//向左
                        }else if(this.sign===1) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";//向右
                            this.sign = 0;
                        }
                        break;
                    case "2":
                        if(this.flag) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                        }else{
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";
                        }

                        break;
                }
            }else{
                switch (orientation) {
                    case "1":
                        if(this.sign===0) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "3";//向左
                        }else if(this.sign===1) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";//向右
                            this.sign = 0;
                        }
                        break;
                    case "2":
                        if(this.flag) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                        }else{
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "3";
                        }

                        break;
                    case "3":
                        if(this.flag) {
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                            this.sign = 1;
                        }else{
                            this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";

                        }
                        break;


                }
            }
            }

        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
    },
    onMouseUp: function(event){
        this.targetIndex = null;

        fastmap.uikit.ShapeEditorController().stopEditing();
    },

    drawFeedBack: function () {
    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }

});/**
 * Created by zhongxiaoming on 2016/3/17.
 * Class EventTypes
 */
L.Mixin.EventTypes={
    //为避免冲突，事件类型需要定义为不同值
    GETLINKID:'getLinkId',
    LAYERONADD:'layerOnAdd',
    LAYERONREMOVE:'layerOnRemove',
    LAYERONSWITCH:'layerSwitch',
    LAYERONSHOW:'layerOnShow',
    LAYERONEDIT:'layerOnEdit',
    GETRELATIONID:'getRelationId',

    GETOUTLINKSPID:'getOutLinksPid',
    GETNODEID:'getNodeId',
    GETCROSSNODEID:'getCorssNodeId',
    GETADADMINNODEID:'getAdAdminNodeId',
    GETTIPSID:'getTipsId',
    FEATURESELECTED:'featureSelected',
    FEATURECLEARED:'featureCleared',

    RESETCOMPLETE:'resetComplete',
    GETBOXDATA:'dataOfBoxEvent',

    DIRECTEVENT:'directEvent',
    TILEDRAWEND:'tileDrawend',

    SNAPED:'snaped',
    STARTSHAPEEDITRESULTFEEDBACK:'startshapeeditresultfeedback',
    ABORTSHAPEEDITRESULTFEEDBACK:'abortshapeeditresultfeedback',
    STOPSHAPEEDITRESULTFEEDBACK:'stoptshapeeditresultfeedback',

    SELECTBYATTRIBUTE:"selectByAttribute",//属性选择事件

    SAVEPROPERTY:'saveproperty',//属性面板保存事件
    DELETEPROPERTY:'deleteproperty',//属性面板删除事件
    CANCELEVENT:'cancelevent',//属性面板撤销事件

    SELECTEDFEATURETYPECHANGE:'selectedfeaturetypechange',//objectcontroller选择要素类型变化事件
    SELECTEDFEATURECHANGE:'selectedfeaturechange',//objectcontroller选择要素(pid)变化事件


    CHEKCRESULT:'checkresult'//检查刷新事件

};/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class CheckResultController
 */


fastmap.uikit.CheckResultController=(function() {
    var instantiated;
    function init(options) {
            var checkResultController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,

            options: {
            },

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
               this.eventController = fastmap.uikit.EventController();
                this.options = options || {};
                L.setOptions(this, options);
                this.updateCheck = "";
            },

            /***
             * 开始检查
             * @param {Object}checkObj 检查对象
             * @param {Function}callBack 回调函数
             */
            startCheck:function(checkObj,callBack){

            },

            /***
             * 获得检查结果
             */
            getCheckResult:function(){},
                /**
                 *
                 * @param obj
                 */
            setCheckResult:function(obj) {
                this.eventController.fire(this.eventController.eventTypes.CHEKCRESULT, {errorCheckData:obj },this);
                this.errorCheckData = obj;
            },
            /***
             * 忽略检查结果
             */
            ignore:function(){}


        });
        return new checkResultController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

;/**
 * Created by liwanchong on 2015/9/9.
 * 操作dataTip
 * @namespace fastmap
 * @class DataTipsController 单例
 */

fastmap.uikit.DataTipsController = (function () {
    var instantiated;

    function init() {

        var dataTipsController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,
            /**
             *相关属性
             */
            options: {},
            /**
             *构造函数
             * @class DataTipsController
             * @constructor
             * @namespace  fastmap
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.dataTipsData = {};
                this.on("dataFromScene", this.OnSetDataTips, this);
            },
            OnSetDataTips: function (event) {
                this.setDataTipsData(event.id);
            },
            /**
             * 转换数据
             * @method toDataMode
             */
            toDataMode: function (data) {
                var switchData = {};
                if (data === null || data === undefined) {
                    var outLink = "", info = [];
                    switchData.pid = this.dataTipsData.id;
                    switchData.inLinkPid = this.dataTipsData.id;
                    var arr = this.dataTipsData.o_array;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        var obj = {};
                        obj.flag = arr[i].oInfo;
                        info.push(obj);
                        outLink += arr[i].id;
                    }
                    switchData.restricInfo = info;
                    switchData.outLinkPid = outLink;
                    switchData.flag = 1;
                    switchData.relationshipType = 1;
                    switchData.type = 1;
                    switchData.time = [{startTime: "20121212", endTime: "20121213"}, {
                        startTime: "20141214",
                        endTime: "20141215"
                    }],
                    switchData.vehicleExpression = 14;


                } else {
                    if (data.type === "rdLink") {
                        alert(data.name);
                    } else if (data.type === "tips") {

                    }
                }
            },
            /**
             * 增加数据
             * @method copy
             */
            increase: function (data) {

            },
            /**
             *
             * @param data
             */
            setDataTipsData: function (data) {
                this.dataTipsData = data;
            },
            /**
             *
             * @returns {null|*}
             */
            getDataTipsData: function () {
                var data = this.dataTipsData;
                return data;
            }
        });


        return new dataTipsController();
    }

    return function () {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();



;/**
 * Created by liwanchong on 2015/9/9.
 * 元素类型
 * @namespace fast
 * @class FeatCodeController 单例
 */


fastmap.uikit.FeatCodeController=(function() {
    var instantiated;
    function init(options) {
            var featCodeController = L.Class.extend({
            /**
             * 相关属性
             */
            options: {},
            /**
             * 构造函数
             * @class FeatCodeController
             * @constructor
             * @namespace  fastmap
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
            },
            /**
             * geometry代码的设置
             * @method setFeatCode
             * @param {String}featCode
             */
            setFeatCode: function (featCode) {
                this.newObj = featCode;
            },
            getFeatCode:function() {
                return this.newObj;
            }
        });
        return new featCodeController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

;/**
 * Created by liwanchong on 2015/9/16.
 */


fastmap.uikit.LayerController = (function () {
    var instantiated;

    function init(options) {
        var layerController = L.Class.extend({

            options: {},
            /**
             * @class LayerController
             * @constructor
             * @namespace fastmap.uikit
             * @param {Object}options
             */
            initialize: function (options) {
                this.eventController = fastmap.uikit.EventController();
                this.options = options || {};
                L.setOptions(this, options);
                this.config = this.options.config;
                this.layers = [];
                this.eventController = fastmap.uikit.EventController();
                this.highLightLayersArr = [];
                this.zIndexQueue=[];
                this.maxZIndex=1;
                this.initLayer();
                this.eventController.on(this.eventController.eventTypes.LAYERONADD, this.OnAddLayer, this);
                this.eventController.on(this.eventController.eventTypes.LAYERONREMOVE, this.OnRemoveLayer, this);
                this.eventController.on(this.eventController.eventTypes.LAYERONSWITCH, this.OnSwitchLayer, this);
            },

            initLayer: function () {
                for (var group in this.config) {
                    for (var layer in this.config[group].layers) {
                        if(this.maxZIndex<(this.config[group].layers[layer].options.zIndex)){
                            this.maxZIndex=this.config[group].layers[layer].options.zIndex+1;
                        }
                        var zIndexObj={
                            id:this.config[group].layers[layer].options.id,
                            zIndex:this.config[group].layers[layer].options.zIndex
                        };
                        this.zIndexQueue.push(zIndexObj);

                        this.config[group].layers[layer].options.groupid = this.config[group].groupid;
                        this.layers.push(this.config[group].layers[layer].clazz(this.config[group].layers[layer].url, this.config[group].layers[layer].options));
                    }
                }
            },
            /**
             * 图层显示隐藏转换方法
             * @method pushLayerFront
             * @param id
             */
            pushLayerFront: function (id) {


                this.pushLayerNormal();
                var layer = this.getLayerById(id);
                if(layer!=null){
                    layer.options.zIndex=this.maxZIndex;
                    layer.setZIndex(this.maxZIndex);
                }
                //this.OnSwitchLayer({layerArr: this.layers});
            },
            /**
             * 图层显示隐藏转换方法
             * @method pushLayerNormal
             */
            pushLayerNormal: function () {
                //所有的都先归位，然后再设置最大的。
                for(var i=0;i<this.layers.length;i++){
                    if(this.layers[i].options.zIndex==this.maxZIndex){
                        for(var j=0;j<this.zIndexQueue.length;j++){
                            if(this.zIndexQueue[j].id==this.layers[i].options.id){
                                this.layers[i].options.zIndex=this.zIndexQueue[j].zIndex;
                                this.layers[i].setZIndex(this.zIndexQueue[j].zIndex);
                            }
                        }
                    }
                }
            },
            /**
             * 图层显示隐藏转换方法
             * @method OnSwitchLayer
             * @param event
             */
            OnSwitchLayer: function (event) {
                var layerArr = event.layerArr;
                for (var i = 0, len = layerArr.length; i < len; i++) {
                    this.setLayerVisible(layerArr[i].options.id, layerArr[i].options.visible);


                }

            },
            /**
             * 添加图层
             * @method OnAddLayer
             * @param layer
             * @constructor
             */
            OnAddLayer: function (layer) {
                this.layers.push(layer);
            },
            /**
             * 移除图层
             * @method OnRemoveLayer
             * @param {Layer}layer
             * @constructor
             */
            OnRemoveLayer: function (layer) {

                for(var item in this.layers){
                    if(layer === this.layers[item]){
                        this.layers.splice(item + 1, 1);
                    }
                }

            },
            /**
             * 显示的图层
             * @method setLayerVisible
             * @param {Layer}layer
             * @param flag
             */
            setLayerVisible: function (id, flag) {
                var layer = this.getLayerById(id);
                this.eventController.fire(this.eventController.eventTypes.LAYERONSHOW, {layer: layer, flag: flag});
            },
            /**
             * 可编辑的图层
             * @method editLayer
             * @param {Layer}layer
             */
            setLayerEditable: function (layer) {

                for(var item in this.layers){
                    if(layer === this.layers[item]){
                        this.layers.options. editable = true;
                    }
                }
                this.eventController.fire(this.eventController.eventTypes.LAYERONEDIT, {layer: layer});
            },
            /**
             * 获取layer
             * @method setLayerSelectable
             * @param {String}id
             */
            setLayerSelectable: function (id) {
                this.getLayerById(id);
            },
            /**
             * 获取可见图层
             * @method getVisibleLayers
             * @returns {Array}
             */
            getVisibleLayers: function () {
                var layers = []
                for(var item in this.layers){
                    if(this.layers[item].options.visible == true){
                        layers.push(this.layers[item])
                    }
                }
                return layers;
            },
            /**
             * 根据id获取图层
             * @method getLayerById
             * @param {String}id
             * @returns {L.TileLayer.WMS.defaultWmsParams.layers|*|o.TileLayer.WMS.defaultWmsParams.layers|i.TileLayer.WMS.defaultWmsParams.layers|Array|L.control.layers}
             */
            getLayerById: function (id) {
                var layer = null;
                for(var item in this.layers){
                    if(this.layers[item].options){
                        if(this.layers[item].options.id === id){
                            layer = this.layers[item];
                        }
                    }
                }
                return layer;
            },
            /**
             * 获取选择的图层
             * @method getSelectableLayers
             * @returns {Array}
             */
            getSelectableLayers: function () {
                var layers = [];
                for(var item in this.layers){
                    if(this.layers[item].options.selected == true){
                        layers.push(this.layers[item])
                    }
                }
                return layers;
            },
            highLightLayers:function(highLayer){
                this.highLightLayersArr.push(highLayer);
            },
            removeHighLightLayer:function() {
               for(var i= 0,len=this.highLightLayersArr.length;i<len;i++) {
                   this.highLightLayersArr(i).cleanHighLight();
               }
                this.highLightLayersArr.length = 0;
            },
            /**
             * 获取可编辑的图层
             * @method getEditableLayers
             * @returns {Array}
             */
            getEditableLayers: function () {
                var layers = [];
                for(var item in this.layers){
                    if(this.layers[item].options.editable == true){
                        layers.push(this.layers[item])
                    }
                }
                return layers;
            }

        });
        return new layerController(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();;/**
 * Created by wangtun on 2015/9/10.
 * 属性编辑
 * @namespace  fastmap.uiKit
 * @class ObjectEditController
 *
 */
fastmap.uikit.ObjectEditController = (function () {
    var instantiated;

    function init(options) {
        var objectEditController = L.Class.extend({

            /**
             * 相关属性
             */
            options: {},
            /**
             *构造函数
             * @class ObjectEditController
             * @constructor
             * @namespace  fastmap.uiKit
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.eventController = fastmap.uikit.EventController();
                this.data = {};
                this.originalData = null;
                this.updateObject = "";
                this.nodeObjRefresh = "";
                this.selectNodeRefresh="";
            },
            /**
             * 保存需要编辑的元素的原数据
             *@method save
             */
            save: function () {
                this.onSaved(this.originalData, this.data);
            },
            /**
             * 获得编辑的字段及其内容
             * @method getChanged
             */
            getChanged: function () {

            },
            /**
             * 保存当前元素
             * @method setCurrentObject
             * @param {Object}obj
             * @param type
             * @param options
             */
            setCurrentObject: function (type,obj,options) {
                this.data = null;
                switch(type){
                    case "RDNODE":
                        this.data = fastmap.dataApi.rdNode(obj);
                        if(options) {
                            this.data.linepids = options.linepids;
                            this.data.nodeid = options.nodeid;
                        }
                        break;
                    case "RDLINK":
                        this.data =  fastmap.dataApi.rdLink(obj);
                        break;
                    case "RDRESTRICTION":
                        this.data = fastmap.dataApi.rdRestriction(obj);
                        break;
                    case "RDCROSS":
                        this.data = fastmap.dataApi.rdCross(obj);
                        break;
                    case "RDLANECONNEXITY":
                        this.data = fastmap.dataApi.rdLaneConnexity(obj);
                        break;
                    case "RDSPEEDLIMIT":
                        this.data = fastmap.dataApi.rdSpeedLimit(obj);
                        break;
                    case "RDBRANCH":
                        this.data = fastmap.dataApi.rdBranch(obj);
                        break;
                    case "ADLINK":
                        this.data = fastmap.dataApi.adLink(obj);
                        break;
                    case "ADFACE":
                        this.data = fastmap.dataApi.adFace(obj);
                        break;
                    case "RDGSC":
                        this.data = fastmap.dataApi.rdGsc(obj);
                        break;
                    case "ADADMIN":
                        this.data = fastmap.dataApi.adAdmin(obj);
                        break;
                    case "ADNODE":
                        this.data = fastmap.dataApi.adNode(obj);
                        break;
                    default:
                        throw "无法解析当前选择的类型!";
                        break;
                }

                if(!this.originalData||(this.originalData.geoLiveType != this.data.geoLiveType)){
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE,{"originalData":this.originalData,"currentData":this.data});
                }
                if(!this.originalData||(this.originalData.pid != this.data.pid)){
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURECHANGE,{"originalData":this.originalData,"currentData":this.data});
                }
            },
            /**
             *
             * @param obj
             */
            setOriginalData: function (obj) {
                this.originalData = obj;
            },
            /**
             * 删除地图上元素
             * @method onRemove
             */
            onRemove: function () {

            },
            /**
             * 获取变化的属性值
             * @param oriData
             * @param data
             * @param type
             * @returns {*}
             */
            compareJson: function (pid,oriData, data, type) {
                var retObj = {},n= 0,arrFlag=this.isContainArr(oriData),pids=pid;
                for (var item in oriData) {
                    if (typeof oriData[item] === "string") {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData["rowId"]) {
                                retObj["rowId"] = oriData["rowId"];
                            } else if (oriData["pid"]) {
                                retObj["pid"] = oriData["pid"];
                            }
                            retObj["objStatus"] = type;
                        }
                    } else if (data[item]&&oriData[item]&&oriData[item].constructor == Array&&data[item].constructor==Array) {
                        if (oriData[item].length === data[item].length) {
                            var objArr = [];
                            for (var i = 0, len = oriData[item].length; i < len; i++) {
                                var obj = this.compareJson(pids,oriData[item][i], data[item][i], "UPDATE");
                                if (obj) {
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                if(oriData["linkPid"]){
                                obj["linkPid"]=oriData["pid"];
                                }
                                retObj[item] = objArr;
                            }
                        }else if(oriData[item].length < data[item].length) {
                            var objArr = [];
                            //大于原长度的直接增加，从索引0开始，数组是从第一位开始追加的
                            for(var m=0;m<data[item].length-oriData[item].length;m++){
                                var obj={};
                                if(oriData[item].length==0){
                                    for(var s in data[item][m]){
                                        if(s!="$$hashKey"){
                                            if(s=="linkPid"){
                                                obj[s]=data["pid"];
                                            }else{
                                                obj[s]=data[item][m][s];
                                            }
                                        }
                                    }
                                    if(!obj["linkPid"]){
                                        if (data["rowId"]) {
                                            obj["rowId"] = data["rowId"];
                                        }else if (data["pid"]) {
                                            obj["pid"] = data["pid"];
                                        }
                                    }
                                    delete obj["geoLiveType"];
                                    obj["objStatus"] = "INSERT";
                                    objArr.push(obj);
                                }else{
                                    //var obj = this.compareJson(oriData[item][m], data[item][m], "INSERT");
                                    obj = data[item][m];
                                    obj["objStatus"] = "INSERT";
                                    delete obj["$$hashKey"];
                                    //obj["pid"]=pids;
                                    if (obj) {
                                        if(oriData[item][0]["linkPid"]){
                                            obj["linkPid"]=oriData[item][0]["linkPid"];
                                        }
                                        objArr.push(obj);
                                    }
                                    delete obj["geoLiveType"];
                                }

                            }
                            for(var j=oriData[item].length-1;j>=0;j--){
                                var obj = this.compareJson(oriData[item][j], data[item][j+1], "UPDATE");
                                if (obj) {
                                    if(oriData[item][j]["linkPid"]){
                                        obj["linkPid"]=oriData[item][j]["linkPid"];
                                    }
                                    objArr.push(obj);
                                }
                            }

                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }
                        } else{
                            var objArr = [],indexOfData={},key="linkPid";
                            for (var j= 0,lenJ=data[item].length;j<lenJ;j++) {
                                var obj = {};
                                if(data[item][j]["rowId"]) {
                                    key = "rowId";
                                    obj = {flag: true, index: j};
                                    indexOfData[data[item][j]["rowId"]] = obj;
                                }else if(data["pid"]) {
                                    key = "pid";
                                    obj = {flag: true, index: j};
                                    indexOfData[data[item][j]["pid"]] = obj;
                                }else if(data[item][j]["linkPid"]) {
                                    obj = {flag: true, index: j};
                                    indexOfData[data[item][j]["linkPid"]] = obj;
                                }
                            }
                            for(var k= 0,lenK=oriData[item].length;k<lenK;k++) {
                                if(indexOfData[oriData[item][k][key]]) {
                                    var obj=this.compareJson(oriData[item][k],data[item][indexOfData[oriData[item][k][key]]["index"]], "UPDATE");
                                    objArr.push(obj);
                                }else{
                                    obj = oriData[item][k];
                                    obj["objStatus"] = "DELETE";
                                    delete obj["$$hashKey"];
                                    if(!obj["pid"]) {
                                        obj["pid"]=pids;
                                    }
                                    if(obj["vias"]) {
                                        obj["vias"] = undefined;
                                    }
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }

                        }

                    } else if (!isNaN(oriData[item])) {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData["rowId"]) {
                                retObj["rowId"] = oriData["rowId"];
                            } else if (oriData["pid"]) {
                                retObj["pid"] = oriData["pid"];
                            }
                            retObj["objStatus"] = type;
                        }
                    }else {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData["rowId"]) {
                                retObj["rowId"] = oriData["rowId"];
                            } else if (oriData["pid"]) {
                                retObj["pid"] = oriData["pid"];
                            }
                            retObj["objStatus"] = type;
                        }
                    }

                }

                if (!this.isEmptyObject(retObj)) {
                    if(arrFlag) {
                        if (oriData["rowId"]) {
                            retObj["rowId"] = oriData["rowId"];
                        } else if (oriData["pid"]) {
                            retObj["pid"] = oriData["pid"];
                        }
                        arrFlag = false;
                    }
                    return retObj;
                } else {
                    return false;
                }

            },
            isContainArr: function (obj) {
                var flag = false;
                for (var item in obj) {
                    if(obj[item]&&obj[item].constructor == Array) {
                        flag = true;
                    }
                }
                return flag;

            },
            /**
             * 判断对象是不是为空
             * @param obj
             * @returns {boolean}
             */
            isEmptyObject: function (obj) {
                for (var n in obj) {
                    return false
                }
                return true;
            },
            /**
             * 保存元素的方法
             * @method onSaved
             * @param {Object}orignalData
             * @param {Object}data
             */
            onSaved: function (orignalData, data) {
                this.changedProperty = this.compareJson(orignalData["pid"],orignalData, data.getIntegrate(), "UPDATE");
            }
        });
        return new objectEditController(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();;/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class OutPutController
 */


fastmap.uikit.OutPutController=(function() {
    var instantiated;
    function init(options) {
            var outPutController =  L.Class.extend({

            options: {
            },

            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.outPuts = [];
                this.updateOutPuts="";
            },

            /***
             * 添加output
             * @param {Object}output
             */
            pushOutput:function(output){
                this.outPuts.push(output);
            },

            /***
             * 顶端移除一个ouput
             * @param {Object}output
             */
            popOutput:function(output){
                this.outPuts.pop(output);
            },

            /***
             * 内容排序
             * @param sortfun
             */
            sort:function(sortfun){

            },

            /***
             * 清空
             */
            clear:function(){
                this.outPuts=[];
            }
        });
        return new outPutController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();
;/**
 * Created by wangtun on 2015/9/10.
 * 保存选取的元素
 * @namespace fastmap.uikit
 * @class SelectController
 */

fastmap.uikit.SelectController=(function() {
    var instantiated;
    function init(options) {
            var selectController = L.Class.extend({

            /**
             * 相关属性
             */
            options: {
            },
            /**
             * 构造函数
             * @class SelectController
             * @constructor
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.selectedFeatures = null;
                this.snapObj= null;
                var eventController = fastmap.uikit.EventController();
                eventController.on(eventController.eventTypes.SELECTBYATTRIBUTE, this.OnSelectByAttribute,this);
            },
            /**
             * 根据属性获取元素
             * @method selectByAttribute
             */
            OnSelectByAttribute:function(event) {
                this.rowKey = event.feather;
                var features=[];
                this.onSelected(features);
            },
            /**
             *框选、圆选获取元素
             * @selectByGeometry
             * @param {Geometry}geometry
             */
            selectByGeometry:function(geometry) {
                this.geometry = geometry;
                var features={geometry:geometry};
                if(geometry==="circle"){
                }

                this.onSelected(features);
            },
            /**
             * 当前被选择的元素
             * @method onSelected
             * @param {Object}features
             */
            onSelected:function(features) {
                this.selectedFeatures = features;
            },
            /**
             * 清空存放数据的数组
             * @method clear
             */
            clear:function() {
                this.selectedFeatures= [];
            },

            /***
             * 当前捕捉到的对象
              */
            getSnapObj:function(){
                return this.snapObj;
            },

            setSnapObj:function(obj){
                this.snapObj = obj;
            }
        });
        return new selectController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

;/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class ShapeEditorController 单例
 */

fastmap.uikit.ShapeEditorController=(function() {

    var instantiated;
    function init(options) {
        var shapeEditorController = L.Class.extend({
            /**s
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,

            options: {},

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.map = null;
                this.editType = this.options.editType || '';
                this.editFeatType = null;
                this.currentEditinGeometry = {};
                this.currentTool = {"disable":function(){return -1;}};
                this.shapeEditorResultFeedback = new fastmap.mapApi.ShapeEditResultFeedback({shapeEditor:this});
                this.shapeEditorResult = this.options.shapeEditorResult || new fastmap.mapApi.ShapeEditorResult();

            },

            /***
             * 设置地图对象
             * @param map
             */
            setMap:function(map){
                this.map = map;
            },

            /***
             * 设置当前编辑的工具类型
             * @param {String}type
             */
            setEditingType: function (type) {
                this.stopEditing();
                this.editType = type;
            },

            /***
             * 当前编辑工具
             */
            getCurrentTool: function () {
                return this.currentTool;
            },
            /***
             * 开始编辑
             * @param {fastmap.mapApi.Geometry}geometry 编辑的几何图形
             */
            startEditing: function () {
                //this.shapeEditorResult = shapeEditorResult;
                this.currentEditinGeometry = this.shapeEditorResult.getFinalGeometry();
                this._tools(this.editType);

            },

            /***
             * 结束编辑 编辑的几何图形
             * @param {fastmap.mapApi.Geometry}geometry
             */
            stopEditing: function () {
                if(this.currentTool.disable()==-1){

                }else{
                    this.shapeEditorResultFeedback.stopFeedback();
                }

            },

            /***
             * 放弃编辑
             */
            abortEditing: function () {
                this.shapeEditorResultFeedback.abortFeedback();
            },

            /***
             *
             * @param {fastmap.mapApi.Geometry}geometry
             */
            setEditingGeometry: function (geometry) {
                this.currentEditinGeometry = geometry
            },

            /***
             *
             * @returns {fastmap.mapApi.Geometry|*}
             */
            getEditingGeometry: function () {
                return this.currentEditinGeometry;
            },
            /**
             * 不在editorLayer中使用的工具
             * @param type
             * @param options
             */
             toolsSeparateOfEditor: function (type, options) {
                this.editType = type;
                this.currentTool = new fastmap.mapApi.CrossingAdd(options);
                this.currentTool.enable();
             },
            /***
             * 当前工具类型
             * @param {String}type
             * @returns {*}
             * @private
             */
            _tools: function (type) {
                this.currentTool = null;
                var toolsObj  = fastmap.mapApi.shapeeditorfactory({shapeEditor:this}).toolObjs;
                this.currentTool = toolsObj[type];
                this.currentTool.enable();
            }
        });
        return  new shapeEditorController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})();
;/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTipsController
 */


fastmap.uikit.ToolTipsController=(function() {
    var instantiated;
    function init(options) {
        var toolTipsController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,
            options: {},

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                this._map=null;
                L.setOptions(this, options);
                this.on("toolStateChanged", this.setCurrentTooltip, this);
                this.toolsdiv="";
                this.orginStyle="";
            },
            /***
             * 设置地图对象
             * @param map
             */
            setMap:function(map,divid){
                this._map = map;
                this._divid=divid;
            },
            /***
             *
             * @param type
             */
            setEditEventType:function(type){
                this.eventType = type;
            },
            setChangeInnerHtml:function(innerhtmltext){
                this.innervalue = innerhtmltext;
            },
            setDbClickChangeInnerHtml:function(innerhtmltext){
                this.DbClickInnervalue = innerhtmltext;
            },
            setStyleTooltip:function(style){
                this.tooltipstyle=style;
            },
            onMoveOutTooltip:function(){
                this.toolsdiv.style.display = "none";
            },
            onMoveTooltip:function(event){
                this.toolsdiv.style.display = "block";
                this.toolsdiv.style.backgroundColor = "rgba(0,0,0,0.75)";
                this.toolsdiv.style.padding="0px 3px";
                this.toolsdiv.style.borderRadius="2px";
                this.toolsdiv.style.border = 'none';
                this.toolsdiv.style.color = "rgba(255,255,255,0.85)";
                this.toolsdiv.style.marginLeft = event.originalEvent.clientX+10+ 'px';
                this.toolsdiv.style.marginTop = event.originalEvent.clientY -10+ 'px';
                this.toolsdiv.style.position = "fixed";
                this._map.on('click', this.onClickTooltip,this);
                this._map.on('mouseout', this.onMoveOutTooltip,this);
            },
            onClickTooltip:function(event){
                if(this.eventType==fastmap.mapApi.ShapeOptionType.DRAWPATH){
                    this.toolsdiv.innerHTML=this.innervalue;
                    this.toolsdiv.style.cssText+=this.tooltipstyle;
                    this._map.on('dblclick', this.onDbClickTooltip,this);
                }else {
                    if(this.innervalue){
                        this.toolsdiv.innerHTML=this.innervalue;
                    }
                    this.toolsdiv.style.cssText+=this.tooltipstyle;
                }
            },
            onRemoveTooltip:function(){
                this.innervalue="";
                this.eventType="";
                this.toolsdiv.innerHTML = "";
                this.toolsdiv.style.display = 'none';
                this._map.off('click', this.onClickTooltip,this);
                this._map.off('mousemove', this.onMoveTooltip,this);
                this._map.off('dblclick', this.onDbClickTooltip,this);
            },
            onDbClickTooltip:function(){
                this.toolsdiv.innerHTML=this.DbClickInnervalue;
                this.toolsdiv.style.cssText+=this.tooltipstyle;
            },
            /***
             * 设置tooltip
             * @param {Object}tooltip
             */
            setCurrentTooltip: function (tooltip) {
                var tools=L.DomUtil.get(this._divid);
                this._map.on('mousemove', this.onMoveTooltip,this);
                tools.style.backgroundColor = "#000";
                tools.innerHTML=tooltip;
                this.toolsdiv=tools;
                this.orginStyle=tools.style.cssText;
            },
            getCurrentTooltip:function(){
                return this.toolsdiv.innerHTML;
            }

        });
        return new toolTipsController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();


;/**
 * Created by zhongxiaoming on 2016/3/17.
 * Class EventController
 */

fastmap.uikit.EventController=(function() {
    var instantiated;
    function init(options) {
        var eventController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: [L.Mixin.Events,{
                addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

                    // types can be a map of types/handlers
                    if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

                    var events = this['_leaflet_events'] = this['_leaflet_events'] || {},
                        contextId = context && context !== this && L.stamp(context),
                        i, len, event, type, indexKey, indexLenKey, typeIndex;

                    // types can be a string of space-separated words
                    types = L.Util.splitWords(types);

                    for (i = 0, len = types.length; i < len; i++) {
                        event = {
                            action: fn,
                            context: context || this
                        };
                        type = types[i];

                        if (contextId) {
                            // store listeners of a particular context in a separate hash (if it has an id)
                            // gives a major performance boost when removing thousands of map layers

                            indexKey = type + '_idx';
                            indexLenKey = indexKey + '_len';

                            typeIndex = events[indexKey] = events[indexKey] || {};

                            if (!typeIndex[contextId]) {
                                typeIndex[contextId] = [];

                                // keep track of the number of keys in the index to quickly check if it's empty
                                events[indexLenKey] = (events[indexLenKey] || 0) + 1;
                            }

                            typeIndex[contextId].push(event);


                        } else {
                            events[type] = events[type] || [];
                            events[type].push(event);
                        }


                        if( !this.eventTypesMap[type]){
                            this.eventTypesMap[type] = [];
                        }
                        this.eventTypesMap[type].push(fn);
                    }

                    return this;
                },
                removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])

                    if (!this[eventsKey]) {
                        return this;
                    }

                    if (!types) {
                        return this.clearAllEventListeners();
                    }

                    if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

                    var events = this[eventsKey],
                        contextId = context && context !== this && L.stamp(context),
                        i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed;

                    types = L.Util.splitWords(types);

                    for (i = 0, len = types.length; i < len; i++) {
                        type = types[i];
                        indexKey = type + '_idx';
                        indexLenKey = indexKey + '_len';

                        typeIndex = events[indexKey];

                        if (!fn) {
                            // clear all listeners for a type if function isn't specified
                            delete events[type];
                            delete events[indexKey];
                            delete events[indexLenKey];
                            delete eventTypesMap[type];

                        } else {
                            listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];

                            if (listeners) {
                                for (j = listeners.length - 1; j >= 0; j--) {
                                    if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
                                        removed = listeners.splice(j, 1);
                                        // set the old action to a no-op, because it is possible
                                        // that the listener is being iterated over as part of a dispatch
                                        removed[0].action = L.Util.falseFn;
                                    }
                                }

                                if (context && typeIndex && (listeners.length === 0)) {
                                    delete typeIndex[contextId];
                                    events[indexLenKey]--;
                                }
                            }

                            for (var i= 0,len =this.eventTypesMap[type].length;i<len;i++){
                                if(this.eventTypesMap[type][i] === fn){
                                    this.eventTypesMap[type].splice(j,1);
                                }
                            }

                        }
                    }

                    return this;
                },
                clearAllEventListeners: function () {
                    delete this[eventsKey];
                    this.eventTypesMap={};
                    return this;
                }
            }],


            options: {
            },

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.eventTypes = L.Mixin.EventTypes;
                this.on = this.addEventListener;
                this.eventTypesMap = {};
            }


        });
        return new eventController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

;/**
 * Created by liwanchong on 2015/11/4.
 */
fastmap.uikit.SelectDataTips = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this._map = this.options.map;
        this.currentEditLayer = this.options.currentEditLayer;
        this.eventController = fastmap.uikit.EventController();
        this.layerCtrl = fastmap.uikit.LayerController();
        this.tiles = this.currentEditLayer.tiles;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on("click",this.onMouseDown,this);
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.off("click",this.onMouseDown,this);
        }
    },

    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function (event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {
        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]] && this.tiles[tilePoint[0] + ":" + tilePoint[1]].hasOwnProperty("data")) {
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;

            var id = null;
            for (var item in data) {
                if(data[item].geometry.coordinates){
                    if (data[item].geometry.coordinates.length <= 2) {
                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 27)) {
                            id = data[item].properties.id;
                            this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0,optype:"TIPS"})

                            break;
                        }
                    } else {
                        var temp = [];
                        for (var i = 0; i < data[item].geometry.coordinates.length; i++) {
                            var childArr = [];
                            childArr[0] = data[item].geometry.coordinates[i][0];
                            childArr[1] = data[item].geometry.coordinates[i][1];
                            temp.push(childArr);
                        }
                        for (var i = 0; i < temp.length; i++) {
                            if (this._TouchesPoint(temp[i], x, y, 27)) {
                                id = data[item].properties.id;
                                this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0,optype:"TIPS"})
                                break;
                            }
                        }
                    }
                }

            }
        }
    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPoint: function (d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
            return 0;
        }
    }
});

;/**
 * Created by zhongxiaoming on 2015/11/4.
 * Class SelectMultiPath
 */

fastmap.uikit.SelectForRestriction = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {

        this.options = options || {};

        L.setOptions(this, options);

        this._map = this.options.map;

        this.currentEditLayer = this.options.currentEditLayer;
        this.eventController = fastmap.uikit.EventController();
        this.tiles = this.currentEditLayer.tiles;

        this.transform = new fastmap.mapApi.MecatorTranform();

        this.redrawTiles = [];
        this._map._container.style.cursor = 'pointer';
        this.selectedFeatures = [];
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);

    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
    },

    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function (event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());

        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    /***
     * 绘制点击高亮显示
     * @param tilePoint
     * @param event
     */
    drawGeomCanvasHighlight: function (tilePoint, event) {

        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;

        if (this.selectedFeatures.length == 1) {
            for (var item in data) {
                var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)
                if (touchids.length) {
                    var id = data[item].properties.id;

                    if (id == this.selectedFeatures[0]) {
                        if (touchids[0] == 0) {
                            this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                id: data[item].properties.snode,
                                index: this.selectedFeatures.length
                            })
                        } else {
                            this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                id: data[item].properties.enode,
                                index: this.selectedFeatures.length
                            })
                        }
                        var point = data[item].geometry.coordinates[touchids[0]];
                        this.selectedFeatures.push(id);

                        var ctx = {
                            canvas: this.currentEditLayer.tiles[tilePoint[0] + ":" + tilePoint[1]].options.context,
                            tile: tilePoint,
                            zoom: this._map.getZoom()
                        }

                        this._drawPointHeight(ctx, point);
                    }
                }
            }
        } else {
            for (var item in data) {
                if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                    var id = data[item].properties.id;
                    this.eventController.fire(this.eventController.eventTypes.GETLINKID, {id: id, index: this.selectedFeatures.length})
                    this.selectedFeatures.push(id)
                    if (this.selectedFeatures.length === 1) {
                        this._drawLineHeight(id, {
                            strokeWidth: 3,
                            strokeColor: '#F63428'
                        });
                    } else {
                        this._drawLineHeight(id, {
                            strokeWidth: 3,
                            strokeColor: '#253B76'
                        });
                    }

                }

            }
        }

    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0][0];
        var p1y = d[0][1];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0];
            var p2y = d[i][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            if ((dx * dx + dy * dy) <= r * r) {
                return 1
            }
            p1x = p2x;
            p1y = p2y
        }
        return 0
    },


    /***
     * 点击node点
     * @param d
     * @param x
     * @param y
     * @param r
     * @returns {number}
     * @private
     */
    _TouchesNodePoint: function (d, x, y, r) {
        var touched = false;
        for (var i = 0, len = d.length; i < len; i++) {
            if (i == 0 || i == len - 1) {
                var dx = x - d[i][0];
                var dy = y - d[i][1];
                if ((dx * dx + dy * dy) <= r * r) {
                    return [i];
                }
            }
        }

        return [];

    },
    /***
     * 绘制线高亮
     * @param id
     * @private
     */
    _drawLineHeight: function (id, lineStyle) {

        for (var obj in this.tiles) {

            var data = this.tiles[obj].data;

            for (var key in data) {

                if (data[key].properties.id == id) {

                    this.redrawTiles = this.tiles;
                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    }
                    this.currentEditLayer._drawLineString(ctx, data[key].geometry.coordinates, true, lineStyle, {
                        color: '#F63428',
                        radius: 3
                    }, data[key].properties);


                }
            }
        }


    },

    _drawPointHeight: function (ctx, point) {

        this.currentEditLayer._drawPoint(ctx, point, {
            color: '#FFFF00',
            radius: 3
        }, true);
    },
    cleanHeight: function () {
        this._cleanHeight();
        //this.currentEditLayer.fire("getId")
    },
    /***_drawLineString: function (ctx, geom, style, boolPixelCrs) {
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            if (!data) {
                return;
            }
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
            this.currentEditLayer._drawFeature(data, ctx, true);
            }

        }

});
;/**
 * Created by zhongxiaoming on 2016/1/12.
 * Class SelectNode
 */

fastmap.uikit.SelectNode = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this.currentEditLayer = this.options.currentEditLayer;
        this.id = this.currentEditLayer.options.id;
        this.tiles = this.currentEditLayer.tiles;
        this.eventController = fastmap.uikit.EventController();
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({
            map:this._map,
            shapeEditor:this.shapeEditor,
            snapLine:false,
            snapNode:true,
            snapVertex:true
        });
        this.snapHandler.enable();
        //this.floatVisible=false;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on("click",this.onMouseDown,this);
            this.snapHandler.disable();
        }
        if (this.id !== "rdcross") {
            this._map.on('mousemove',this.onMouseMove,this);
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        if(L.Browser.touch){
            this._map.off("click",this.onMouseDown,this);
        }
    },


    onMouseMove:function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped){
            this.eventController.fire( this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire( this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },

    onMouseDown: function (event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.newredraw = $.extend({}, this.tiles);
        if(this.id === "adAdmin"){
            this.getadAdminId(tileCoordinate, event);
        } else {
            this.drawGeomCanvasHighlight(tileCoordinate, event);
        }

    },
    getadAdminId: function (tilePoint, event) {
        //var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
        var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]].data === undefined) {
            return;
        }
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;

        var id = null;
        for (var item in data) {
            var geom = data[item].geometry.coordinates;
            var newGeom = [];
            newGeom[0] = (parseInt(geom[0]));
            newGeom[1] = (parseInt(geom[1]));
            if (this._TouchesPoint(newGeom, x, y, 20)) {
                id = data[item].properties.id;
                this.eventController.fire(this.eventController.eventTypes.GETADADMINNODEID, {id: id, optype:"RDADMINNODE"})
                break;
            }
        }
    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
        var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;

        for (var item in data) {
            var touchIds = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)
            if (touchIds.length) {
                var id = data[item].properties.id;

                if (touchIds[0] == 0) {
                    this.eventController.fire(this.eventController.eventTypes.GETNODEID, {
                        id: data[item].properties.snode,
                        optype:"RDNODE",
                        event:event
                    })
                    this.selectCtrl.selectedFeatures =data[item].properties.snode;
                    break;
                } else {
                    this.eventController.fire(this.eventController.eventTypes.GETNODEID, {
                        id: data[item].properties.enode,
                        optype:"RDNODE",
                        event:event
                    })
                    this.selectCtrl.selectedFeatures =data[item].properties.enode;
                    break;
                }
            }
        }
    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPoint: function (d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
            return 0;
        }
    },
    cleanHeight: function () {
        this._cleanHeight();

    }
    ,

    /***
     *清除高亮
     */
    _cleanHeight: function () {

    }
    ,

    /***
     * 点击node点
     * @param d
     * @param x
     * @param y
     * @param r
     * @returns {number}
     * @private
     */
    _TouchesNodePoint: function (d, x, y, r) {
        var touched = false;
        for (var i = 0, len = d.length; i < len; i++) {
            if (i == 0 || i == len - 1) {
                var dx = x - d[i][0];
                var dy = y - d[i][1];
                if ((dx * dx + dy * dy) <= r * r) {
                    return [i];
                }
            }
        }
        return [];
    }
});;/**
 * Created by zhongxiaoming on 2016/4/26.
 * Class SelectObject 将所有的选择数据的工具进行合并
 */

fastmap.uikit.SelectObject = (function () {

    var instantiated;

    function init(options) {
        var SelectObject = L.Class.extend({

                /***
                 *
                 * @param {Object}options
                 */
                initialize: function (options) {
                    this.options = options || {};
                    L.setOptions(this, options);
                    this._map = this.options.map;
                    this.highlightLayer = this.options.highlightLayer;
                    this.eventController = fastmap.uikit.EventController();
                    this.tiles = this.options.tiles;
                    this.transform = new fastmap.mapApi.MecatorTranform();
                    this.redrawTiles = [];
                },

                /***
                 *
                 * @param data tile中缓存的data
                 * @param type 当前高亮的图层类型
                 */
                drawGeomCanvasHighlight: function (data, type) {

                    this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                        id: data.properties.id,
                        optype: type

                    })
                }

            }
        )
        return new SelectObject(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})();;/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class SelectPath
 */

fastmap.uikit.SelectPath = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this.currentEditLayer = this.options.currentEditLayer;
        this.tiles = this.currentEditLayer.tiles;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.linksFlag = this.options.linksFlag;
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,snapLine:true,snapNode:false,snapVertex:false});
        this.snapHandler.enable();
        //this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        if(L.Browser.touch){
            this._map.on('click', this.onMouseDown, this);
            this.snapHandler.disable();
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown, this);
        }
    },

    onMouseMove:function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },


    onMouseDown: function (event) {
        var mouseLatlng;
        if(this.snapHandler.snaped){
            mouseLatlng = this.targetPoint
        }else{
            mouseLatlng = event.latlng;
        }

        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;
            if(!this.snapHandler.snaped){
                pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
            }else{
                pixels = this.transform.lonlat2Pixel(this.targetPoint.lng, this.targetPoint.lat,this._map.getZoom());
            }

            var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();
            for (var item in data) {
                if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                    var point= transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
                    point= new fastmap.mapApi.Point(point[0], point[1]);
                    id = data[item].properties.id;

                    if (this.linksFlag) {
                        this.eventController.fire(this.eventController.eventTypes.GETLINKID, {id: id,point:point,optype:"RDLINK",event:event});
                        this.currentEditLayer.selectedid = id;
                        if (this.redrawTiles.length != 0) {
                            this._cleanHeight();
                        }
                        this._drawHeight(id);
                    } else {
                        this.eventController.fire(this.eventController.eventTypes.GETOUTLINKSPID, {id: id,event:event});
                    }
                    break;
                }
            }
        }
    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0][0];
        var p1y = d[0][1];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0];
            var p2y = d[i][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            if ((dx * dx + dy * dy) <= r * r) {
                return 1
            }
            p1x = p2x;
            p1y = p2y
        }
        return 0
    },
    cleanHeight: function () {
        this._cleanHeight();
    },
    /***
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
            this.currentEditLayer._drawFeature(data, ctx, true);
        }
    }
    ,
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    _drawHeight: function (id) {
        this.redrawTiles = this.tiles;
        for (var obj in this.tiles) {

            var data = this.tiles[obj].data;

            for (var key in data) {
                if (data[key].properties.id == id) {
                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawLineString(ctx, data[key].geometry.coordinates, true, {
                        strokeWidth: 3,
                        strokeColor: '#00F5FF'
                    }, {
                        color: '#00F5FF',
                        radius: 3
                    }, data[key].properties);
                }
            }
        }
    }
});
;/**
 * Created by zhongxiaoming on 2016/4/14.
 * Class SelectPolygon
 */


fastmap.uikit.SelectPolygon = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this.currentEditLayer = this.options.currentEditLayer;
        this.tiles = this.currentEditLayer.tiles;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];

        this.eventController = fastmap.uikit.EventController();
        //this.snapHandler = new fastmap.uikit.Snap({map:this._map,shapeEditor:this.shapeEditor,snapLine:true,snapNode:false,snapVertex:false});
        //this.snapHandler.enable();
        //this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        //this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);

    },

    onMouseMove: function (event) {

    },

    onMouseDown: function (event) {
        var mouseLatlng;

        mouseLatlng = event.latlng;


        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },
    drawGeomCanvasHighlight: function (tilePoint, event) {

        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;

            pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, this._map.getZoom());


            var x = pixels[0] - tilePoint[0] * 256, y = pixels[1] - tilePoint[1] * 256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();
            for (var item in data) {
                if (this._containPoint(data[item].geometry.coordinates, x, y, 5)) {
                    var point = transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
                    point = new fastmap.mapApi.Point(point[0], point[1]);
                    id = data[item].properties.id;
                    this.eventController.fire(this.eventController.eventTypes.GETLINKID, {id: id, point: point});
                    this.currentEditLayer.selectedid = id;
                    this._cleanHeight();
                    this._drawHeight(id);
                    this.eventController.fire(this.eventController.eventTypes.GETOUTLINKSPID, {id: id});
                    break;
                }
            }

        }


    },


    /***
     * 判断点是否在几何图形内部
     * @param geo
     * @param x
     * @param y
     * @private
     */
    _containPoint: function (geo, x, y) {
        var lineRing = fastmap.mapApi.linearRing(geo[0]);
        return lineRing.containsPoint(fastmap.mapApi.point(x, y));
    },

    cleanHeight: function () {
        this._cleanHeight();
    },
    /***
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
            this.currentEditLayer._drawFeature(data, ctx, true);
        }
    }
    ,
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    _drawHeight: function (id) {
        this.redrawTiles = this.tiles;
        for (var obj in this.tiles) {

            var data = this.tiles[obj].data.features;

            for (var key in data) {

                if (data[key].properties.id == id) {

                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawPolygon(ctx, data[key].geometry.coordinates[0],
                        {
                            fillstyle: '#00F5FF',
                            outline: {
                                size: 1,
                                color: '#00F5FF'
                            }
                        }

                        , true);


                }
            }
        }

    }

});
;/**
 * Created by zhongxiaoming on 2016/2/2.
 * Class SelectRelation
 */
fastmap.uikit.SelectRelation = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);

        this._map = this.options.map;
        this.editLayerIds = ['speedlimit','rdcross','rdlaneconnexity','restriction','highSpeedDivergence']
        //this.editLayerIds = ['speedlimit']

        this.currentEditLayers = [];
        this.tiles = [];
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.layerController = new fastmap.uikit.LayerController();
        this.highlightLayer = this.layerController.getLayerById('highlightlayer');
        for(var item in this.editLayerIds){
            this.currentEditLayers.push(this.layerController.getLayerById(this.editLayerIds[item]))
        }
        this.popup = L.popup();

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on('click', this.onMouseDown,this);
        }
    },


    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown,this);
        }
    },
    onMouseDown: function (event) {
        this.tiles = [];
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());

        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    /***
     * 获取鼠标点击周边所有瓦片
     * @param layer
     * @param tilePoint
     * @returns {Array}
     */
    getRoundTile:function(layer, tilePoint){
        var tiles = [];
        for( var index in layer.tiles){
            if(Math.abs(layer.tiles[index].options.context.name.split('_')[0] - tilePoint[0])<=1&&Math.abs(layer.tiles[index].options.context.name.split('_')[1] - tilePoint[1])<=1){
                tiles.push(layer.tiles[index]);
            }
        }
        return tiles;
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {
        this.overlays=[];
        var  frs = null;
        for(var layer in this.currentEditLayers){

            this.tiles = this.tiles.concat(this.getRoundTile(this.currentEditLayers[layer],tilePoint))

            if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]&&!this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data){
                return;
            }
            if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]&&this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data){
                var data = this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data;
                var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                for (var item in data) {
                    if(this.currentEditLayers[layer].requestType =='RDCROSS'){

                        for (var key in data[item].geometry.coordinates) {
                            if (this._TouchesPoint(data[item].geometry.coordinates[key], x, y, 20)) {
                                this.overlays.push({layer:this.currentEditLayers[layer],data:data[item]});
                            }
                        }
                    }else{
                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            this.overlays.push({layer:this.currentEditLayers[layer],data:data[item]});
                        }
                    }
                }
            }
       }
        if(this.overlays.length == 1){
            frs = new fastmap.uikit.SelectObject({highlightLayer:this.highlightLayer,map:this._map});
            frs.tiles = this.tiles;
            frs.drawGeomCanvasHighlight(this.overlays[0].data ,this.overlays[0].layer.requestType);
        }else if (this.overlays.length > 1){
            var html = '<ul id="layerpopup">';
            this.overlays = this.unique(this.overlays);
            for(var item in this.overlays){
                html += '<li><a href="#" id="'+this.overlays[item].layer.options.requestType+'">'+this.overlays[item].layer.options.layername+'</a></li>';
            }
            html +='</ul>';
            this.popup
                .setLatLng(event.latlng)
                .setContent(html);
            var that = this;
            this._map.on('popupopen',function(){
                document.getElementById('layerpopup').onclick=function(e){
                    if(e.target.tagName == 'A'){
                        var layer = '';
                        var d = '';
                        for(var key in that.overlays){
                            if(e.target.id == that.overlays[key].layer.requestType){
                                layer = that.overlays[key].layer;
                                d = that.overlays[key].data;
                            }
                        }

                        frs = new fastmap.uikit.SelectObject({highlightLayer:this.highlightLayer,map:this._map});
                        frs.tiles = that.tiles;
                        frs.drawGeomCanvasHighlight(d, e.target.id);
                    }
                }
            });

            //弹出popup，这里如果不用settimeout,弹出的popup会消失，后期在考虑优化  王屯+
            var that = this;
            if(this.overlays &&this.overlays.length > 1){
                setTimeout(function(){
                    that._map.openPopup(that.popup);
                },200)
            }
        }
    },
     unique:function(arr) {
        var result = [], hash = {};
        for (var i = 0; i<arr.length; i++) {
            var elem = arr[i].layer.requestType;
            if (!hash[elem]) {
                result.push(arr[i]);
                hash[elem] = true;
            }
        }
        return result;

    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPoint: function (d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
            return 0;
        }
    }

});;/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class CheckResult
 * 检查结果
 */

fastmap.uikit.CheckResult = L.Class.extend({
    /***
     *
     * @param options
     * options参数说明：
     * pid：检查结果id
     * contentStyle：输出样式
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.pid = this.options.pid || null;
        this.content = this.options.pid || '';
        this.contentStyle = this.options.contentStyle || null;
    }


});
;/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ContentStyle 输出框中的输出样式
 */

fastmap.uikit.ContentStyle = L.Class.extend({
    /***
     *
     * @param options
     * options参数说明
     * fontSize：字号
     * fontColor：颜色
     * position：位置
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.fontSize = this.options.fontSize || 14;
        this.fontCorlor = this.options.fontCorlor || 'black';
        this.position = this.options.position || null;
    },

    /***
     * 设置字体颜色
     * @param fontCorlor
     */
    setFontCorlor: function (fontCorlor) {
        this.fontCorlor = fontCorlor;
    },

    /***
     * 设置字体大小
     * @param fontSize
     */
    setFontSize: function (fontSize) {
        this.fontSize = fontSize;
    },

    /***
     * 设置位置信息
     * @param position
     */
    setPosition: function (position) {
        this.position = position;
    }
});
;/**
 * Created by liwanchong on 2015/9/9.
 * DataTips
 * @namespace fast
 * @class DataTips
 */

fastmap.uikit.DataTips = L.Class.extend({
    /**
     * 相关属性
     */
    options: {},
    /**
     * 构造函数
     * @class DataTips
     * @constructor
     * @namespace  fastmap
     * @param {String}id
     * @param {String}type
     * @param {Geometry}geometry
     * @param {Object}options
     */
    initialize: function (id, type, geometry, options) {
        this.options = options || {};

        L.setOptions(this, options);
        this.style = options.style;
        this.geometry = geometry;
        this.icon = null;
        this.id = id;
        this.type = type;
        this.source = null;
        this.deep = null;

    },
    /**
     * 获取元素的坐标或者是系列坐标
     * @method setCoordinates
     * @param {Array}coordinates
     */
    setCoordinates: function (coordinates) {
        this.options = coordinates;
    }


});
;/**
 * Created by liwanchong on 2015/9/9.
 * FeatCode对象
 * @namespace fast
 * @class FeatCode
 */

fastmap.uikit.FeatCode = L.Class.extend({
    /**
     * 构造函数
     * @class FeatCode
     * @constructor
     * @namespace fast
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options)
        this.type = "";
    },
    /**
     * 设置输出
     * @method setOutPut
     */
    setOutput: function () {

    }
})
;/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class Output 输出内容
 */

fastmap.uikit.OutPut = L.Class.extend({
    /***
     *
     * @param options
     * options参数说明
     * outputContent：输出内容
     * style：输出样式
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.outputContent = options.ouputContent;
        this.style = options.style;
    },

    setOutput: function () {

    }
});
;/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTip 鼠标滑动提示框
 */

fastmap.uikit.ToolTip = L.Class.extend({
    /***
     *
     * @param options
     * options参数说明
     * outputContent：输出内容
     * style：输出样式
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.outputContent = options.ouputContent;
        this.style = options.style;
    }
});
