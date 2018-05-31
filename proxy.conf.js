var target = "https://admin.zdx.ab";

const CONF = {
    "/app_theme/*": {
        "target": "https://admin.yxz.ab",
        "secure": false,
        "changeOrigin": true
    },
    "/cruise/*": {
        "target": "https://admin.yxz.ab",
        "secure": false,
        "changeOrigin": true
    },
    "/mobile/mdd/*": {
        "target": "https://admin.huzhenlong.ab",
        "secure": false,
        "changeOrigin": true
    },
    "mobile/tg/search/keyword/*": {
        "target": "https://admin.gaixianggeng.ab",
        "secure": false,
        "changeOrigin": true
    },
    "/mobile/tg/search/operateSearchResult/*": {
        "target": "https://admin.searchcooperation.ab",
        "secure": false,
        "changeOrigin": true
    },
    "/mobile/tg/search/*": {
        "target": "https://admin.gaixianggeng.ab",
        "secure": false,
        "changeOrigin": true
    },
    "/mobile/*": {
        "target": target,
        "secure": false,
        "changeOrigin": true
    },
    "/mdd-api/*": {
        "target": target,
        "secure": false,
        "changeOrigin": true
    },
    "/push-api/rule/*": {
        "target": 'https://admin.pushlog.ab',
        "secure": false,
        "changeOrigin": true
    },
    "/interface/*": {
        "target": target,
        "secure": false,
        "changeOrigin": true
    },
    "/localApi/*": {
        "target": "http://localhost:8081",
        "secure": false,
        "changeOrigin": true
    },
    "/user-api/*": {
        "target": target,
        "secure": false,
        "changeOrigin": true
    },
    "/admin/appbigsearch/*": {
        "target": 'http://esadmin.mafengwo.io',
        "secure": false,
        "changeOrigin": true
    },
    "/push-api/stat/*": {
        "target": 'https://admin.zhoucc.ab',
        "secure": false,
        "changeOrigin": true
    },
    "/push-api/material/*": {
        "target": 'https://admin.pushlog.ab',
        "secure": false,
        "changeOrigin": true
    },
    "/push-api/order/*": {
        "target": 'https://admin.zdx.ab',
        "secure": false,
        "changeOrigin": true
    },
    "/push-api/task/*": {
        "target": 'https://admin.zdx.ab',
        "secure": false,
        "changeOrigin": true
    },
    "/push-api/auth/*": {
        "target": 'https://admin.zdx.ab',
        "secure": false,
        "changeOrigin": true
    },
    "logLevel": "debug"
};

module.exports = CONF;
