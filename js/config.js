/**
 * Created by liwanchong on 2015/10/21.
 */
var layer = {
    groupId: "1212",
    groupName: "参考图层",
    layers: [
        {
            name: "腾讯",
            id: 'tencent',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "single"
        },
        {
            name: "资三",
            id: 'zisan',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "single"
        },
        {
            name: "高德",
            id: 'gaode',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "single"
        },
        {
            name: "百度",
            id: 'baidu',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "single"
        },
        {
            name: "图幅",
            id: 'mappableUnit',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "multiple"
        }, {
            name: "照片",
            id: 'photo',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "multiple"
        },
        {
            name: "网格",
            id: 'gridding',
            url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
            options: {
                subdomains: ["rt0", "rt1", "rt2", "rt3"],
                tms: true,
                maxZoom: 18
            },
            show: false,
            selected: "multiple"
        }
    ]
}