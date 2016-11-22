/**
 * Created by zhongxiaoming on 2016/11/12.
 * 批量保存的辅助类，主要用于多个同种geoData进行属性对比，找出相同的属性
 * 同时将不同的属性置空，处理结果用于属性表展示
 */

fastmap.dataApi.geoDataModelComparison = L.Class.extend({

  initialize: function (options) {


    /***
     * 对比规则
     * link不对比
     */
    this.rules = {
      link:['geometry','pid'],
      forms:['linkPid','rowId'],
      intRtics:['linkPid','rowId'],
      rtics:['linkPid','rowId'],
      sidewalks:['linkPid','rowId'],
      names:['linkPid','rowId'],
      limits:['linkPid','rowId'],
      limitTrucks:['linkPid','rowId'],
      speedlimits:['linkPid','rowId'],
      walkstairs:['linkPid','rowId'],
      zones:['linkPid','rowId']

    }
  },

  abstract: function (roads) {
    var abs1 = roads[0];
    for (var i = 1; i < roads.length; i++) {
      abs1 = this._compareObject(FM.Util.clone(abs1), FM.Util.clone(roads[i]), this.rules.link.concat(this.rules.link));
    }

    return abs1
  },

  _compareObject: function (objectBase, objectFrom, rules) {

    for (var key in Object.keys(objectBase)) {
      if( !FM.Util.isContains( rules, Object.keys(objectBase)[key] )){
        if (FM.Util.isArray(objectBase[Object.keys(objectBase)[key]])) {
          if (objectBase[Object.keys(objectBase)[key]].length > 0 && objectFrom[Object.keys(objectFrom)[key]].length > 0) {
            objectBase[Object.keys(objectBase)[key]] = this._compareArr(objectBase[Object.keys(objectBase)[key]], objectFrom[Object.keys(objectBase)[key]])
          }
        }else if(FM.Util.isObject(objectBase[Object.keys(objectBase)[key]])){

          var com =  this._compareObject(FM.Util.clone(objectBase[Object.keys(objectBase)[key]]), FM.Util.clone(objectFrom[Object.keys(objectBase)[key]]));
          objectBase[Object.keys(objectBase)[key]] = com;
        }
        else {
          if (objectBase[Object.keys(objectBase)[key]] != objectFrom[Object.keys(objectBase)[key]]) {
            objectBase[Object.keys(objectBase)[key]] = -1;
          }
        }
      }

    }

    return objectBase;
  },


  _isSameObject: function (objectBase, objectFrom, rules) {
    for (var key in Object.keys(objectBase)) {
      if(rules.length > 0){
        if( !FM.Util.isContains( this.rules.names, Object.keys(objectBase)[key] )){
          if (objectBase[Object.keys(objectBase)[key]] != objectFrom[Object.keys(objectBase)[key]]) {
            return false;
          }
        }

      }

    }
    return true;
  },

  _compareArr: function (arrayBase, arrayFrom) {
    var result = [];

    for (var i = 0, len = arrayBase.length; i < len; i++) {
      var rowids = [];
      for (var j = 0, length = arrayFrom.length; j < length; j++) {

        var compareResult = this._isSameObject(arrayBase[i], arrayFrom[j],this.rules.names);


        if (compareResult) {
          if(!FM.Util.isContains(rowids, arrayBase[i].rowId) ){
            rowids.push(arrayBase[i].rowId);
          }
          if(!FM.Util.isContains(rowids, arrayFrom[j].rowId)){
            rowids.push(arrayFrom[j].rowId);
          }

          arrayBase[i].rowIds = rowids;
          result.push(arrayBase[i]);
        }

      }

    }

    return result;
  },

  /***
   * 更新对象数组中的对象，如果有rowid相同的对象则更新
   * 没有则加入到比对对象数组中
   * @param arrayBase
   * @param arrayFrom
   * @returns {Array}
   * @private
   */
  _updataArr: function (arrayBase, arrayFrom) {
    var result = {};
    for (var i = 0, len = arrayBase.length; i < len; i++) {
      //result[]
      if(arrayBase[0].objStatus == 'INSERT'){
        arrayFrom.push(arrayBase[0]);
      }else if(arrayBase[0].objStatus == 'DELETE'){
        for(var j =0,length = arrayFrom.length;i<length;i++){
          if(arrayFrom[j].rowId == arrayBase[0].rowId){
            arrayFrom[j].splice(j,1);
          }
        }

      }else if(arrayBase[0].objStatus == 'UPDATE'){
        for(var k =0,l = arrayFrom.length;k<l;k++){
          if(arrayFrom[k].rowId == arrayBase[0].rowId){
            for(var key in arrayBase[0]){
              if(arrayFrom[k][key]){
                arrayFrom[k][key] =  arrayBase[0][key];
              }
            }

          }
        }
      }
    }

  },

  updataObject:function (objectBase, objectFrom) {

    var updateObj = {}

    for (var key in Object.keys(objectBase)) {
      if(!FM.Util.isContains(['pid','objStatus'],Object.keys(objectBase)[key])){

        if (FM.Util.isArray(objectBase[Object.keys(objectBase)[key]])) {
          if (objectBase[Object.keys(objectBase)[key]].length > 0 ) {

            this._updataArr(objectBase[Object.keys(objectBase)[key]], objectFrom[Object.keys(objectBase)[key]]);

          }
        }else if(FM.Util.isObject(objectBase[Object.keys(objectBase)[key]])){
          //对象暂时不做操作
        }
        else {
          if (objectBase[Object.keys(objectBase)[key]] != objectFrom[Object.keys(objectBase)[key]]) {
            objectFrom[Object.keys(objectBase)[key]] = objectBase[Object.keys(objectBase)[key]];
          }
        }


      }



      
    }
  }

})
