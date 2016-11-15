/**
 * Created by zhongxiaoming on 2016/11/12.
 * 批量保存的辅助类，主要用于多个同种geoData进行属性对比，找出相同的属性
 * 同时将不同的属性置空，处理结果用于属性表展示
 */

fastmap.dataApi.geoDataModelComparison = L.Class.extend({

  initialize: function () {
  },

  abstract: function (roads) {
    var abs1 = roads[0];
    for (var i = 1; i < roads.length; i++) {
      abs1 = this._compareObject(abs1, roads[i]);
    }

    return abs1
  },

  _compareObject: function (objectBase, objectFrom) {

    for (var key in Object.keys(objectBase)) {
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
          objectBase[Object.keys(objectBase)[key]] = null;
        }
      }
    }

    return objectBase;
  },


  _isSameObject: function (objectBase, objectFrom) {
    for (var key in Object.keys(objectBase)) {
      if (objectBase[Object.keys(objectBase)[key]] != objectFrom[Object.keys(objectBase)[key]]) {
        return false;
      }
    }
    return true;
  },

  _compareArr: function (arrayBase, arrayFrom) {
    var result = [];
    for (var i = 0, len = arrayBase.length; i < len; i++) {
      for (var j = 0, length = arrayFrom.length; j < length; j++) {

        var compareResult = this._isSameObject(arrayBase[i], arrayFrom[j]);
        if (compareResult) {
          result.push(arrayBase[i]);
        }

      }

    }

    return result;
  }

})
