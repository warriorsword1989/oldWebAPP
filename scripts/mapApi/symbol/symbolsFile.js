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
                pattern: [4, 4, 12, 4]
            }
        ]
    },
    {
        name: 'L_2_0',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#646464',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_1',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#646464',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_2',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#E5C8FF',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_3',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#FF6364',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_4',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#FFC000',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_5',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#0E7892',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_6',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#63DC13',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_7',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#C89665',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_8',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#C8C864',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_9',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#000000',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_10',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#00C0FF',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_11',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#DCBEBE',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_12',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#000000',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_13',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#7364C8',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_14',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#000000',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_2_15',//桥
        type: 'HashLineSymbol',
        hashHeight: 6,
        hashOffset: 0,
        hashAngle: -90,
        hashSymbol: {
            type: 'SampleLineSymbol',
            color: '#DCBEBE',
            width: 1,
            style: 'solid'
        },
        pattern: [2, 5]
    },
    {
        name: 'L_3',//施工
        type: 'MarkerLineSymbol',
        markerSymbol: {
            type: 'TiltedCrossPointSymbol',
            size: 3,
            color: 'red',
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

