EMAPP.templateCache.put('dist/html/project/main.min.html', '@@include("dist/html/project/main.min.html")');
EMAPP.register.controller('project.main', ['$filter', '$api', 'Pies', 'Lines', function($filter, $api, Pies, Lines) {;

    var self = this,
        nowDate = new Date(),
        datetimepicker,
        load = {
            daily: function(viewDate) {

                //今日费用
                $api.business.dailycost({
                    time: $filter('date')(viewDate, 'yyyyMM'),
                    project: EMAPP.Project.current._id
                }, function(data) {

                    data = data.result[EMAPP.Project.current._id] || {};
                    data.cost = parseInt(data.cost);

                    self.currentDayConsumptionPerArea = data.qoq;
                    self.currentDayElectricConsumptionPerArea = data.yoy;

                    self.chartPies = Pies({
                        chart: {
                            type: 'pie',
                            margin: [0, 0, 0, 0],
                            style: {
                                textAlign: 'center'
                            }
                            //width: 332,//attrs.width || null,
                            //height: 220//attrs.height || null
                        },
                        titleObj: {
                            text: '<div class="pieTitle">今日费用</div><div class="pieNumber">' + data.cost + '</div><div class="pieUnit">元</div>',
                            verticalAlign: 'middle',
                            useHTML: true,
                            y: -28
                        },
                        series: [{
                            type: 'pie',
                            data: [
                                [EMAPP.Project.current.title, data.cost]
                            ]
                        }],
                        tooltip: {
                            pointFormat: '<b>{point.y:.2f}元 {point.percentage:.2f}%</b>'
                        },
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            },
                            innerSize: '90%',
                            showInLegend: false,
                            point: {
                                events: {
                                    click: function(e) {
                                        var index = this.x
                                            //$scope.FirstLevel = _.find($scope.buildings, function (v) {
                                            //    return v.title == buildingPieData[index][0];
                                            //});
                                    }
                                }
                            }
                        }
                    });

                })

            },
            month: function(viewDate) {

                //总能耗
                $api.business.monthlykgce({
                    time: $filter('date')(viewDate, 'yyyyMM'),
                    project: EMAPP.Project.current._id
                }, function(data) {

                    data = data.result[EMAPP.Project.current._id] || {};

                    angular.forEach(data.detail, function(val, key) {
                        this.push([key, val])
                    }, data.detail = []);

                    //统计单位面积能耗 & 单位面积电耗
                    self.currentMonthConsumptionPerAcreage = data.kgceperunitarea;
                    self.currentMonthElectricConsumptionPerAcreage = data.kwhperunitarea;

                    self.monthlyEnergyConsumption = Pies({
                        chart: {
                            //type: 'pie',
                            //margin: [0, 0, 0, 0],
                            style: {
                                textAlign: 'center'
                            }
                        },
                        titleObj: {
                            text: '<div class="pieTitle">当月综合能耗</div><div class="pieNumber">' + data.buildingarea + '</div><div class="pieUnit">千克煤</div>',
                            verticalAlign: 'middle',
                            useHTML: true,
                            y: -28,
                            x: -55
                        },
                        series: [{
                            type: 'pie',
                            data: data.detail
                        }],
                        tooltip: {
                            pointFormat: ' <b>{point.y}</b> 千克煤'
                        },
                        pie: {
                            dataLabels: {
                                enabled: false,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            },
                            showInLegend: true,
                            innerSize: 140,
                            size: 170,
                            center: ["65%", "50%"]
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            itemMarginTop: 2,
                            itemMarginBottom: 2,
                            itemWidth: 140,
                            symbolWidth: 10,
                            symbolPadding: 3,
                            width: 160,
                            borderWidth: 0,
                            maxHeight: 260,
                            useHTML: true,
                            labelFormatter: function() {
                                var percentage = Math.ceil(this.percentage * 10) / 10;
                                //return this.name + ' '+ percentage +"%<br/>" + this.y + "kWh ";
                                return this.name + ' ' + percentage + '%<div style="color: #BBBBBB; ">' + this.y + "KGce</div>";
                            }
                        }
                    });

                });

                //水电气构成
                $api.business.energyconstitute({
                    time: $filter('date')(viewDate, 'yyyyMM'),
                    project: EMAPP.Project.current._id
                }, function(data) {

                    data = data.result[EMAPP.Project.current._id] || {};

                    var pointInterval = 1000 * 60 * 60 * 24,
                        pointStart = Date.UTC(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());

                    angular.forEach(data, function(item, name) {
                        angular.forEach(item, function(val) {
                            this.push(val)
                        }, item = []);
                        this.push({
                            data: item,
                            name: name,
                            pointStart: pointStart,
                            pointInterval: pointInterval
                        });
                    }, data = []);

                    //显示视图
                    self.datapoints = Lines({
                        chart: {
                            //margin: [0, 0, 0, 0],
                            style: {
                                textAlign: 'center'
                            }
                        },
                        title: {
                            text: '本月能耗费用',
                            style: {
                                color: '#FFF',
                                fontSize: '18px'
                            }
                        },
                        legend: true,
                        type: 'line',
                        series: data,
                        tooltip: {
                            xDateFormat: '%Y年%m月%d日',
                            pointFormat: '<b>{series.name}: {point.y}元</b>'
                        },
                        plotOptions: {
                            line: {
                                stacking: 'normal',
                                point: {
                                    events: {
                                        click: function(e) {
                                            var xOffsetStart = Date.UTC(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
                                            var day = (this.x - xOffsetStart) / pointInterval + 1;
                                            //联动能耗类型二级分类图表
                                            //StatisticSecondLevelEnergyConsumption(day);
                                            console.log('events.click')
                                        }
                                    }
                                }
                            }
                        },
                        chartevents: {
                            click: function(e) {
                                // find the clicked values and the series
                                var x = e.xAxis[0].value,
                                    y = e.yAxis[0].value,
                                    series = this.series[0];

                                // Add it
                                //$window.open('/app/project/mainchart', '');
                                console.log('$window.open')
                            }
                        }
                    });

                });

                //能耗细分
                $api.business.dailysensordetail({
                    time: $filter('date')(viewDate, 'yyyyMM'),
                    project: EMAPP.Project.current._id
                }, function(data) {

                    data = data.result[EMAPP.Project.current._id] || {};

                    //显示视图
                    var sumOfSecondLevelEnergyConsumption = 733,
                        viewOfSecondLevelEnergyConsumption = [],
                        customerPieTitle = '<div class="pieTitle">' + $filter('date')(new Date(), 'MM月dd日') + '能耗</div><div>' + sumOfSecondLevelEnergyConsumption + 'KWh</div>';

                    angular.forEach(data, function(val, key) {
                        this.push([key, val])
                    }, viewOfSecondLevelEnergyConsumption);

                    self.customerPies = Pies({
                        enableDataLabels: false,
                        innerSize: '90%',
                        title: customerPieTitle,
                        titleVerticalAlign: 'middle',
                        titleX: -107,
                        titleY: -5,
                        legend: {
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            //itemMarginTop: 10,
                            itemMarginBottom: 10,
                            itemWidth: 100,
                            symbolWidth: 10,
                            symbolPadding: 3,
                            width: 200,
                            labelFormatter: function() {
                                var percentage = Math.ceil(this.percentage * 10) / 10;
                                var kWh = this.y && this.y.toFixed(2) || 0;
                                return this.name + ' ' + percentage + '%<br/>' + kWh + 'kWh ';
                            }
                        },
                        series: [{
                            type: 'pie',
                            data: viewOfSecondLevelEnergyConsumption
                        }],
                        tooltip: {
                            pointFormat: '<b>{point.y:.2f}kWh {point.percentage:.2f}%</b>'
                        }
                    });

                });

            }
        };

    self.todayDate = $filter('date')(nowDate, 'yyyy/MM/dd');

    self.calendar = {
        init: function() {

            datetimepicker = datetimepicker || {
                viewDate: nowDate
            };

            $api.business.calendar({
                time: $filter('date')(datetimepicker.viewDate, 'yyyyMM'),
                project: EMAPP.Project.current._id
            }, function(data) {

                self.calendarData = data.result && data.result[EMAPP.Project.current._id] || {};
                self.calendarData.average = self.calendarData.buildingConsumption / new Date(datetimepicker.viewDate.getFullYear(), datetimepicker.viewDate.getMonth() + 1, 0).getDate();

                angular.forEach(self.calendarData.detail, function(item, index) {
                    this[index + 1] = item.value
                }, self.calendarData.date = {});

                self.calendar.resetTD();

                if (datetimepicker.element) {
                    load.daily(datetimepicker.viewDate);
                    load.month(datetimepicker.viewDate);
                } else {
                    datetimepicker = $('.datetimepicker-panel>div').data('datetimepicker');
                    datetimepicker.element
                        .on('prev:month', function(event) {
                            self.calendar.setDate()
                        })
                        .on('next:month', function(event) {
                            self.calendar.setDate()
                        });
                }

            });

        },
        changeDate: function() {
            nowDate.setDate(datetimepicker.viewDate.getDate());
            if (nowDate.getFullYear() !== datetimepicker.viewDate.getFullYear() || nowDate.getMonth() !== datetimepicker.viewDate.getMonth()) {
                nowDate.setFullYear(datetimepicker.viewDate.getFullYear());
                nowDate.setMonth(datetimepicker.viewDate.getMonth());
                self.calendar.init();
            } else {
                load.daily(datetimepicker.viewDate);
                this.resetTD();
            }
            self.todayDate = $filter('date')(datetimepicker.viewDate, 'yyyy/MM/dd');
        },
        setDate: function() {
            datetimepicker.viewDate.setDate(nowDate.getDate());
            datetimepicker._setDate(datetimepicker.viewDate);
        },
        resetTD: function() {
            if (self.calendarData && self.calendarData.detail && Object.keys(self.calendarData.detail).length) {
                $('.datetimepicker-days table tbody td').each(function(num) {
                    if (!/old|new/i.test(this.className)) {
                        num = parseInt($(this).html());
                        if (/active/i.test(this.className)) this.className = 'day current';
                        self.calendarData.date[num] && $(this).html('<i class="' + (self.calendarData.date[num] > self.calendarData.average ? 'em-up' : (self.calendarData.date[num] < self.calendarData.average ? 'em-down' : 'em-keep')) + '">' + num + '</i>');
                    }
                })
            } else {
                $('.datetimepicker-days table tbody td.active').html('<i class="em-down">' + $('.datetimepicker-days table tbody td.active').html() + '</i>').removeClass('active').addClass('current');
            }
        }
    };

    load.daily(nowDate);
    load.month(nowDate);

    return self;

}]);
