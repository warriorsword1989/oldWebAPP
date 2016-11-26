angular.module('dataService').service('dsMeta', ['$http', '$q', 'ajax', function ($http, $q, ajax) {
    // 大分类
    this.getTopKind = function () {
        var defer = $q.defer();
        ajax.get('metadata/queryTopKind/', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(0);
            }
        });
        return defer.promise;
    };
    // 中分类
    this.getMediumKind = function () {
        var defer = $q.defer();
        ajax.get('metadata/queryMediumKind/', {
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(-1);
            }
        });
        return defer.promise;
    };
    // 小分类
    this.getKindList = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryKind/', {
            parameter: JSON.stringify({
                region: param.region,
                mediumId: param.mediumId
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取分类出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };
    // 获取品牌
    this.getChainList = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryChain/', {
            parameter: JSON.stringify({
                kindCode: param.kindCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取分类出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };
    // 获取卡车信息
    this.queryTruck = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryTruck/', {
            parameter: JSON.stringify({
                kindCode: param.kindCode,
                chain: param.chain,
                fuelType: param.fuelType
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取卡车信息出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };
    // 根据分类和品牌获取等级
    this.getChainLevel = function (kindCode, chainCode) {
        var defer = $q.defer();
        ajax.get('metadata/chainLevel/', {
            parameter: JSON.stringify({
                kindCode: kindCode,
                chainCode: chainCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取等级出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };
    // 根据区号查询电话号码长度
    this.queryTelLength = function (code) {
        var defer = $q.defer();
        ajax.get('metadata/queryTelLength/', {
            parameter: JSON.stringify({
                code: code
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取电话长度出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getFocus = function () {
        var defer = $q.defer();
        ajax.get('metadata/queryFocus/', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(0);
            }
        });
        return defer.promise;
    };
    /* 获取餐饮类型*/
    this.queryFoodType = function (kindCode) {
        var defer = $q.defer();
        ajax.get('metadata/queryFoodType', {
            parameter: JSON.stringify({
                kindId: kindCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('加载菜品风味出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** ***************-------------------------------道路相关----------------------------************************/
    /**
     *  获取箭头图图片组
     * @param param
     * @param func
     */
    this.getArrowImgGroup = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/patternImage/search', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     *  获取箭头图图片
     * @param param
     * @param func
     */
    this.getArrowImg = function (param) {
        return App.Config.serviceUrl + '/metadata/patternImage/getById?parameter=' + param;
    };
    /**
     *  高速分歧 名称发音和语音
     * @param param
     * @param func
     */
    this.getNamePronunciation = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/convert', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                if (data.data.phonetic.indexOf('ERROR') > -1) {
                    defer.resolve(-1);
                } else {
                    defer.resolve(data);
                }
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 根据输入的道路名模糊查询所有道路名
    this.getNamesbyName = function (param) {
        var defer = $q.defer();
        ajax.get('edit/rdname/search', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 获取道路名数据列表
     */
    this.roadNameList = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/websearch', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询道路名列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 获取道路名数据列表
     */
    this.columnDataList = function (params) {
        var defer = $q.defer();
        ajax.getLocalJson('../colEditor/test.json', {}).success(function (data) {
            defer.resolve(data);
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 道路名称类型查询
     */
    this.nametypeList = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/nametype', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询道路名类型列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 道路名行政区划查询
     */
    this.adminareaList = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/adminarea', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询道路名行政区划列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 中文转拼音
     */
    this.convert = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/convert', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('中文转拼音出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 道路名称保存
     */
    this.roadNameSave = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/websave', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('道路名称保存出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 道路名组下英文/葡文检查
     */
    this.rdnameGroup = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/group', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('道路名组下英文/葡文检查出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 道路名拆分
     */
    this.rdnameSplit = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/webteilen', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                data = 1;
                defer.resolve(data);
            } else {
                data = 0;
                swal('道路名拆分出错：', data.errmsg, 'error');
                defer.resolve(data);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** ***************************** TMC相关  *********************************/
    /** *
     * 框选TMCPOINT查询TMC关系树
     */
    this.queryTmcTree = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryTmcTreeByIds', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 根据TMCID查TMCPOINT 和 TMCLINE
     */
    this.queryTmcData = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryTmcById', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 根据Name_id查询道路名
    this.queryRdNByNameID = function (nameId) {
        var defer = $q.defer();
        var param = {
            nameId: nameId
        };
        ajax.get('metadata/rdname/getByNameId/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('根据NameId查询道路名出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
