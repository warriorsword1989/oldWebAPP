/**
 * Created by wangtun on 2015/10/21.
 */
fastmap.mapApi.GeoJson =(function() {
    var instantiated;
    function init(options) {
        var geoJson = fastmap.mapApi.Json.extend({
            /**
             * @param ignoreExtraDims
             * 忽略坐标维数
             */
            ignoreExtraDims: false,

            geoLiveTypes:{
                rdLink : fastmap.dataApi.rdLink,
                rdNode:fastmap.dataApi.rdNode,
                rdLinkForm:fastmap.dataApi.rdLinkform,
                rdLinkLimit:fastmap.dataApi.rdLinkLimit,
                rdLinkName:fastmap.dataApi.linkname,
                rdLinkRtic:fastmap.dataApi.linkrtic,
                rdLinkSideWalk:fastmap.dataApi.linksidewalk,
                rdLinkSpeedLimit:fastmap.dataApi.linkspeedlimit,
                rdLinkTruckLimit:fastmap.dataApi.linktrucklimit,
                rdLinkWalkStair:fastmap.dataApi.linktrucklimit,
                rdLinkZone:fastmap.dataApi.linkzone,
                rdRestriction:fastmap.dataApi.rdrestriction,
                rdRestrictionCondition:fastmap.dataApi.rdrestrictioncondition,
                rdRestrictionDetail:fastmap.dataApi.rdRestrictionDetail
            },

            read:function(json, type, filter) {
                type = (type) ? type : "FeatureCollection";
                var results = null;
                var obj = null;
                if (typeof json == "string") {
                    obj = fastmap.mapApi.Json.prototype.read.apply(this,
                        [json, filter]);
                } else {
                    obj = json;
                }
                if(!obj) {
                    throw "格式不正确: " + json;
                } else if(typeof(obj.type) != "string") {
                    throw "格式不正确-没有类型字段: " + json;
                } else if(this.isValidType(obj, type)) {
                    switch(type) {
                        case "Geometry":
                            try {
                                results = this.parseGeometry(obj);
                            } catch(err) {
                                throw err;
                            }
                            break;
                        case "Feature":
                            try {
                                results = this.parseFeature(obj);
                                results.type = "Feature";
                            } catch(err) {
                                throw err;
                            }
                            break;
                        case "FeatureCollection":
                            // for type FeatureCollection, we allow input to be any type
                            results = [];
                            switch(obj.type) {
                                case "Feature":
                                    try {
                                        results.push(this.parseFeature(obj));
                                    } catch(err) {
                                        results = null;
                                        throw err;
                                    }
                                    break;
                                case "FeatureCollection":
                                    for(var i=0, len=obj.features.length; i<len; ++i) {
                                        try {
                                            results.push(this.parseFeature(obj.features[i]));
                                        } catch(err) {
                                            results = null;
                                            throw err;
                                        }
                                    }
                                    break;
                                default:
                                    try {
                                        var geom = this.parseGeometry(obj);
                                        results.push(this.geoLiveTypes[geoLiveType](geom,obj));
                                    } catch(err) {
                                        results = null;
                                        throw err;
                                    }
                            }
                            break;
                    }
                }
                return results;
            },

            isValidType:function(obj, type) {
                var valid = false;
                switch(type) {
                    case "Geometry":
                        var geometryTypes = ["Point", "MultiPoint", "LineString", "MultiLineString",
                            "Polygon", "MultiPolygon", "Box", "GeometryCollection"];

                        for(var i= 0,len=geometryTypes.length;i<len;i++){
                            if (type.toLowerCase()==geometryTypes[i].toLowerCase()){
                                valid = true;
                                break;
                            }
                        }
                        if(!valid){
                            throw "不支持该几何类型:"+obj.type;
                        }
                        break;
                    case "FeatureCollection":
                        valid = true;
                        break;
                    default:
                        if(obj.type == type) {
                            valid = true;
                        } else {
                            throw "不能将"+obj.type+"转换为"+type;
                        }
                }
                return valid;
            },

            parseFeature:function(obj,geoLiveType){
                var feature, geometry, attributes, bbox;
                attributes = (obj.properties) ? obj.properties : {};
                bbox = (obj.geometry && obj.geometry.bbox) || obj.bbox;
                try {
                    geometry = this.parseGeometry(obj.geometry);
                } catch(err) {
                    throw err;
                }

                if(this.geoLiveTypes[geoLiveType] && typeof(this.geoLiveTypes[geoLiveType])=="function"){
                    feature = this.geoLiveTypes[geoLiveType](geometry,attributes);
                }
                if(bbox) {
                    feature.bounds = new fastmap.mapApi.Bounds(bbox);
                }
                if(obj.id) {
                    feature.fid = obj.id;
                }
                return feature;
            },

            parseGeometry:function(obj) {
                if (obj == null) {
                    return null;
                }
                var geometry, collection = false;
                if(obj.type == "GeometryCollection") {
                    if(!(L.Util.isArray(obj.geometries))) {
                        throw "GeometryCollection必须是几何图形的集合: " + obj;
                    }
                    var numGeom = obj.geometries.length;
                    var components = new Array(numGeom);
                    for(var i=0; i<numGeom; ++i) {
                        components[i] = this.parseGeometry.apply(
                            this, [obj.geometries[i]]
                        );
                    }
                    geometry = new fastmap.mapApi.Collection(components);
                    collection = true;
                } else {
                    if(!(L.Util.isArray(obj.coordinates))) {
                        throw "Geometry必须是坐标的数组集合: " + obj;
                    }
                    if(!this.parseCoords[obj.type.toLowerCase()]) {
                        throw "不支持该几何类型: " + obj.type;
                    }
                    try {
                        geometry = this.parseCoords[obj.type.toLowerCase()].apply(
                            this, [obj.coordinates]
                        );
                    } catch(err) {
                        throw err;
                    }
                }
                return geometry;
            },

            /**
             * Property: parseCoords
             * Object with properties corresponding to the GeoJSON geometry types.
             *     Property values are functions that do the actual parsing.
             */
            parseCoords: {
                /**
                 * Method: parseCoords.point
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Parameters:
                 * array - {Object} The coordinates array from the GeoJSON fragment.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "point": function(array) {
                    if (this.ignoreExtraDims == false && array.length != 2) {
                        throw "点类型只支持二维坐标: " + array;
                    }
                    return new fastmap.mapApi.Point(array[0], array[1]);
                },

                /**
                 * Method: parseCoords.multipoint
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Parameters:
                 * array - {Object} The coordinates array from the GeoJSON fragment.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "multipoint": function(array) {
                    var points = [];
                    var p = null;
                    for(var i=0, len=array.length; i<len; ++i) {
                        try {
                            p = this.parseCoords["point"].apply(this, [array[i]]);
                        } catch(err) {
                            throw err;
                        }
                        points.push(p);
                    }
                    return new OpenLayers.Geometry.MultiPoint(points);
                },

                /**
                 * Method: parseCoords.linestring
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Parameters:
                 * array - {Object} The coordinates array from the GeoJSON fragment.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "linestring": function(array) {
                    var points = [];
                    var p = null;
                    for(var i=0, len=array.length; i<len; ++i) {
                        try {
                            p = this.parseCoords["point"].apply(this, [array[i]]);
                        } catch(err) {
                            throw err;
                        }
                        points.push(p);
                    }
                    return new fastmap.mapApi.LineString(points);
                },

                /**
                 * Method: parseCoords.multilinestring
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Parameters:
                 * array - {Object} The coordinates array from the GeoJSON fragment.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "multilinestring": function(array) {
                    var lines = [];
                    var l = null;
                    for(var i=0, len=array.length; i<len; ++i) {
                        try {
                            l = this.parseCoords["linestring"].apply(this, [array[i]]);
                        } catch(err) {
                            throw err;
                        }
                        lines.push(l);
                    }
                    return new fastmap.mapApi.MultiPolyline(lines);
                },

                /**
                 * Method: parseCoords.polygon
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "polygon": function(array) {
                    var rings = [];
                    var r, l;
                    for(var i=0, len=array.length; i<len; ++i) {
                        try {
                            l = this.parseCoords["linestring"].apply(this, [array[i]]);
                        } catch(err) {
                            throw err;
                        }
                        r = new fastmap.mapApi.LinearRing(l.components);
                        rings.push(r);
                    }
                    return new fastmap.mapApi.Polygon(rings);
                },

                /**
                 * Method: parseCoords.multipolygon
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Parameters:
                 * array - {Object} The coordinates array from the GeoJSON fragment.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "multipolygon": function(array) {
                    var polys = [];
                    var p = null;
                    for(var i=0, len=array.length; i<len; ++i) {
                        try {
                            p = this.parseCoords["polygon"].apply(this, [array[i]]);
                        } catch(err) {
                            throw err;
                        }
                        polys.push(p);
                    }
                    return new fastmap.mapApi.MultiPolygon(polys);
                },

                /**
                 * Method: parseCoords.box
                 * Convert a coordinate array from GeoJSON into an
                 *     <OpenLayers.Geometry>.
                 *
                 * Parameters:
                 * array - {Object} The coordinates array from the GeoJSON fragment.
                 *
                 * Returns:
                 * {<OpenLayers.Geometry>} A geometry.
                 */
                "box": function(array) {
                    if(array.length != 2) {
                        throw "GeoJSON box coordinates must have 2 elements";
                    }
                    return new fastmap.mapApi.Polygon([
                        new fastmap.mapApi.LinearRing([
                            new fastmap.mapApi.Point(array[0][0], array[0][1]),
                            new fastmap.mapApi.Point(array[1][0], array[0][1]),
                            new fastmap.mapApi.Point(array[1][0], array[1][1]),
                            new fastmap.mapApi.Point(array[0][0], array[1][1]),
                            new fastmap.mapApi.Point(array[0][0], array[0][1])
                        ])
                    ]);
                }

            },

            /**
             * APIMethod: write
             * Serialize a feature, geometry, array of features into a GeoJSON string.
             *
             * Parameters:
             * obj - {Object} An <OpenLayers.Feature.Vector>, <OpenLayers.Geometry>,
             *     or an array of features.
             * pretty - {Boolean} Structure the output with newlines and indentation.
             *     Default is false.
             *
             * Returns:
             * {String} The GeoJSON string representation of the input geometry,
             *     features, or array of features.
             */
            write: function(obj, pretty) {
                var geojson = {
                    "type": null
                };
                if(L.Util.isArray(obj)) {
                    geojson.type = "FeatureCollection";
                    var numFeatures = obj.length;
                    geojson.features = new Array(numFeatures);
                    for(var i=0; i<numFeatures; ++i) {
                        var element = obj[i];
                        if(!element instanceof fastmap.dataApi.GeoDataModel) {
                            var msg = "FeatureCollection 目前只支持 " + element;
                            throw msg;
                        }
                        geojson.features[i] = this.extract.feature.apply(
                            this, [element]
                        );
                    }
                } else if (obj instanceof fastmap.mapApi.geometry == 0) {
                    geojson = this.extract.geometry.apply(this, [obj]);
                } else if (obj instanceof fastmap.dataApi.GeoDataModel) {
                    geojson = this.extract.feature.apply(this, [obj]);
                    if(obj.layer && obj.layer.projection) {
                        geojson.crs = this.createCRSObject(obj);
                    }
                }
                return OpenLayers.Format.JSON.prototype.write.apply(this,
                    [geojson, pretty]);
            },

            /**
             * Method: createCRSObject
             * Create the CRS object for an object.
             *
             * Parameters:
             * object - {<OpenLayers.Feature.Vector>}
             *
             * Returns:
             * {Object} An object which can be assigned to the crs property
             * of a GeoJSON object.
             */
            createCRSObject: function(object) {
                var proj = object.layer.projection.toString();
                var crs = {};
                if (proj.match(/epsg:/i)) {
                    var code = parseInt(proj.substring(proj.indexOf(":") + 1));
                    if (code == 4326) {
                        crs = {
                            "type": "name",
                            "properties": {
                                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                            }
                        };
                    } else {
                        crs = {
                            "type": "name",
                            "properties": {
                                "name": "EPSG:" + code
                            }
                        };
                    }
                }
                return crs;
            },

            /**
             * Property: extract
             * Object with properties corresponding to the GeoJSON types.
             *     Property values are functions that do the actual value extraction.
             */
            extract: {
                /**
                 * Method: extract.feature
                 * Return a partial GeoJSON object representing a single feature.
                 *
                 * Parameters:
                 * feature - {<OpenLayers.Feature.Vector>}
                 *
                 * Returns:
                 * {Object} An object representing the point.
                 */
                'feature': function(feature) {
                    var geom = this.extract.geometry.apply(this, [feature.geometry]);
                    var json = {
                        "type": "Feature",
                        "properties": feature.attributes,
                        "geometry": geom
                    };
                    if (feature.fid != null) {
                        json.id = feature.fid;
                    }
                    return json;
                },

                /**
                 * Method: extract.geometry
                 * Return a GeoJSON object representing a single geometry.
                 *
                 * Parameters:
                 * geometry - {<OpenLayers.Geometry>}
                 *
                 * Returns:
                 * {Object} An object representing the geometry.
                 */
                'geometry': function(geometry) {
                    if (geometry == null) {
                        return null;
                    }

                    var geometryType = geometry.type;
                    var data = this.extract[geometryType.toLowerCase()].apply(this, [geometry]);
                    var json;
                    if(geometryType == "Collection") {
                        json = {
                            "type": "GeometryCollection",
                            "geometries": data
                        };
                    } else {
                        json = {
                            "type": geometryType,
                            "coordinates": data
                        };
                    }

                    return json;
                },

                /**
                 * Method: extract.point
                 * Return an array of coordinates from a point.
                 *
                 * Parameters:
                 * point - {<OpenLayers.Geometry.Point>}
                 *
                 * Returns:
                 * {Array} An array of coordinates representing the point.
                 */
                'point': function(point) {
                    return [point.x, point.y];
                },

                /**
                 * Method: extract.multipoint
                 * Return an array of point coordinates from a multipoint.
                 *
                 * Parameters:
                 * multipoint - {<OpenLayers.Geometry.MultiPoint>}
                 *
                 * Returns:
                 * {Array} An array of point coordinate arrays representing
                 *     the multipoint.
                 */
                'multipoint': function(multipoint) {
                    var array = [];
                    for(var i=0, len=multipoint.components.length; i<len; ++i) {
                        array.push(this.extract.point.apply(this, [multipoint.components[i]]));
                    }
                    return array;
                },

                /**
                 * Method: extract.linestring
                 * Return an array of coordinate arrays from a linestring.
                 *
                 * Parameters:
                 * linestring - {<OpenLayers.Geometry.LineString>}
                 *
                 * Returns:
                 * {Array} An array of coordinate arrays representing
                 *     the linestring.
                 */
                'linestring': function(linestring) {
                    var array = [];
                    for(var i=0, len=linestring.components.length; i<len; ++i) {
                        array.push(this.extract.point.apply(this, [linestring.components[i]]));
                    }
                    return array;
                },

                /**
                 * Method: extract.multilinestring
                 * Return an array of linestring arrays from a linestring.
                 *
                 * Parameters:
                 * multilinestring - {<OpenLayers.Geometry.MultiLineString>}
                 *
                 * Returns:
                 * {Array} An array of linestring arrays representing
                 *     the multilinestring.
                 */
                'multilinestring': function(multilinestring) {
                    var array = [];
                    for(var i=0, len=multilinestring.components.length; i<len; ++i) {
                        array.push(this.extract.linestring.apply(this, [multilinestring.components[i]]));
                    }
                    return array;
                },

                /**
                 * Method: extract.polygon
                 * Return an array of linear ring arrays from a polygon.
                 *
                 * Parameters:
                 * polygon - {<OpenLayers.Geometry.Polygon>}
                 *
                 * Returns:
                 * {Array} An array of linear ring arrays representing the polygon.
                 */
                'polygon': function(polygon) {
                    var array = [];
                    for(var i=0, len=polygon.components.length; i<len; ++i) {
                        array.push(this.extract.linestring.apply(this, [polygon.components[i]]));
                    }
                    return array;
                },

                /**
                 * Method: extract.multipolygon
                 * Return an array of polygon arrays from a multipolygon.
                 *
                 * Parameters:
                 * multipolygon - {<OpenLayers.Geometry.MultiPolygon>}
                 *
                 * Returns:
                 * {Array} An array of polygon arrays representing
                 *     the multipolygon
                 */
                'multipolygon': function(multipolygon) {
                    var array = [];
                    for(var i=0, len=multipolygon.components.length; i<len; ++i) {
                        array.push(this.extract.polygon.apply(this, [multipolygon.components[i]]));
                    }
                    return array;
                },

                /**
                 * Method: extract.collection
                 * Return an array of geometries from a geometry collection.
                 *
                 * Parameters:
                 * collection - {<OpenLayers.Geometry.Collection>}
                 *
                 * Returns:
                 * {Array} An array of geometry objects representing the geometry
                 *     collection.
                 */
                'collection': function(collection) {
                    var len = collection.components.length;
                    var array = new Array(len);
                    for (var i = 0; i < len; ++i) {
                        array[i] = this.extract.geometry.apply(
                            this, [collection.components[i]]
                        );
                    }
                    return array;
                }
            }
        });
        return new geoJson();
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();
