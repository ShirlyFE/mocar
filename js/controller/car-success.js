/*
 * 预约成功 页面的controller
 */
define(function(require, exports) {
    var util = require('../component/util');
    var Service = require('../model/service');
    var Order = require('../model/order');

    var Brand = require('../model/brand');
    var Model = require('../model/model');

    var CarSuccess = require('./common').sub({

        el: $('#car-success'),

        title: '预约提交成功',

        template: 'template-success',

        doGetData: function(params, callback) {
            var self = this;
            var currentService, currentVehicle;
            //currentService = Service.find(params.service_id);
            var currentOrder = Order.find('-1');
            currentService = currentOrder.__currentService;
            currentVehicle = currentOrder.__currentVehicle;
            var data = $.extend(params, {
                currentOrder: currentOrder,
                currentService: currentService,
                currentVehicle: currentVehicle
            });
            // debugger;
            currentOrder.destroy(); //订单提交成功，删除浏览器端未保存的记录

            callback(null, data);

        },
        // 渲染内容
        render: function(data) {
            var self = this;
            var html = template(this.template, data);

            this.el.html(html);
            var s = new iScroll('j-success-container');
        },
        getData: function(params, callback) {
            var self = this;
            if (!params.service_id) {
                this.page.navigate('/home');
                return;
            }
            if (!params.model_id) {
                this.page.navigate('/service/' + params.service_id + '/brand');
                return;
            }
            //TODO Order.find("-1") first
            delete this.currentOrder;
            try {
                this.currentOrder = Order.find("-1");
            } catch (e) {}
            if (!this.currentOrder || this.currentOrder.destroyed) {
                this.page.navigate('/service/' + params.service_id + '/model/' + params.model_id + '/cart');
                return;
            }
            // window.history.pushState({from:'success'},"", '#/home');
            self.doGetData(params, function(err, data) {
                $.extend(params, data);
                callback(err, data);
                //标识已经访问过成功页面
                sessionStorage['success'] = 1;
                // window.history.pushState({}, '');
                // window.onpopstate = function(event){
                //     //下单成功之后，从success页面后退时，直接退到服务首页
                //     if(event.state && event.state.from == 'success' && location.hash == '#/home'){
                //         self.page.navigate(location.hash);
                //     }
                // }
                setTimeout(function() {
                    window.history.replaceState({
                        page: 'success',
                        curr: 1
                    }, '', location.hash);
                    window.history.pushState({
                        page: 'success',
                        curr: 2
                    }, '', location.hash);
                    window.onpopstate = function(event) {
                        //下单成功之后，设置为不允许后退
                        if (event.state && event.state.page == 'success') {
                            if (window.WeixinJSBridge) {
                                window.WeixinJSBridge.invoke('closeWindow', {}, function(res) {
                                    if (res.err_msg != 'close_window:ok') {
                                        alert("关闭窗口失败，请点击左上方的关闭按钮关闭窗口");
                                    }
                                });
                            }
                            self.page.navigate(location.hash);
                            setTimeout(function() {
                                window.history.pushState({
                                    page: 'success',
                                    curr: 3
                                }, '', location.hash);
                            });
                        }
                    };
                });
            });
        }
    });

    return CarSuccess;
});