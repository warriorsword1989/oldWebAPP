/**
 * Created by linglong on 2016/8/26.
 */
FM.dataApi.IxPoiBusinesstime = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_BUSINESSTIME',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.monSrt = data.monSrt || '';
        this.monEnd = data.monEnd || '';
        this.weekInYearSrt = data.weekInYearSrt || '';
        this.weekInYearEnd = data.weekInYearEnd || '';
        this.weekInMonthSrt = data.weekInMonthSrt || '';
        this.weekInMonthEnd = data.weekInMonthEnd || '';
        this.validWeek = data.validWeek || '';
        this.daySrt = data.daySrt || '';
        this.dayEnd = data.dayEnd || '';
        this.timeSrt = data.timeSrt || '';
        this.timeDur = data.timeDur || '';
        this.reserved = data.reserved || '';
        this.memo = data.memo || '';
    },

    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.monSrt = this.monSrt;
        ret.monEnd = this.monEnd;
        ret.weekInYearSrt = this.weekInYearSrt;
        ret.weekInYearEnd = this.weekInYearEnd;
        ret.weekInMonthSrt = this.weekInMonthSrt;
        ret.weekInMonthEnd = this.weekInMonthEnd;
        ret.validWeek = this.validWeek;
        ret.daySrt = this.daySrt;
        ret.dayEnd = this.dayEnd;
        ret.timeSrt = this.timeSrt;
        ret.timeDur = this.timeDur;
        ret.reserved = this.reserved;
        ret.memo = this.memo;
        return ret;
    }
});
