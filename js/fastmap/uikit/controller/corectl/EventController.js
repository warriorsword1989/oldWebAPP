/**
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
                    }
                    this.eventTypesMap[types] = fn;
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

