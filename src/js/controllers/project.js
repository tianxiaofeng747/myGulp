/*载入模板*/
EMAPP.templateCache.put('dist/html/project.min.html', '@@include("dist/html/project.min.html")');

/*登录控制*/
EMAPP.register.controller('EMAPP.project', ['$rootScope', '$state', '$location', '$timeout', '$api', function($rootScope, $state, $location, $timeout, $api) {

    var self = this;

    self.userName = EMAPP.User.user;

    $timeout(function nowtime() {
        var now = new Date(),
            year = now.getYear(),
            month = now.getMonth() + 1,
            date = now.getDate(),
            hours = now.getHours(),
            minutes = now.getMinutes(),
            seconds = now.getSeconds();
        if (minutes <= 9) minutes = '0' + minutes;
        if (seconds <= 9) seconds = '0' + seconds;
        self.timeStr = hours + ':' + minutes + ':' + seconds;
        $timeout(nowtime, 1000);
    });

    $api.project.info(function(data) {
        if (data && data.result && data.result.length) {

            angular.forEach(data.result, function(item) {
                this.push(item)
            }, EMAPP.Project = []);

            document.title = EMAPP.Project.name = self.projectName = '集团平台';

            EMAPP.Project.current = EMAPP.Project[0] || {};
            if (data.result.length === 1) {
                document.title = EMAPP.Project.name = self.projectName = EMAPP.Project.current.title || self.projectName;
            }

            self.menuData = EMAPP.Menu;

            //State Change Events
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                angular.forEach(self.menuData, function(item, index) {
                    delete item.active;
                    if (item.state === toState.name) {
                        item.active = true;
                        document.title = self.projectName + ' - ' + item.name;
                    }
                })
            });

            //跳转回原路径
            if ($state.original === 'dashboard') $state.original = '';
            $state.go($state.original || 'dashboard.main');

        }
    });

    return self;

}]);
