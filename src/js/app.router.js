/**
 * { name: config }
 */
EMAPP.States = {

    login: {
        url: '/dashboard/login',
        templateUrl: 'dist/html/login.min.html',
        controller: function() {
            document.title = '用户登录'
        }
    },
    logout: {
        url: '/dashboard/logout',
        templateUrl: 'dist/html/login.min.html'
    },

    dashboard: {
        url: '/dashboard',
        templateUrl: 'dist/html/project.min.html',
        resolve: {
            fontAwesome: ['lazyLoad', function(lazyLoad) {
                return lazyLoad.css('/vendor/font-awesome/css/font-awesome.min.css', true)
            }],
            scripts: ['lazyLoad', function(lazyLoad) {
                return lazyLoad.js('/dist/js/controllers/project.min.js')
            }]
        }
    },

    'dashboard.main': {
        url: '/main',
        views: {
            'dashboard@dashboard': {
                templateUrl: 'dist/html/project/main.min.html'
            }
        },
        data: {
            title: '首页'
        },
        resolve: {
            scripts: ['lazyLoad', function(lazyLoad) {
                return lazyLoad.js([
                    '/dist/js/controllers/project/main.min.js',
                    '/dist/js/directives/datetimepicker.min.js',
                    '/dist/js/directives/highcharts.min.js',
                    '/dist/js/services/pies.min.js',
                    '/dist/js/services/lines.min.js',
                    '/vendor/highcharts/highcharts.min.js'
                ])
            }]
        }
    },
    'dashboard.monitor': {
        url: '/monitor',
        views: {
            'dashboard@dashboard': {
                templateUrl: 'dist/html/project/monitor.min.html'
            }
        },
        data: {
            title: '设备状态'
        },
        resolve: {
            scripts: ['lazyLoad', function(lazyLoad) {
                return lazyLoad.js([
                    '/dist/js/controllers/project/monitor.min.js',
                    '/dist/js/directives/pagination.min.js'
                ])
            }]
        }
    },
    'dashboard.analyze': {
        url: '/analyze',
        views: {
            'dashboard@dashboard': {
                templateUrl: 'dist/html/project/analyze.min.html'
            }
        },
        data: {
            title: '能耗分析'
        },
        resolve: {
            scripts: ['lazyLoad', function(lazyLoad) {
                return lazyLoad.js([
                    '/vendor/highcharts/highcharts.min.js',
                    '/dist/js/controllers/project/analyze.min.js',
                    '/dist/js/directives/jscrollpane.min.js',
                    '/dist/js/directives/highcharts.min.js',
                    '/dist/js/services/pies.min.js',
                    '/dist/js/services/lines.min.js'
                ])
            }]
        }
    },
    'dashboard.statistic': {
        url: '/statistic',
        views: {
            'dashboard@dashboard': {
                templateUrl: 'dist/html/project/statistic.min.html'
            }
        },
        data: {
            title: '统计'
        },
        resolve: {
            styles: ['lazyLoad', function(lazyLoad) {
                return lazyLoad.css('/vendor/angular-ui-grid/ui-grid.min.css')
            }],
            scripts: ['lazyLoad', 'loadModules', function(lazyLoad, loadModules) {
                return lazyLoad.js([
                    '/vendor/angular-ui-grid/ui-grid.min.js',
                    '/dist/js/controllers/project/statistic.min.js',
                    '/dist/js/directives/datetimepicker.min.js'
                ], function() {
                    loadModules(['ui.grid', 'ui.grid.exporter'])
                })
            }]
        }
    }

};
