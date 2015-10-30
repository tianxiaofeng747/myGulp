~function () {

    var linkFn = function ($parse, $q, $timeout, lazyLoad, scope, element, attrs, ctrl) {

        $q.all([
            lazyLoad.css('/vendor/smalot-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css', true),
            lazyLoad.js([
                '/vendor/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                '/vendor/smalot-bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js'
            ])
        ]).then(function () {

            (function (picker) {

                attrs.eventInit && $parse(attrs.eventInit, null, true)(scope, { $event: null });

                delete attrs.eventInit;

                angular.forEach(attrs, function (item, name) {
                    if (/^event/.test(name)) {
                        element.on(name.replace(/^event/, '').replace(/^\w/, function (v) { return v.toLowerCase() }), function (event) {
                            $timeout(function () {
                                $parse(attrs[name], null, true)(scope, { $event: event })
                            })
                        })
                    }
                });

                picker.find('.icon-arrow-left').replaceWith('<i class="glyphicon glyphicon-chevron-left"></i>');
                picker.find('.icon-arrow-right').replaceWith('<i class="glyphicon glyphicon-chevron-right"></i>');

            } (element.datetimepicker(angular.extend({
                language: 'zh-CN',
                format: 'yyyy/mm/dd hh:ii:ss',
                minView: 1
            }, element.data() || {})).data('datetimepicker').picker))

        })

    };

    EMAPP.register.directive('datetimepicker', ['$parse', '$q', '$timeout', 'lazyLoad', function ($parse, $q, $timeout, lazyLoad) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) { linkFn.call(this, $parse, $q, $timeout, lazyLoad, scope, element, attrs, ctrl) }
        }
    }]);

    EMAPP.register.directive('datetimepicker', ['$parse', '$q', '$timeout', 'lazyLoad', function ($parse, $q, $timeout, lazyLoad) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div></div>',
            link: function (scope, element, attrs, ctrl) { linkFn.call(this, $parse, $q, $timeout, lazyLoad, scope, element, attrs, ctrl) }
        }
    }]);

} ();