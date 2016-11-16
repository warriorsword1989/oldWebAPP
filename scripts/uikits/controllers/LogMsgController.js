/**
 * Created by wangmingong on 2016/8/22.
 * Class LogMsgController
 */
fastmap.uikit.LogMsgController = (function () {
    var instantiated;

    function init() {
        var logMsgController = L.Class.extend({
            options: {},
            initialize: function () {
                this.messages = [];
                this.updateOutPuts = '';
                var messageArr = this.messages;
                this.msgObj = function (data) {
                    var _msg = {};
                    _msg.value = data.value || '没有描述';
                    _msg.type = data.type || 'success';
                    _msg.time = data.time || 5000;
                    _msg.remove = function (msg) {
                        for (var i = 0; i < messageArr.length; i++) {
                            if (messageArr[i] == msg) {
                                messageArr.splice(i, 1);
                            }
                        }
                    };
                    return _msg;
                };
            },
            /** *
             * 添加massage
             * @param {Object}massage
             */
            pushMsg: function ($scope, msg) {
                var _this = this;
                if (typeof msg === 'object') {
                    this.messages.push(this.msgObj(msg));
                    setTimeout(function () {
                        _this.msgObj(msg).remove(_this.msgObj(msg));
                        $scope.$apply();
                    }, _this.msgObj(msg).time);
                } else if (typeof msg === 'string') {
                    this.messages.push(this.msgObj({ value: msg }));
                    setTimeout(function () {
                        _this.msgObj({ value: msg }).remove(_this.messages[_this.messages.length - 1]);
                        $scope.$apply();
                    }, _this.msgObj(msg).time);
                }
            },
            /** *
             * 清空
             */
            clear: function () {
                this.messages = [];
            }
        });
        return new logMsgController();
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    };
}());
