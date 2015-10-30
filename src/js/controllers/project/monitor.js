EMAPP.templateCache.put('dist/html/project/monitor.min.html', '@@include("dist/html/project/monitor.min.html")');
EMAPP.register.controller('project.monitor', ['$api', function($api) {

    var self = this;

    $api.energy.info({
        project: EMAPP.Project.current._id
    }, function(data) {
        angular.forEach(data.result.energy || {}, function(item) {
            this.push(item)
        }, self.energyData = []);
        self.energyData.select = function(item) {
            self.energyData.selected = item;
            self.list();
        };
    });

    (self.list = function(page) {
        var energytype = '';
        if (self.energyData && self.energyData.selected) {
            energytype = self.energyData.selected.id
        }
        $api.business.monitor(angular.extend({
            energytype: energytype,
            project: EMAPP.Project.current._id,
            pageindex: 1,
            pagesize: 30
        }, angular.isObject(page) ? page : angular.isNumber(page) ? {
            pageindex: page
        } : {}), function(data) {
            data = data.result[EMAPP.Project.current._id] || {};
            self.monitorData = data.sensor || [];
            self.monitorData.paging = data.paging || {
                pageindex: 1,
                pagesize: 30,
                count: 0
            };
        })
    })();

    return self;

}]);
