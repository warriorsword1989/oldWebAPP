/*
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */

L.drawVersion = '0.2.4-dev';

L.drawLocal = {
	draw: {
		toolbar: {
			actions: {
				//title: 'Cancel drawing',
				text: '取消'
			},
			undo: {
				title: 'Delete last point drawn',
				text: 'Delete last point'
			},
			buttons: {
				polyline: 'Draw a polyline',
				polygon: 'Draw a polygon',
				rectangle: 'Draw a rectangle',
				circle: 'Draw a circle',
				marker: 'Draw a marker'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: '点击并拖动可以画一个圆.'
				},
				radius: 'Radius'
			},
			marker: {
				tooltip: {
					start: '点击地图上一个位置.'
				}
			},
			polygon: {
				tooltip: {
					start: '点击地图开始绘制.',
					cont: '继续点击地图.',
					end: '继续点击或者点击第一个点结束绘制.'
				}
			},
			polyline: {
				error: '<strong>Error:</strong> shape edges cannot cross!',
				tooltip: {
					start: '点击地图开始画线.',
					cont: '继续点击地图.',
					end: '继续点击或者点击最后一个点结束绘制.'
				}
			},
			rectangle: {
				tooltip: {
					start: '点击并拖动可以画一个矩形.'
				}
			},
			simpleshape: {
				tooltip: {
					end: '释放鼠标以完成绘制.'
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: 'Save changes.',
					text: 'Save'
				},
				cancel: {
					title: 'Cancel editing, discards all changes.',
					text: 'Cancel'
				}
			},
			buttons: {
				edit: 'Edit layers.',
				editDisabled: 'No layers to edit.',
				remove: 'Delete layers.',
				removeDisabled: 'No layers to delete.'
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Drag handles, or marker to edit feature.',
					subtext: 'Click cancel to undo changes.'
				}
			},
			remove: {
				tooltip: {
					text: 'Click on a feature to remove'
				}
			}
		}
	}
};
