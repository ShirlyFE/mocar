/*
 * 服务列表 页面的controller
 */
define(function(require, exports) {
    var config = require('../component/config');
    var util = require('../component/util');

    var Service = require('../model/service');
    var Vehicle = require('../model/vehicle');
    var Banner = require('../model/banner');
    var Popup = require('../widgets/Popup');

    var CarHome = require('./common').sub({
        // 该controller要渲染&控制的区域
        el: $('#car-home'),

        title: '摩卡汽车服务',

        template: 'template-home',

        getData: function(params, callback) {
            this.params = params;

            callback(null, {});
        },

        render: function(){
            this.constructor.__super__.render.apply(this, arguments);

            var self = this,
                listWrapper = this.el.find('[data-role="service-list"]'),
                params = this.params;

            Popup.openLoading();
            util.finish([
                Service.fetch(params),
                Vehicle.fetch({uid:'me'})
            ], function(services, vehicles) {
                Popup.close();
                services.forEach(function(service) {
                    service.icon = config.STATIC_HOST + '/images/services/' + util.formatNum(service.id, 3) + '.png';

                    if(service.id == 2){
                        service.present = true;
                    }

                    /*if(service.id == 3){
                        service.discount = true;
                        service.originPrice = Math.floor(service.price / 0.88);
                    }*/

					if (service.id == 8 || service.id == 9) {
						service.prefer = true;
					}
                    
                    service.isStandardService = service.id != 1;

                    service.priceNotCertain = !(service.id == 3 || service.id == 8 || service.id == 9);
                });
                var next, lastModelId;
                try{
                    //用户最近选的车
                    lastModelId = localStorage['modelId'];
                }catch(e){

                }
                if(vehicles && vehicles.length){
                    //如果用户提交过订单，用最新下单的车辆
                    next = 'cart';
                }else if(lastModelId){
                    //如果用户之前没提交过订单，但经过了完整的选车流程，使用之前选的车
                    next = 'model/' + lastModelId + '/cart'
                }else{
                    //选车去吧
                    next = 'brand';
                }

                listWrapper.html(template('template-home-list', {
                    services: services,
                    next: next
                }));

                //当前页面是从下单成功页面过来的
                if(sessionStorage && sessionStorage['success']){
                    delete sessionStorage['success'];
                    setTimeout(function(){
                        window.history.replaceState({referrer:'success',curr:1},'', location.hash);
                        window.history.pushState({referrer:'success', curr: 2}, '', location.hash);
                        window.onpopstate = function(event){
                            //下单成功之后，从success页面转到服务首页后，设置为不允许后退
                            if(event.state && event.state.referrer == 'success'){
                                self.page.navigate(location.hash);
                                setTimeout(function(){
                                    window.history.pushState({referrer:'success', curr:3}, '', location.hash);
                                });
                            }
                        }                        
                    });
                }
            });

            Banner.fetch(params, function(err, banners){
                if(err){
                    return;
                }

				if (banners.length > 0){
					$('#logo-area').hide();
					$('#slide-area').html(
						'<img src="../css/icons/mocar.png" width="100%"><ul>' +
						banners.map(function(banner){
							banner.color = util.formatNum(parseInt(banner.color, 10).toString(16), 6);
							return util.format(
								'<li>' +
									'<a href="${uri}">' +
										'<img src="' + config.STATIC_HOST + '/images/ads/banners/medium/${id}.jpg" width="100%">' +
										'<div class="slide-title-bg"></div>' +
										'<h5 class="slide-title">' +
											'<span class="slide-tag" style="background-color:#${color}">${tag}</span>' +
											'${title}' +
										'</h5>' +
									'</a>' +
								'</li>',
								banner
							);
						}).join('') +
						'</ul>' +
						'<div id="dots" class="dots">' +
						banners.map(function(banner){
							return '<span></span>'
						}).join('') +
						'</div>'
					).show().swipeSlide({
						continuousScroll:true,
						speed : 5000,
						transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)'
					},function(i){
						$('#dots').children().eq(i).addClass('active').siblings().removeClass('active');
					});
				}

            });
        }
    });

    return CarHome;
});
