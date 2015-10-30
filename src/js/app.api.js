/*
 * default actions:
 * [
 *      get: { method: 'GET' },
 *      list: { method: 'GET' },
 *      search: { method: 'GET' },
 *      set: { method: 'POST' },
 *      create: { method: 'POST' },
 *      update: { method: 'POST' },
 *      remove: { method: 'POST' } // remove will be convert -> delete,
 *      'delete': { method: 'POST' }
 * ]
 * api:
 * name : [url{String}, paramDefaults{Object}|null, actions{Object}|null, options{Object}|null]
 */

EMAPP.api = {

    auth: ['auth', , {
        login: {
            method: 'POST'
        },
        logout: {
            method: 'POST'
        }
    }],
    project: ['project', , {
        info: {
            method: 'POST'
        }
    }],
    business: ['business', , {

        //////首页//////
        //日历
        calendar: {
            method: 'POST',
            cache: true
        },
        //今日费用
        dailycost: {
            method: 'POST'
        },
        //总能耗
        monthlykgce: {
            method: 'POST'
        },
        //水电气构成
        energyconstitute: {
            method: 'POST'
        },
        //能耗细分
        dailysensordetail: {
            method: 'POST'
        },

        //////监控//////
        //监控数据
        monitor: {
            method: 'POST'
        },

        //////分析//////
        //建筑=>建筑能耗收入
        buildingstatistic: {
            method: 'POST'
        },
        //建筑=>能耗收入比
        energyincomerate: {
            method: 'POST'
        },
        //建筑=>能耗实时曲线图
        energytimeline: {
            method: 'POST'
        },

        //////统计//////
        //月能耗报表
        monthlyreport: {
            method: 'POST'
        },
        //结算报表
        settlereport: {
            method: 'POST'
        }

    }],
    energy: ['energy', , {
        info: {
            method: 'POST',
            cache: true
        }
    }],
    export: ['export', , {
        //结算报表
        settlereport: {
            method: 'POST'
        }
    }]
};
