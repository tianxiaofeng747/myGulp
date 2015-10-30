EMAPP.register.directive('highcharts', ['$q', 'lazyLoad', function ($q, lazyLoad) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs, ctrl) {

            scope.$watch(attrs.config, function (config) {

                if (config) {

                    $q.all([
                        !Highcharts ? lazyLoad.js('/vendor/highcharts/highcharts.min.js') : null
                    ]).then(function () {

                        Highcharts.setOptions({
                            lang: {
                                shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                                weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                                resetZoom: '重置范围',
                                resetZoomTitle: '重围显示范围1:1大小'
                            },
                            credits: {
                                enabled: false
                            }
                        });

                        element.highcharts(config);

                    });

                }

            })

        }
    }
}]);