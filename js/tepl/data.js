/**
 * Created by liwanchong on 2015/10/19.
 */
var items= [
    {id:"123",name: "test1", show: true, choose: false, editor: true},
    {id:"122",name: "test2", show: false, choose: false, editor: false},
    {id:"121",name: "test3", show: true, choose: true, editor: false},
    {id:"120",name: "test4", show: true, choose: false, editor: false},
    {id:"124",name: "test5", show: true, choose: false, editor: false},
    {id:"125",name: "test6", show: false, choose: false, editor: false},
    {id:"126",name: "test7", show: true, choose: false, editor: false},
    {id:"127",name: "test8", show: true, choose: false, editor: false},
    {id:"128",name: "test9", show: false, choose: false, editor: false},
    {id:"129",name: "test10", show: true, choose: false, editor: false},
    {id:"130",name: "test11", show: true, choose: false, editor: false},
    {id:"131",name: "test12", show: false, choose: false, editor: false},
    {id:"132",name: "test13", show: true, choose: false, editor: false},
    {id:"133",name: "test14", show: true, choose: false, editor: false},
    {id:"134",name: "test15", show: false, choose: false, editor: false},
    {id:"135",name: "test16", show: true, choose: false, editor: false},
    {id:"136",name: "test17", show: true, choose: false, editor: false},
    {id:"137",name: "test18", show: false, choose: false, editor: false},
    {id:"138",name: "test19", show: true, choose: false, editor: false},
    {id:"139",name: "test20", show: true, choose: false, editor: false},
    {id:"140",name: "test21", show: true, choose: false, editor: false},
    {id:"141",name: "test22", show: true, choose: false, editor: false},
    {id:"142",name: "test23", show: true, choose: false, editor: false},
    {id:"143",name: "test24", show: false, choose: false, editor: false},
    {id:"144",name: "test25", show: true, choose: false, editor: false},
    {id:"145",name: "test26", show: false, choose: false, editor: false},
    {id:"146",name: "test27", show: true, choose: false, editor: false},
    {id:"147",name: "test28", show: true, choose: false, editor: false},
    {id:"148",name: "test29", show: true, choose: false, editor: false},
    {id:"149",name: "test30", show: true, choose: false, editor: false},
    {id:"150",name: "test31", show: false, choose: false, editor: false},
    {id:"151",name: "test32", show: true, choose: false, editor: false},
    {id:"152",name: "test33", show: false, choose: false, editor: false},
    {id:"153",name: "test34", show: true, choose: false, editor: false},
    {id:"154",name: "test35", show: true, choose: false, editor: false},
    {id:"155",name: "test36", show: false, choose: false, editor: false},
    {id:"156",name: "test37", show: true, choose: false, editor: false},
    {id:"157",name: "test38", show: true, choose: false, editor: false},
    {id:"158",name: "test39", show: false, choose: false, editor: false},
    {id:"159",name: "test40", show: true, choose: false, editor: false}
];
var test = {
    pid: "121211",
    inLinkPid: "121211",
    restricInfo: [{flag: 1}, {flag: 2}, {flag: 3}, {flag: 4}],
    outLinkPid: "131311",
    flag: "2",
    relationshipType: "1",
    type: "0",
    time:[{startTime:"20121212",endTime:"20121213"},{startTime:"20141214",endTime:"20141215"}],
    vehicleExpression: "14"

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
var zoneTest = {
    developState: "1",
    urban: "1",
    leftRegionId: "0531",
    rightRegionId: "0228",
    diciType: "2",
    zoneLinkData: [
        {
            regionId: "0531",
            type: "1",
            side: "0"
        },
        {
            regionId: "0531",
            type: "2",
            side: "1"
        }
    ]
};
var dataTipsData = {
    id: "234532",
    o_array: [
        {
            oInfo: 1,
            id: "121212"
        }, {
            oInfo: 2,
            id: "121213"
        }, {
            oInfo: 3,
            id: "121214"
        },


    ]

};
