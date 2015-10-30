EMAPP.controller('EMAPP.controller', ['$rootScope', '$location', '$state', '$api', '$cookies', 'md5', 'routerSetup', 'SweetAlert', function($rootScope, $location, $state, $api, $cookies, md5, routerSetup, SweetAlert) {

    var self = this,

        //路由初始化
        uirouterInit = function(stylesheet) {
            //通过路由判断设置是否初次加载
            if ($state.get().length === 1) {

                $(document.body).addClass('body-background');

                //State Change Events
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    stylesheet = $('link[class=lazyLoad-stylesheet]');
                    if (!EMAPP.User.token) {
                        if (toState.name !== 'login' && toState.name !== 'logout') {
                            event.preventDefault && event.preventDefault();
                            $state.go('login');
                        }
                    } else if (EMAPP.User.token && toState.name === 'login') {
                        event.preventDefault && event.preventDefault();
                        $state.go('dashboard');
                    } else if (EMAPP.User.token && toState.name === 'logout') {
                        event.preventDefault && event.preventDefault();

                        $state.original = $location.url()
                            .replace(/^\//, '')
                            .replace(/\//g, '.');

                        self.logout();
                    }
                });
                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                    stylesheet && stylesheet.remove();
                });
                $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
                    event.preventDefault && event.preventDefault();
                    $state.go('dashboard');
                    console.log('$stateNotFound', unfoundState);
                });

                //记录原地址
                $state.original = $location.url()
                    .replace(/^\//, '')
                    .replace(/\//g, '.');
                // .replace(/dashboard\.login/, '')
                // .replace(/dashboard\.logout/, '');
                //跳转空路径，避免模块加载循序错乱
                $location.url('');

                routerSetup();

            }
        },

        //登录验证
        validate = function(data) {

            uirouterInit();

            //赋值到User对象中
            EMAPP.User = data && data.result || EMAPP.User;
            //写入cookie
            angular.forEach(['token', 'user'], function(key) {
                EMAPP.User[key] && $cookies.put(key, EMAPP.User[key], {
                    path: '/',
                    domain: '.gugecc.com',
                    expires: new Date(new Date().setMonth(new Date().getMonth() + 1))
                })
            });

            if (EMAPP.User.token) {
                $state.go('dashboard');
            } else {
                $state.go('login');
            }

        };

    //获取cookie信息
    angular.forEach($cookies.getAll(), function(value, key) {
        this[key] = value
    }, EMAPP.User = {});

    validate();

    //登录
    self.login = function() {

        var user = this && this.user,
            passwd = this && this.passwd,
            msg = [];

        !user && msg.push('帐号');
        !passwd && msg.push('密码');

        msg = msg.join('与');
        msg && SweetAlert.warning('请输入您的' + msg);

        !msg && $api.auth.login({
            user: user,
            passwd: md5.createHash(passwd).toUpperCase()
        }, validate, function(result) {
            result.data.code === 404 && SweetAlert.error('请输入您的帐号有误');
            result.data.code === 401 && SweetAlert.error('请输入您的密码有误');
        });

    };

    //退出
    self.logout = function() {
        $api.auth.logout({
            redirect: '/'
        }, function() {
            EMAPP.User = {};
            //移除cookie
            angular.forEach(['token', 'user'], function(key) {
                $cookies.remove(key, {
                    path: '/',
                    domain: '.gugecc.com'
                })
            });

            $state.go('login');

        })
    };

    return this;

}]);
