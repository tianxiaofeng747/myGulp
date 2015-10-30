~function () {

    /**
     * @param {Object} options
     *      options.title
     *      options.series
     *      options.series.type == 'pie'
     *      options.series.name
     *      options.innerSize : 中空的比例
     *      option.enableDataLabels : 是否启用提示
     *      option.chartWidth: 图表宽度
     *      option.titleVerticalAlign : 标题水平对齐方式
     *      option.titleY : 标题Y轴取值
     *      option.titleX : 标题X轴取值
     *      option.titleStyle : 标题样式
     *      option.tooltip : 提示框配置
     *      option.legend : 图例配置
     *      options.pie : 饼状图配置
     * @return {Object}
     */
    function Pies(options) {
        return {
            chart: options.chart || {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: options.backgroundColor || null
            },
            title: options.titleObj || {
                text: options.title || '',
                verticalAlign: options.titleVerticalAlign || '',
                align: options.titleAlign || 'center',
                x: options.titleX || 0,
                y: options.titleY || 15,
                style: options.titleStyle || { "color": "#333333", "fontSize": "18px" },
                useHTML: true
            },
            legend: options.legend || {},
            tooltip: options.tooltip || {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: options.pie || {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: (options.enableDataLabels && true),
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    },
                    innerSize: options.innerSize || 0,
                    showInLegend: options.legend == undefined ? false : options.legend
                }
            },
            series: options.series
        }
    }

    angular.extend(Pies.prototype, {
        title: function () {
            var title = '';
            var input = this.input;

            if (!input) {
                return title;
            }

            title += input.user ? input.user.name : '全部';
            title += '商户';
            title += input.category ? input.category.name : '全部';
            title += '传感器类型';
            title += '<br />下的所有传感器能耗对比'

            return title;
        },

        data: function () {
            var input = this.input;
            var result = [];
            var total = 0;

            if (!input || !input.data || !input.sensors) {
                return result;
            }

            _.each(input.data, function (datapoints, id) {
                var last = _.last(datapoints);
                var sensor = _.find(input.sensors, function (s) {
                    return s._id == id;
                });

                result.push([
                    sensor.title,
                    parseFloat(last.value)
                ]);
            });

            total = _.reduce(result, function (a, b) {
                return a[1] + b[1];
            });

            _.each(result, function (item) {
                item[1] /= total;
                item[1] *= 100;
            });

            return result;
        }
    });

    EMAPP.register.factory('Pies', function () { return Pies });

} ();