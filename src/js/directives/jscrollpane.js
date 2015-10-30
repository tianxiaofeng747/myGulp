EMAPP.register.directive('jscrollpane', ['$q', '$timeout', 'lazyLoad', function ($q, $timeout, lazyLoad) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            $q.all([
                lazyLoad.css('/vendor/jScrollPane/style/jquery.jscrollpane.min.css', true),
                lazyLoad.js([
                    '/vendor/jScrollPane/script/jquery.mousewheel.min.js',
                    '/vendor/jScrollPane/script/jquery.jscrollpane.min.js'
                ])
            ]).then(function () {
                element.jScrollPane(attrs.jscrollpane ? $parse(attrs.jscrollpane, /* interceptorFn */ null, /* expensiveChecks */ true)(scope, { $event: null }) : {})
            })
        }
    }
}]);