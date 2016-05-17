/**
 * Created by xujie on 2016/5/15 0015.
 */

fastmap.mapApi.symbol.symbols = [
    {
        name: 'L_1',//区域内道路符号
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'SampleLineSymbol',
                color: 'gray',
                width: 1,
                style: 'solid'
            },
            {
                type: 'CartoLineSymbol',
                color: 'blue',
                width: 1,
                pattern: [2, 4, 6, 4]
            }
        ]
    },
    {
        name: 'L_2',//桥
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'SampleLineSymbol',
                color: 'gray',
                width: 1,
                style: 'solid'
            },
            {
                type: 'HashLineSymbol',
                hashHeight: 5,
                hashOffset: 0,
                hashAngle: -90,
                hashSymbol: {
                    type: 'SampleLineSymbol',
                    color: 'gray',
                    width: 1,
                    style: 'solid'
                },
                pattern: [2, 4, 6, 4]
            }
        ]
    },
    {
        name: 'L_3',//施工
        type: 'MarkerLineSymbol',
        markerSymbol: {
            type: 'PicturePointSymbol',
            url: '../../images/road/1101/1101_0_0_0.svg',
            //url:'../../images/road/img/header.png',
            size: 10,
            angle: 0,
            offsetX: 0,
            offsetY: 0,
            hasOutLine: false,
            outLineColor: 'black',
            outLineWidth: 1
        },
        pattern: [2, 10]
    }
];

