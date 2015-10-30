EMAPP.templateCache.put('dist/html/project/statistic.min.html', '@@include("dist/html/project/statistic.min.html")');
EMAPP.register.controller('project.statistic', ['$api', '$filter', 'uiGridConstants', function($api, $filter, uiGridConstants) {

    ~ function resize() {
        $('.app-view-project-statistic').height($(window).height() - 50);
        !arguments.length && $(window).resize(resize);
    }();

    var self = this,
        nowDate = new Date();

    self.startDate = $filter('date')(nowDate, 'yyyy-MM-') + '01';
    self.endDate = $filter('date')(nowDate, 'yyyy-MM-') + new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0).getDate();

    $api.energy.info({
        project: EMAPP.Project.current._id
    }, function(data) {
        angular.forEach(data.result.energy || {}, function(item) {
            this.push(item)
        }, self.energyData = [])
    });

    self.gridOptions = {
        onRegisterApi: function(gridApi) {
            self.gridApi = gridApi;
        },
        exporterOlderExcelCompatibility: true,
        columnDefs: [{
            displayName: '传感器名称',
            name: 'name'
        }, {
            displayName: '能耗分类',
            name: 'energy'
        }, {
            displayName: '最小能耗刻度',
            name: 'min.toFixed(2)'
        }, {
            displayName: '最大能耗刻度',
            name: 'max.toFixed(2)'
        }, {
            displayName: '能耗总值',
            name: 'sum.toFixed(2)'
        }, {
            displayName: '单价',
            name: 'price'
        }, {
            displayName: '费用',
            name: 'cost.toFixed(2)'
        }]
    };

    self.toggleFiltering = function() {
        self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    self.export = function() {
        self.gridOptions.exporterCsvFilename = 'settlereport_' + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '') + '.csv';
        self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
    };

    (self.report = function() {

        $api.business.settlereport({
            from: self.startDate.replace(/\-/g, ''),
            to: self.endDate.replace(/\-/g, ''),
            project: [{
                id: EMAPP.Project.current._id,
                energy: self.energyData && self.energyData.selected && self.energyData.selected.id || ''
            }]
        }, function(data) {
            self.gridOptions.data = data.result[EMAPP.Project.current._id];
        });

    })();

    return self;

}]);
