/**
* @param {Object} options
*      options.title
*      options.unit
*      options.series
*      options.type = 'area'
*      options.series.name
*      options.series.data
*      options.series.pointStart
*      options.series.pointInterval
* return {Object}
*/
EMAPP.register.factory('Lines', function () {
    return function (options) {
        return {
            colors: options.colors || ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            chart: {
                type: options.type || 'column',
                zoomType: 'x',
                spacingRight: 10,
                backgroundColor: options.backgroundColor || null,
                events: options.chartevents || null
            },
            title: options.title,
            xAxis: options.xAxis || {
                type: 'datetime',
                maxZoom: 1000 * 60 * 60 * 24,
                title: {
                    text: null
                },
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%m',
                    year: '%Y'
                }
            },
            yAxis: {
                title: {
                    text: options.unit || ''
                }
            },
            tooltip: options.tooltip || {
                shared: true,
                xDateFormat: '%Y年%m月%d日',
                pointFormat: '{series.name}: <b>{point.y:.2f}kWh</b><br/>'
            },
            legend: {
                enabled: typeof options.legend !== 'boolean' ? true : options.legend
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 2,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                column: (options.plotOptions && options.plotOptions.column) || {},
                series: options.plotOptions && options.plotOptions.series || {},
                line: options.plotOptions && options.plotOptions.line || {}
            },
            series: options.series
        }
    }
});