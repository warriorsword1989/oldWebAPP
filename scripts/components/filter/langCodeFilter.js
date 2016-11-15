/**
 * Created by mali on 2016/10/18.
 */
angular.module('fastmap.uikit').filter('langCodeFilter', function () {
    return function (origin, selectedLangcode, curLangcode) {
    	var ret = [];
    	for (var p in origin) {
    		if (origin[p].id == curLangcode || selectedLangcode.indexOf(origin[p].id) < 0) {
    			ret.push(origin[p]);
    		}
    	}
        return ret;
    };
});
