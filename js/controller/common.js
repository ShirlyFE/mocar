/*
 * 通用的controller基类
 */

define(function(require, exports) {
    var util = require('../component/util');
    var Transitions = require('../component/transitions');

    var Common = Spine.Controller.sub({
        // 该controller要渲染&控制的区域
        el: $(),

        // 页面title
        title: '',

        // 内容模板
        template: 'template-...',

        // 只执行一次，初始化时执行
        init: function() {},

        // 获取需要的数据
        getData: function(params, callback) {
            callback(null, {});
        },

        // 渲染内容
        render: function(params) {

            var html = template(this.template, params);

            this.el.html(html);
        },

        // 清空内容
        clean: function() {
            this.el.html('<div id="loading"><img src="../css/icons/loading.gif"></div>');
        },

        // 跳转到其对应的url时执行
        activate: function(params) {

            var me = this;

            params = params || {};

            this.getData(params, function(err, data) {

                me.enter();

                me.render($.extend(params, data));

            });

        },

        // 视图正式进入当前controller
        enter: function(){
            var prev = this.page.curr,
                prevId = prev  ? prev.squenceId : -1,
                currId = this.squenceId,
                direction = currId >= prevId ? 'right' : 'left';

            if(prev){
                prev.leave();
            }

            this.movein(direction);
            util.title(this.title);

            this.page.curr = this;
        },

        // 离开到其对应的url时执行
        deactivate: function() {
        },

        // 清理当前controller的内容并移出视图
        leave: function(){
            this.moveout();
            this.clean();
        },

        movein: Transitions.movein,
        moveout: Transitions.moveout
    });

    return Common;
});