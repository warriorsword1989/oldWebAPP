fastmap.uikit.canvasFeature.RdSpeedLimit = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        var startEndArrow = null;//箭头图片
        var iconName = '';
        var resArray = item.m.b.split("|");
        var type = item.m.a;
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDSPEEDLIMIT";
        if (type == 0) {
            var fieldCollection = resArray[0];//采集标志（0,现场采集;1,理论判断）
            var speedFlag = resArray[1];//限速标志(0,限速开始;1,解除限速)
            var speedValue = resArray[2];//限速值
            if (fieldCollection === "1") {//理论判断，限速开始和结束都为蓝色
                if (speedFlag === "0") {//解除限速
                    iconName = '../../../images/road/1101/theory_speedlimit_start' + '.svg';
                    startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
                } else {
                    iconName = '../../../images/road/1101/theory_speedlimit_end' + '.svg';
                    startEndArrow = "../../../images/road/1101/1101_1_1_e.svg";
                }
                startEndArrow = "../../../images/road/1101/1101_1_1_s.svg";
            } else {//现场采集，限速开始为红色，结束为黑色
                if (speedFlag === "0") {//解除限速
                    iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
                    startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
                } else {
                    iconName = '../../../images/road/1101/normal_speedlimit_end' + '.svg';
                    startEndArrow = "../../../images/road/1101/1101_1_1_e.svg";
                }
            }
            this.properties['markerStyle']["icon"].push(
                {
                    iconName: iconName,
                    text: speedValue,
                    row: 0,
                    column: 0,
                    dx: 0,
                    dy: 5,
                    location:  this.geometry['coordinates'],
                    rotate: (item.m.c - 90) * (Math.PI / 180)
                }
            );
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: startEndArrow,
                        row: 0,
                        column: 1,
                        location:  this.geometry['coordinates'],
                        rotate: (item.m.c - 90) * (Math.PI / 180),
                        dx: (speedFlag == "1" ? -50 : 6),//解除限速时，要使箭头冲着自己,
                        dy: 0
                    }
                )
            );
        } else if (type == 3) {
            var limitSpeed = resArray[1];
            var condition = resArray[2];
            var limitSpeedFlag = resArray[0];
            var conditionObj = {
                '1': '雨',
                '2': '雪',
                '3': '雾',
                '6': '学',
                '10': '时',
                '11': '车',
                '12': '季',
                '13': '医',
                '14': '购物',
                '15': '居',
                '16': '企',
                '17': '景',
                '18': '交'
            };
            if (limitSpeedFlag == "0") {
                iconName = '../../../images/road/1101/condition_speedlimit_start' + '.svg';
                startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
            } else if (limitSpeedFlag == "1") {
                iconName = '../../../images/road/1101/condition_speedlimit_end' + '.svg';
                startEndArrow = "../../../images/road/1101/1101_1_1_e.svg";
            }

            this.properties['markerStyle']["icon"].push(
                {
                    iconName: iconName,
                    text: conditionObj[condition] + limitSpeed,
                    row: 0,
                    column: 0,
                    dx: 0,
                    dy: 5,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 90) * (Math.PI / 180)
                }
            );

            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: startEndArrow,
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates'],
                        rotate: (item.m.c - 90) * (Math.PI / 180),
                        dx: (limitSpeedFlag == "1" ? -50 : 20),//解除限速时，要使箭头冲着自己,
                        dy: 0
                    }
                )
            );

        } else if (type == 4) { //车道限速
            var limitSpeed = item.m.b.split(",")[0];
            var laneSpeed = item.m.b.split(",")[1];
            iconName = '../../../images/road/1101/lane_speedlimit' + '.svg';
            this.properties['markerStyle']["icon"].push(
                {
                    iconName: iconName,
                    text: limitSpeed,
                    row: 0,
                    column: 0,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 270) * (Math.PI / 180),
                    dx: 0,
                    dy: 5
                }
            );

            //方向箭头
            startEndArrow = "../../../images/road/1101/lane_speedlimit_arrow.svg";
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: startEndArrow,
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates'],
                        rotate: (item.m.c - 90) * (Math.PI / 180),
                        dx: 12,//箭头间距
                        dy: 0
                    }
                )
            );
            //车道限速值
            this.properties['markerStyle']["icon"].push(
                {

                    text: laneSpeed,
                    row: 0,
                    column: 2,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 270) * (Math.PI / 180),
                    dx: 25,
                    dy: 6
                }
            );
        }
    }
});