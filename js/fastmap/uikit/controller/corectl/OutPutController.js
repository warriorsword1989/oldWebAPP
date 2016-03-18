/**
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
