fastmap.uikit.canvasFeature.RdLinkSpeedLimitPart = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(linkPid,mac,mbd,direct) {
        var startEndArrow = null;//箭头图片
        var iconName = '';
        var resArray = mbd.split(",");
        this.geometry['coordinates'] = mac;
        this.properties['linkPid'] = linkPid;

        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};

        this.properties['speedValue'] = 0;
        this.properties['direct'] = direct;
        this.properties['condition'] = 0;
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDLINKSPEEDLIMIT";

        var speedValue = resArray[0];//限速值
        var limitSrc = parseInt(resArray[1]);//限速来源
        var rotate = resArray[2];//rotate
        this.properties['speedValue'] = parseInt(speedValue)/10;
        if(direct == 2){
            this.properties['fromLimitSrc'] = limitSrc;
        }else if(direct == 3){
            this.properties['toLimitSrc'] = limitSrc;
        }
        // if (limitSrc === "1") {//红色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "2") {//绿色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "3") {//黄色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "4") {//深蓝色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "5") {//浅粉色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "6") {//浅蓝色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "7") {//浅紫色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "8") {//黄绿色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // } else if(limitSrc === "9") {//紫色
        //     iconName = '../../../images/road/1101/normal_speedlimit_start' + '.svg';
        //     startEndArrow = "../../../images/road/1101/1101_0_0_s.svg";
        // }
            iconName = '../../../images/road/1101/linkspeedlimit_' +limitSrc+ '.svg';
            startEndArrow = '../../../images/road/1101/arrow_' +limitSrc+ '.svg';

        this.properties['markerStyle']["icon"].push(
            {
                iconName: iconName,
                text: parseInt(speedValue)/10,
                row: 0,
                column: 0,
                dx: 0,
                dy: 5,
                location:  this.geometry['coordinates'],
                rotate: (rotate - 90) * (Math.PI / 180)
            }
        );
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: startEndArrow,
                    row: 3,
                    column: 1,
                    location:  this.geometry['coordinates'],
                    rotate: (parseFloat(rotate) - 90) * (Math.PI / 180),
                    dx: 0,
                    dy: -11
                }
            )
        );
    }
});