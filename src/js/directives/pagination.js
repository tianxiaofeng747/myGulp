EMAPP.register.directive('pagination', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            config: '=',
            click: '='
        },
        template: '<ul><li ng-repeat="item in paging" ng-class="{active:active===item.val}"><a ng-href="{{item.href}}" ng-click="click(item.page)" ng-bind-html="item.val"></a></li></ul>',
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.config
            }, function (config) {
                if (config) {

                    //获取配置
                    config = angular.extend({
                        pageindex: 1,
                        pagesize: 15,
                        count: 0,
                        split: 5,
                        prevName: '<i class="glyphicon glyphicon-chevron-left"></i>',
                        nextName: '<i class="glyphicon glyphicon-chevron-right"></i>'
                    }, config);
                    //分页数
                    config.pagecount = Math.ceil(config.count / config.pagesize);
                    //分页组
                    config.pagegroup = Math.ceil(config.pagecount / config.split);
                    //第几组
                    config.groupindex = Math.ceil(config.pageindex / config.split);

                    //定义变量
                    var items = [], length = config.split, i, page;

                    //显示上一页
                    if (config.prevName && config.pageindex > 1) {
                        items.push({
                            prev: true,
                            page: config.pageindex - 1,
                            val: config.prevName,
                            href: 'javascript:void(0)'
                        })
                    }

                    //显示首页
                    if (config.pagegroup > 1 && config.groupindex > 1) {
                        items.push({
                            first: true,
                            page: 1,
                            val: '1...',
                            href: 'javascript:void(0)'
                        })
                    }

                    //遍历页码
                    for (i = 0; i < length; i++) {
                        page = parseInt((config.groupindex - 1) * length + i + 1);
                        page <= config.pagecount && items.push({
                            page: page,
                            val: page,
                            href: '#' + page
                        })
                    }

                    //显示末页
                    if (config.pagegroup > 1 && config.groupindex < config.pagegroup) {
                        items.push({
                            last: true,
                            page: config.pagecount,
                            val: '...' + config.pagecount,
                            href: 'javascript:void(0)'
                        })
                    }

                    //显示下一页
                    if (config.nextName && config.pageindex < config.pagecount) {
                        items.push({
                            next: true,
                            page: config.pageindex + 1,
                            val: config.nextName,
                            href: 'javascript:void(0)'
                        })
                    }

                    //装载分页
                    scope.active = config.pageindex;
                    scope.paging = items;
                    $timeout(function () { element.find('a').click(function () { return false }) });

                }
            })
        }
    }
}]);