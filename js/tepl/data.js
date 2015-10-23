/**
 * Created by liwanchong on 2015/10/19.
 */
var test = {
    pid: "121211",
    enterNode: "121211",
    exitNode: "131311",
    theory: "2",
    crossing: "0",
    researched: "1",
    time1: "20151011",
    time2: "20151019",
    selected: "14",
    info: [{flag: 1}, {flag: 2}, {flag: 3}, {flag: 4}],
    time:[{startTime:"20121212",endTime:"20121213"},{startTime:"20141214",endTime:"20141215"}]

};
var truckTest = {
    pid: "121211",
    inLinkPid: "121211",
    outLinkPid: "131311",
    relationShip: "2",
    type: "0",
    resOut: "1",
    resTrailer: true,
    resWeigh: "20",
    resAxleLoad: "12",
    resAxleCount: "11",
    time1: "20151011",
    time2: "20151019",
    info: [{flag: 1}, {flag: 2}, {flag: 3}, {flag: 4}],
    time:[{startTime:"20121212",endTime:"20121213"},{startTime:"20141214",endTime:"20141215"}]

};
var currentTest = {
    name: "ddd",
    nameCount: [
        {name: "jim", linkPid: "131313"},
        {name: "kate", linkPid: "131323"},
        {name: "linda", linkPid: "131333"},
        {name: "kate", linkPid: "131343"},
        {name: "poly", linkPid: "131353"},


    ]
}
var limitTest = {
    appInfo:"1",
    linkLimit: [
        {
            type: "2",
            limitDir: "3",
            tollType: "4",
            weather: "2",
            processFlag: "2"
        }, {
            type: "1",
            limitDir: "3",
            tollType: "4",
            weather: "2",
            processFlag: "2"
        },
        {
            type: "1",
            limitDir: "3",
            tollType: "4",
            weather: "2",
            processFlag: "2"
        },
        {
            type: "1",
            limitDir: "3",
            tollType: "4",
            weather: "2",
            processFlag: "2"
        },
    ],
    linkLimitTruck: [
        {
            truckFlag: "1",
            limitDir: "1",
            resTrailer: "1",
            resWeigh: "30",
            resAxleLoad: "30",
            resAxleCount: "8",
            resOut: "2"
        },{
            truckFlag: "1",
            limitDir: "1",
            resTrailer: "1",
            resWeigh: "30",
            resAxleLoad: "30",
            resAxleCount: "8",
            resOut: "2"
        },{
            truckFlag: "1",
            limitDir: "1",
            resTrailer: "1",
            resWeigh: "30",
            resAxleLoad: "30",
            resAxleCount: "8",
            resOut: "2"
        },{
            truckFlag: "1",
            limitDir: "1",
            resTrailer: "1",
            resWeigh: "30",
            resAxleLoad: "30",
            resAxleCount: "8",
            resOut: "2"
        },
    ]
}
var naviTest={
    diciType:"1",
    sideWalkFlag:"0",
    walkStairFlag:"2",
    walkFlag:"1"
}
var rticTest={
    intRticData:[
        {
            code:"1",
            rank:"2",
            rticDr:"2",
            updownFlag:"0",
            rangeType:"1"
        }
        ,{
            code:"2",
            rank:"1",
            rticDr:"2",
            updownFlag:"1",
            rangeType:"1"
        }
        ,{
            code:"1",
            rank:"2",
            rticDr:"2",
            updownFlag:"0",
            rangeType:"1"
        }
    ],
    carRticData:[
        {
            code: "1",
            rank: "1",
            rticDir: "2",
            updownFlag: "1",
            rangeType: "1"
        },
        {
            code:"2",
            rank:"1",
            rticDir:"2",
            updownFlag:"1",
            rangeType:"1"
        },
        {
            code:"1",
            rank:"2",
            rticDir:"1",
            updownFlag:"1",
            rangeType:"1"
        },
        {
            code:"2",
            rank:"2",
            rticDir:"2",
            updownFlag:"1",
            rangeType:"1"
        }
    ]
}
var zoneTest={
    developState:"1",
    urban:"1",
    leftRegionId:"0531",
    rightRegionId:"0228",
    diciType:"2",
    zoneLinkData:[
        {
            regionId:"0531",
            type:"1",
            side:"0"
        },
        {
            regionId:"0531",
            type:"2",
            side:"1"
        }
    ]
}