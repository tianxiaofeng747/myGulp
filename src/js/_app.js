window.EMAPP = angular.module('EMAPP', ['ngCookies', 'ngResource', 'ngSanitize', 'ngMd5', 'ui.router', 'oitozero.ngSweetAlert'])

.run(['$templateCache', function($templateCache) {

    /*  public $templateCache  */
    EMAPP.templateCache = $templateCache;

}])

.config(['$animateProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', function($animateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {

    /*  provider register  */
    EMAPP.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        provider: $provide.provider,
        constant: $provide.constant,
        value: $provide.value,
        factory: $provide.factory,
        service: $provide.service
    };

    /*  HTML5 mode  */
    $locationProvider.html5Mode(true);

    /*  register the interceptor via an anonymous factory  */
    $httpProvider.interceptors.push(['$q', '$location', '$cookies', 'SweetAlert', 'viewMask', function($q, $location, $cookies, SweetAlert, viewMask) {
        return {
            request: function(request) {
                viewMask.open();
                if (request.url && /\/api\//i.test(request.url) && request.method) {
                    delete(request.data || request.params || {})._api_action;
                    //if (request.method.toUpperCase() !== 'GET') {
                    //request.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                    //request.transformRequest = [function (data) { return angular.isObject(data) ? $.param(angular.forEach(data, function (item, key) { data[key] = (angular.isArray(item) || angular.isObject(item)) ? JSON.stringify(item) : item })) : data }];
                    //}
                    request.url = decodeURIComponent(request.url);
                }
                return request
            },
            requestError: function(request) {
                return $q.reject(request)
            },
            response: function(response) {
                if (response.config) {
                    viewMask.close();
                    if (response.data.code === 90000005) {
                        EMAPP.User = {};
                        angular.forEach(['token', 'user'], function(key) {
                            $cookies.remove(key, {
                                path: '/',
                                domain: '.gugecc.com'
                            })
                        });
                        $location.url('/dashboard/login');
                        response.data.message && SweetAlert.warning(response.data.message);
                    } else {
                        response.data.message && SweetAlert.success(response.data.message);
                    }
                }
                return response
            },
            responseError: function(response) {
                if (response.config) {
                    viewMask.close();
                    if (response.data.code === 90000005) {
                        EMAPP.User = {};
                        angular.forEach(['token', 'user'], function(key) {
                            $cookies.remove(key, {
                                path: '/',
                                domain: '.gugecc.com'
                            })
                        });
                        $location.url('/dashboard/login');
                        response.data.message && SweetAlert.warning(response.data.message);
                    } else {
                        response.data.message && SweetAlert.error(response.data.message);
                    }
                }
                return $q.reject(response)
            }
        }
    }]);

    /*  lazyLoad service  */
    $provide.service('lazyLoad', ['$q', 'viewMask', function($q, viewMask) {

        this.cache = {};

        this.css = function(path) {

            var cache = this.cache,
                deferred = $q.defer(),
                deferredList = [],
                callback,
                preload,
                $ua = navigator.userAgent;

            if (typeof arguments[1] === 'boolean') {
                callback = arguments[2];
                preload = arguments[1];
            } else {
                callback = arguments[1];
                preload = arguments[2];
            }

            angular.forEach(path instanceof Array ? path : [path], function(url, deferred, element) {
                deferred = cache[url] || $q.defer();
                deferredList.push(deferred.promise);
                if (!cache[url]) {
                    element = document.createElement('link');
                    element.rel = 'stylesheet';
                    if (preload) {
                        cache[url] = deferred
                    } else {
                        element.className = 'lazyLoad-stylesheet'
                    }
                    if (/(?:Android);?[\s\/]+([\d.]+)?/i.test($ua) || /(?:iPad|iPod|iPhone).*OS\s([\d_]+)/i.test($ua)) {
                        (function poll(count, loaded) {
                            if (/webkit/i.test($ua)) {
                                if (element.sheet) {
                                    loaded = true
                                }
                            } else if (element.sheet) {
                                try {
                                    if (element.sheet.cssRules) {
                                        loaded = true
                                    }
                                } catch (ex) {
                                    if (ex.name === 'SecurityError' || ex.code === 1000) {
                                        loaded = true
                                    }
                                }
                            }
                            if (loaded || (count >= 200)) {
                                deferred.resolve()
                            } else {
                                setTimeout(function() {
                                    poll(count + 1)
                                }, 10)
                            }
                        }(0))
                    } else {
                        element[document.addEventListener ? 'onload' : 'onreadystatechange'] = function(_, isAbort) {
                            if (isAbort || !element.readyState || /loaded|complete/.test(element.readyState)) {
                                deferred.resolve()
                            }
                        }
                    }
                    element.onerror = function() {
                        deferred.reject(url)
                    };
                    element.setAttribute('charset', 'utf-8');
                    element.href = url;
                    (document.head || document.getElementsByTagName('head')[0]).appendChild(element);
                }
            });

            viewMask.open();
            $q.all(deferredList).then(function() {
                (callback || angular.noop)();
                setTimeout(deferred.resolve);
                viewMask.close();
            }, function() {
                setTimeout(deferred.reject);
                viewMask.close();
                console.error('lazyLoad-css-error:', arguments[0]);
            });

            return deferred.promise;

        };

        this.js = function(path) {

            var cache = this.cache,
                deferred = $q.defer(),
                deferredList = [],
                loadList = [],
                callback = arguments[1];

            angular.forEach(path instanceof Array ? path : [path], function(url, deferred, element) {
                deferred = cache[url] || $q.defer();
                deferredList.push(deferred.promise);
                if (!cache[url]) {
                    cache[url] = deferred;
                    loadList.push(url);
                }
            });

            (function load(index, element, url) {
                if (url = loadList[index]) {
                    element = document.createElement('script');
                    element[document.addEventListener ? 'onload' : 'onreadystatechange'] = function(_, isAbort) {
                        if (isAbort || !element.readyState || /loaded|complete/.test(element.readyState)) {
                            document.body.removeChild(element);
                            cache[url].resolve();
                            load(index + 1);
                        }
                    };
                    element.onerror = function() {
                        cache[url].reject(url);
                        load(index + 1);
                    };
                    element.setAttribute('charset', 'utf-8');
                    element.src = url;
                    document.body.appendChild(element);
                }
            }(0));

            viewMask.open();
            $q.all(deferredList).then(function() {
                (callback || angular.noop)();
                setTimeout(deferred.resolve);
                viewMask.close();
            }, function() {
                setTimeout(deferred.reject);
                viewMask.close();
                console.error('lazyLoad-js-error:', arguments[0]);
            });

            return deferred.promise;

        };

    }]);


    ////////////////////////////////////
    // Module Loading
    ////////////////////////////////////
    $provide.factory('loadModules', ['$cacheFactory', '$injector', '$log', function($cacheFactory, $injector, $log) {

        var loadedModules = $cacheFactory('loadedModules'),
            providers = {
                $animateProvider: $animateProvider,
                $compileProvider: $compileProvider,
                $controllerProvider: $controllerProvider,
                $filterProvider: $filterProvider,
                $provide: $provide
            },
            level = 0;

        return function loadModules(modulesToLoad) {

            var runBlocks = [],
                moduleFn;

            level++;

            angular.forEach(angular.isArray(modulesToLoad) ? modulesToLoad : [modulesToLoad], function(module) {

                if (loadedModules.get(module)) return;
                loadedModules.put(module, true);

                function runInvokeQueue(queue) {
                    var i, ii;
                    for (i = 0, ii = queue.length; i < ii; i++) {
                        var invokeArgs = queue[i],
                            provider = providers[invokeArgs[0]];
                        provider && provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                    }
                }

                try {
                    if (angular.isString(module)) {
                        moduleFn = angular.module(module);
                        runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
                        level--;
                        runInvokeQueue(moduleFn._invokeQueue);
                        runInvokeQueue(moduleFn._configBlocks);
                    } else if (angular.isFunction(module) || angular.isArray(module)) {
                        runBlocks.push(module);
                    }
                } catch (e) {
                    if (angular.isArray(module)) {
                        module = module[module.length - 1];
                    }
                    if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
                        e = e.message + '\n' + e.stack;
                    }
                    throw $log.error('Failed to instantiate module ' + module + ' due to:\n' + (e.stack || e.message || e));
                }
            });

            if (level === 1) {
                level--;
                angular.forEach(runBlocks, function(item) {
                    $injector.invoke(item);
                });
            }

            return runBlocks;

        }

    }]);

    $provide.factory('routerSetup', [function() {
        return function() {

            $urlRouterProvider.otherwise('/dashboard');

            angular.forEach(EMAPP.States, function(config, name) {
                $stateProvider.state(name, config)
            });

        }
    }]);

    /*  api service  */
    /*
     * $resource(url, [paramDefaults], [actions], options);
     *
     * config:
     * $api.apply({
     *  name1 : [url{String}, paramDefaults{Object}|null, actions{Object}|null, options{Object}|null],
     *  name2 : [url{String}, paramDefaults{Object}|null, actions{Object}|null, options{Object}|null],
     *  name3 : [url{String}, paramDefaults{Object}|null, actions{Object}|null, options{Object}|null],
     * });
     *
     * use:
     * $api.name1.action([parameters], [success], [error])
     * $api.name2.action([parameters], postData, [success], [error])
     */
    $provide.service('$api', ['$resource', function($resource) {

        var fullUrl = function(url, bool) {
            return (/(^http:\/\/)|(^https:\/\/)|(^\/)/.test(url) ? url : (location.protocol + '//' + location.host + '/api/' + url)) + (bool ? '/:_api_action' : '')
        };

        angular.forEach(EMAPP.api, function(item, name) {

            if (item instanceof Array) {

                var url = item[0],
                    paramDefaults = item[1],
                    actions = item[2],
                    options = item[3];

                if (url) {

                    actions = angular.forEach(angular.extend({
                        get: {
                            method: 'GET'
                        },
                        list: {
                            method: 'GET'
                        },
                        search: {
                            method: 'GET'
                        },
                        set: {
                            method: 'POST'
                        },
                        create: {
                            method: 'POST'
                        },
                        update: {
                            method: 'POST'
                        },
                        remove: {
                            method: 'POST'
                        },
                        delete: {
                            method: 'POST'
                        }
                    }, actions), function(action, name) {
                        action = action || {};
                        if (action.url) {
                            action.url = fullUrl(action.url)
                        }
                        action.method = action.method || 'GET';
                        action.params = angular.extend(action.url ? {} : {
                            _api_action: name
                        }, action.params);
                    });

                    this[name] = $resource(fullUrl(url, true), paramDefaults, actions, options);

                }

            }

        }, this);

    }]);

    /*  view mask  */
    $provide.service('viewMask', function() {
        var count = 0,
            element = $('<div class="view-mask"><div class="progress"><div class="progress-bar progress-bar-striped active" style="width: 100%"></div></div></div>').appendTo(document.body),
            mask = function(callback, bool, closeAll) {

                if (bool) {
                    count++;
                    element.show();
                } else {
                    if (closeAll) {
                        count = 0
                    } else {
                        count--
                    }
                    count <= 0 && element.hide();
                }
                setTimeout(callback || angular.noop)
            };
        this.open = function() {
            mask(arguments[0], true);
        };
        this.close = function() {
            var callback, closeAll;
            if (arguments[0] instanceof Function) {
                callback = arguments[0];
                closeAll = arguments[1];
            } else {
                callback = null;
                closeAll = arguments[0];
            }
            setTimeout(function() {
                mask(callback, false, closeAll)
            }, 200);
        };
    });

}]);
