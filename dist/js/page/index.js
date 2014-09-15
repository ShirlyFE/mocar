define("page/index",["controller/car-home","component/config","component/util","model/service","model/common","model/vehicle","controller/common","component/transitions","widgets/Popup","widgets/Overlay","component/token","controller/car-brand","model/brand","controller/car-series","model/series","controller/car-model","model/model","controller/car-cart","model/order","widgets/FastButton","widgets/CustomSelect","lib/template","controller/car-schedule","model/city","model/contact","controller/car-success"],function(e){var t=Spine.Stack.sub({controllers:{home:e("../controller/car-home"),brand:e("../controller/car-brand"),series:e("../controller/car-series"),model:e("../controller/car-model"),cart:e("../controller/car-cart"),schedule:e("../controller/car-schedule"),success:e("../controller/car-success")},routes:{"/":function(){this.navigate("/home")},"/home":"home","/service/:service_id/brand":"brand","/service/:service_id/brand/:brand_id/series":"series","/service/:service_id/brand/:brand_id/series/:series_id/model":"model","/service/:service_id/model/:model_id/cart":"cart","/service/:service_id/cart":"cart","/service/:service_id/model/:model_id/schedule":"schedule","/service/:service_id/model/:model_id/success":"success"},squenceNum:0,add:function(e){var r=this;return e.page=r,e.squenceId=r.squenceNum=r.squenceNum+1,t.__super__.add.apply(r,arguments)},init:function(){var e=this;this.el.delegate(".j-nav","click",function(t){e.navigate($(t.currentTarget).attr("data-nav"))})}});new t({el:$("#main-container")}),Spine.Route.setup()}),define("controller/car-home",["component/config","component/util","model/service","model/common","model/vehicle","controller/common","component/transitions","widgets/Popup","widgets/Overlay","component/token"],function(e){var t=e("../component/config"),r=e("../component/util"),n=e("../model/service"),i=e("../model/vehicle"),o=e("./common").sub({el:$("#car-home"),title:"摩卡汽车服务",template:"template-home",getData:function(e,o){var c=this;r.finish([n.fetch(e),i.fetch({uid:"me"})],function(e,n){e.forEach(function(e){e.icon=t.STATIC_HOST+"/images/services/"+r.formatNum(e.id,3)+".png"});var i,a;try{a=localStorage.modelId}catch(s){}i=n&&n.length?"cart":a?"model/"+a+"/cart":"brand",o(null,{services:e,next:i}),sessionStorage&&sessionStorage.success&&(delete sessionStorage.success,setTimeout(function(){window.history.replaceState({referrer:"success",curr:1},"",location.hash),window.history.pushState({referrer:"success",curr:2},"",location.hash),window.onpopstate=function(e){e.state&&"success"==e.state.referrer&&(c.page.navigate(location.hash),setTimeout(function(){window.history.pushState({referrer:"success",curr:3},"",location.hash)}))}}))})}});return o}),define("component/config",["component/util"],function(e,t,r){var n=e("./util"),i="http://api.mocar.cn",o="http://static.mocar.cn",c=n.parseURL();c&&c.params&&c.params.api_hostname&&(i="http://"+c.params.api_hostname,c.params.api_port&&(i+=":"+c.params.api_port)),r.exports={API_HOST:i,STATIC_HOST:o}}),define("component/util",[],function(){var e=function(e,t){return e.replace(/\$\{([^\{\}]*)\}/g,function(e,r){return t[r.trim()]||""})},t=function(e,t){var r=e.length,n=[],i=!1;e.forEach(function(e,o){e(function(e,c){if(!i){if(e)throw i=!0,e;n[o]=c,r--,r||t.apply(null,n)}})})},r=function(e){return e?$("title").text(e).text():$("title").text()},n=function(e,t){function r(e){return e+="",1==e.length&&(e="0"+e),e}function n(e){e=new Date(e);var t=e.getFullYear(),n=r(e.getMonth()+1),i=r(e.getDate());return[t,n,i].join("-")}t=t||0;var i=[];for(d=new Date,t&&d.setDate(d.getDate()+t),i.push(n(d.valueOf()));--e;)d.setDate(d.getDate()+1),i.push(n(d.valueOf()));return i},i=function(e){e=e||location.href;var t=document.createElement("a");return t.href=e,{source:e,protocol:t.protocol.replace(":",""),host:t.hostname,port:t.port,query:t.search,params:function(){for(var e,r={},n=t.search.replace(/^\?/,"").split("&"),i=n.length,o=0;i>o;o++)n[o]&&(e=n[o].split("="),r[e[0]]=e[1]);return r}(),file:(t.pathname.match(/\/([^\/?#]+)$/i)||[,""])[1],hash:t.hash.replace("#",""),path:t.pathname.replace(/^([^\/])/,"/$1"),relative:(t.href.match(/tps?:\/\/[^\/]+(.+)/)||[,""])[1],segments:t.pathname.replace(/^\//,"").split("/")}},o=function(e){var t=(e||"").match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);if(t&&6==t.length){var r=parseInt(t[1],10),n=parseInt(t[2],10),i=parseInt(t[3],10),o=parseInt(t[4],10),c=parseInt(t[5],10);return new Date(r,n-1,i,o,c)}},c=function(e,t){for(var r="",n=1;n<=t-(e+"").length;n++)r+="0";return r+e};return{format:e,finish:t,title:r,getDayArr:n,parseURL:i,makeDateFromStr:o,formatNum:c}}),define("model/service",["model/common"],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Service","id","description","name","price","slogan","parts"),r.extend({url:t.API_HOST+"/models/generic/services"}),r}),define("model/common",[],function(e){var t=e("../component/util"),r=Spine.Model.sub();return r.extend({url:"",fetch:function(e,r){var n=this,i=function(r){var i=n.fetched=n.fetched||{},o=t.format(n.url,e);i[o]?r(null,i[o]):$.getJSON(o,function(e){e.forEach(function(e){n.create(e)}),i[o]=e,r(null,e)})};return r?i(r):i}}),r}),define("model/vehicle",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Vehicle","id","modelId","model","plate","vid"),r.extend({url:t.API_HOST+"/users/${uid}/vehicles"}),r}),define("controller/common",["component/transitions","widgets/Popup","widgets/Overlay","component/token"],function(e){var t=e("../component/util"),r=e("../component/transitions"),n=e("../widgets/Popup"),i=Spine.Controller.sub({el:$(),title:"",template:"template-...",init:function(){},getData:function(e,t){t(null,{})},render:function(e){var t=template(this.template,e);this.el.html(t)},clean:function(){this.el.html("")},activate:function(r){var n=this;r=r||{},t.finish([e("../component/token").ready],function(){n.getData(r,function(e,t){n.enter(),n.render($.extend(r,t))})})},enter:function(){var e=this.page.curr,r=e?e.squenceId:-1,n=this.squenceId,i=n>=r?"right":"left";e&&e.leave(),this.movein(i),t.title(this.title),this.page.curr=this},deactivate:function(){this===this.page.curr&&n.openLoading()},leave:function(){n.close(),this.moveout(),this.clean()},movein:r.movein,moveout:r.moveout});return i}),define("component/transitions",[],function(){var e=function(){};return e.fn=e.prototype,e.fn.movein=function(e){e=e||"right",this.el.removeClass("moveout"),this.el.addClass("movein"),this.el.addClass(e+"in")},e.fn.moveout=function(){this.el.removeClass("movein leftin rightin"),this.el.addClass("moveout")},new e}),define("widgets/Popup",["widgets/Overlay"],function(e,t,r){var n,i,o=e("./Overlay"),c='<div class="popup-wrapper" style="display:none;"></div>',a='<div class="popup"></div>',s={};s._getWrapperEl=function(){if(n=document.querySelector("body>.popup-wrapper"),!n){var e=document.createElement("div");e.innerHTML=c,n=e.firstChild,document.body.appendChild(n)}return n},s._getPopupContentEl=function(){return n||this._getWrapperEl(),n.innerHTML=a,i=n.querySelector(".popup")},s.open=function(e,t){o.show(),i||this._getPopupContentEl(),"string"==typeof e?i.innerHTML=e:(i.innerHTML="",i.appendChild(e)),n.style.display="block",t&&t(i)},s.close=function(){o.hide(),n&&i&&(n.innerHTML="",i.style.cssText="",i=null,n.style.display="none")},s.openLoading=function(){s.open(template("template-loading",{})),i.style.cssText="width:auto"},r.exports=s}),define("widgets/Overlay",[],function(e,t,r){var n,i='<div class="overlayer"></div>',o={};o._getEl=function(){if(n=document.querySelector("body>.overlayer"),!n){var e=document.createElement("div");e.innerHTML=i,n=e.firstChild,document.body.appendChild(n)}return n},o.show=function(){n||this._getEl(),n.style.display="block"},o.hide=function(){n||this._getEl(),n.style.display="none"},r.exports=o}),define("component/token",[],function(e){var t=e("./config"),r=e("./util"),n="accessToken",i=!1,o=function(e,r){$.ajax({url:t.API_HOST+"/authority/token?credential=WX"+e,success:function(t){var i=t.accessToken;try{t.code=e,localStorage[n]=JSON.stringify(t)}catch(o){console.log(o)}r(i)}})},c=function(e){var t=r.parseURL(location.href),i=t.params.code;if(i){var c,a=function(t){$(document).on("ajaxBeforeSend",function(e,r){r.setRequestHeader("Access-Token",t)}),e()};try{if(c=JSON.parse(localStorage[n]||""),c&&c.code==i&&c.expiresAt>Date.now()&&c.accessToken)return void a(c.accessToken)}catch(s){}delete localStorage[n],o(i,a)}else alert("no param code")},a=function(e){i?e():c(function(t){t||(i=!0),e(t)})};return{updateToken:o,init:c,ready:a}}),define("controller/car-brand",["model/brand"],function(e){var t=e("../component/util"),r=e("../component/config"),n=e("../widgets/Popup"),i=e("../model/brand"),o=e("./common").sub({el:$("#car-brand"),title:"选择品牌",template:"template-brand",getData:function(e,o){t.finish([i.fetch(e)],function(e){e.forEach(function(e){e.icon=r.STATIC_HOST+"/images/automobile-signs/"+t.formatNum(e.id,3)+".png"}),o(null,{list:e}),new iScroll("j-brand-container"),setTimeout(function(){n.open(""),setTimeout(function(){n.close()},0)},600)})}});return o}),define("model/brand",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Brand","id","brand","latter"),r.extend({url:t.API_HOST+"/automobile/brands"}),r}),define("controller/car-series",["model/series"],function(e){var t=e("../component/util"),r=e("../model/brand"),n=e("../model/series"),i=e("./common").sub({el:$("#car-series"),title:"选择车系",template:"template-series",getData:function(e,i){t.finish([n.fetch(e),r.fetch(e)],function(t){t.forEach(function(t){try{t=n.find(t.id),t.brandId=e.brand_id,t.save()}catch(r){}}),data=$.extend({list:t},r.find(e.brand_id));try{localStorage.brand=data.brand,localStorage.brandId=e.brand_id}catch(o){}i(null,data),new iScroll("j-series-container")})}});return i}),define("model/series",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Series","id","prefix","family","brandId"),r.extend({url:t.API_HOST+"/automobile/brands/${brand_id}/families"}),r}),define("controller/car-model",["model/model"],function(e){var t=e("../component/util"),r=e("../model/brand"),n=e("../model/series"),i=e("../model/model"),o=e("./common").sub({el:$("#car-model"),title:"选择车型",template:"template-model",getData:function(e,o){t.finish([i.fetch(e),n.fetch(e),r.fetch(e)],function(t,c){c.forEach(function(t){try{t=n.find(t.id),t.brandId=e.brand_id,t.save()}catch(r){}}),t.forEach(function(t){t=i.find(t.id),t.brandId=e.brand_id,t.familyId=e.series_id;try{t.save()}catch(r){}}),data=$.extend({list:t},r.find(e.brand_id),n.find(e.series_id));try{localStorage.brand=data.brand,localStorage.brandId=e.brand_id,localStorage.family=data.family,localStorage.familyId=e.series_id,localStorage.prefix=data.prefix}catch(a){}o(null,data),new iScroll("j-model-container")})}});return o}),define("model/model",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Model","id","model","suffix","brandId","familyId"),r.extend({url:t.API_HOST+"/automobile/brands/${brand_id}/families/${series_id}/models"}),r}),define("controller/car-cart",["model/order","widgets/FastButton","widgets/CustomSelect","lib/template"],function(e){function t(e,t){function r(){try{var e,t=0,r=$("[data-price]"),n=$("[data-totalprice]");r.each(function(r,n){e=n.getAttribute("data-price"),e&&(e=parseFloat(e),e&&(t+=e))}),i.currentOrder.sum=t,n[0].innerHTML=t+"",n[0].setAttribute("data-totalprice",t),setTimeout(function(){l.open(""),setTimeout(function(){l.close()},0)},0)}catch(o){alert("计算总价出错啦")}}function n(t){for(var n,o=[e.allVehicles.map(function(e){return[e.prefix+e.brand+" "+e.family+" "+e.model]}).concat([["重新选车"]]),[[e.currentService.name,e.currentService.price]]],c=0,a=e.currentService.parts.length;a>c;c++)n=e.currentService.parts[c],o.push([].concat(n.options.map(function(e){return[e.brand+e.name+" "+e.extra,e.price+""]})));for(var s,l,d,f=document.querySelectorAll(".select-wrapper"),c=0,a=f.length;a>c;c++){if(s=f[c],l=s.querySelector(".custom-select-trigger"),d=s.querySelector("input"),c>=2&&t){var m;o[c].filter(function(e,t){return-1!==e[0].indexOf(p)?(m=t,!0):void 0}),m||(m=0),d.value=m;var h=l.querySelector(".product-name"),v=l.querySelector(".price");h.innerHTML=o[c][m][0],v.innerHTML=o[c][m][1],v.setAttribute("data-price",o[c][m][1])}else d.value||(d.value=0);l&&d&&!function(t,n,o,c){new u({triggerEl:t,inputEl:n,optArr:o,onchange:function(n){if(-1!==n){var a=t.querySelector(".product-name"),s=t.querySelector(".price");a.innerHTML=o[n][0],s&&(s.innerHTML=o[n][1],s.setAttribute("data-price",o[n][1]))}c>=2&&r(),0==c&&(n==o.length-1?i.page.navigate("/service/"+e.service_id+"/brand"):n>=0&&(e.currentVehicle=e.allVehicles[n],i.currentOrder.__currentVehicle=e.currentVehicle,e.model_id=e.currentVehicle.modelId))}})}(l,d,o[c],c)}}var i=this,o=document.querySelector("#template-buyelsetip").innerHTML;t?l.open(o,function(e){var t=e.querySelector(".mocarbtn"),i=e.querySelector(".buyelsebtn");new d(t,function(){l.close(),n(),r()}),new d(i,function(){l.close(),n(!0),r()})}):(n(),r())}var r=e("../component/config"),n=e("../component/util"),i=e("../model/vehicle"),o=(e("../model/service"),e("../model/order")),c=e("../model/brand"),a=e("../model/series"),s=e("../model/model"),l=e("../widgets/Popup"),d=e("../widgets/FastButton"),u=e("../widgets/CustomSelect"),p="自行购买",f=e("./common").sub({el:$("#car-cart"),title:"预约服务",template:"template-cart",doGetData:function(e,t){var n=[r.API_HOST+"/models/",e.model_id,"/services/",e.service_id].join("");$.ajax({url:n,success:function(e){function r(){for(var t,r,n=e.parts,i=0,o=n.length;o>i;i++)if(t=n[i].options)for(var c=0,a=t.length;a>c;c++)r=t[c],0==r.price&&r.hint&&(r.price=r.hint),"number"==typeof r.price&&(r.price*=r.count)}r(e),t(null,e)},error:function(e,t,r){l.open("Error: "+t+r)}})},render:function(e){var r=this,n=template(this.template,e);this.el.html(n);var i=(new iScroll("j-cart-container",{hScrollbar:!1,vScrollbar:!1}),!0);if(sessionStorage&&sessionStorage.stepSchedule&&(i=!1,delete sessionStorage.stepSchedule),i){i=!1;var c,a,s,l=e.currentService.parts;if(l&&l.length>0)e:for(var d=0,u=l.length;u>d;d++)if(c=l[d],a=c.options,a&&a.length>0)for(var f=0,m=a.length;m>f;f++)if(s=a[f],s.name==p){i=!0;break e}}setTimeout(function(){t.call(r,e,i)},500);try{this.currentOrder=o.find("-1"),this.currentOrder&&this.currentOrder.destroy()}catch(h){}delete this.currentOrder,this.currentOrder=o.create({id:"-1",sum:0,modelId:e.currentVehicle.modelId,model:e.currentVehicle.model,vid:e.currentVehicle.vid,plate:e.currentVehicle.plate,cityCode:"",province:"",city:"",address:"",name:"",phone:"",date:0,__currentService:e.currentService,__currentVehicle:e.currentVehicle,services:[{id:e.service_id,parts:e.currentService.parts.map(function(e){return{typeId:e.id}})}]});var v=this.el.find(".j-nextstep");v.bind("click",function(){var t=r.el.find("input[name=accessoryInput]");t.forEach(function(t,n){r.currentOrder.services[0].parts[n].id=e.currentService.parts[n].options[t.value].id}),r.currentOrder.save()})},clean:function(){l.close(),this.constructor.__super__.clean.apply(this,arguments)},saveUserInput:function(){var e=this,t=e.currentOrder;if(t){var r,n=t.__currentService.id,i=t.__currentVehicle.modelId,o={accessoryInputs:[]},c=e.el.find("input");c.forEach(function(e){r=e.name,"accessoryInput"==r?o.accessoryInputs.push(e.value||""):o[r]=e.value||""});var a={};a[i]={},a[i][n]=o,sessionStorage.cartUserInput=JSON.stringify(a),sessionStorage.lastServiceId=n,sessionStorage.lastModelId=i}},deactivate:function(){this.saveUserInput(),this.constructor.__super__.deactivate.apply(this,arguments)},restoreUserInput:function(e){var t,r;if(r=sessionStorage.cartUserInput)try{r=JSON.parse(r),r=r&&r[e.model_id]||{},t=r&&r[e.service_id]||{}}catch(n){t={accessoryInputs:[]}}return delete sessionStorage.cartUserInput,t},getData:function(e,t){var r,o=this,l=sessionStorage.lastModelId,d=sessionStorage.lastServiceId;l&&!e.model_id&&(e.model_id=l),d&&!e.service_id&&(e.service_id=d);var u={brand:localStorage.brand||"",family:localStorage.family||"",prefix:localStorage.prefix||"",model:localStorage.model||"",modelId:localStorage.modelId||""};u.modelId&&u.model&&u.brand&&u.family||(u=null),n.finish([i.fetch({uid:"me"})],function(n){var i;if(e.model_id)if(n&&n.length>0)if(i=n.filter(function(t){return t.modelId==e.model_id})[0])n=[i].concat(n.filter(function(e){return e.modelId!=i.modelId}));else{try{i=s.find(e.model_id);var l=a.find(i.familyId),d=c.find(l.brandId);i.prefix=l.prefix,i.family=l.family,i.brand=d.brand}catch(p){i=null}if(!i)return void o.page.navigate("/service/"+e.service_id+"/brand");i.modelId=i.id,i.save(),n.unshift(i);try{localStorage.model=i.model,localStorage.modelId=i.modelId}catch(p){}}else try{i=s.find(e.model_id);var l=a.find(i.familyId),d=c.find(l.brandId);if(i.prefix=l.prefix,i.family=l.family,i.brand=d.brand,i){i.modelId=i.id,i.save(),n=[i];try{localStorage.model=i.model,localStorage.modelId=i.modelId}catch(p){}}}catch(p){if(!u)return void o.page.navigate("/service/"+e.service_id+"/brand");i=u,n=[i]}else if(n&&n.length>0)i=n[0],e.model_id=i.modelId;else{if(!u)return void o.page.navigate("/service/"+e.service_id+"/brand");i=u,n=[i],e.model_id=i.modelId}r=o.restoreUserInput(e),o.doGetData(e,function(o,c){$.extend(e,{currentService:c,currentVehicle:i,allVehicles:n||[],userInputs:r}),t(o,e)})})}});return f}),define("model/order",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Order","id","status","created","modified","sum","modelId","model","vid","plate","cityCode","province","city","address","date","day","time","name","phone","services","__currentService","__currentVehicle"),r.extend({url:t.API_HOST+"/users/${uid}/orders"}),r}),define("widgets/FastButton",[],function(e,t,r){function n(e,t){this.element=e,this.handler=t,e.addEventListener("touchstart",this,!1),e.addEventListener("click",this,!1),this._lazyTap=e.hasAttribute("lazytap")}var i={};n.prototype.handleEvent=function(e){switch(e.type){case"touchstart":this.onTouchStart(e);break;case"touchmove":this.onTouchMove(e);break;case"touchend":this.onClick(e);break;case"click":this.onClick(e)}},n.prototype.onTouchStart=function(e){this.element.addEventListener("touchend",this,!1),document.body.addEventListener("touchmove",this,!1),this.startX=e.touches[0].clientX,this.startY=e.touches[0].clientY},n.prototype.onTouchMove=function(e){(Math.abs(e.touches[0].clientX-this.startX)>10||Math.abs(e.touches[0].clientY-this.startY)>10)&&this.reset()},n.prototype.onClick=function(e){this.reset(),this.handler(e),this._lazyTap&&this.addUnderFrame(e),"touchend"==e.type&&i.preventGhostClick(this.startX,this.startY)};var o;n.prototype.addUnderFrame=function(e){o||(o=document.createElement("div"),o.style.cssText=["opacity: 0","display: none;","border-radius: 60px;","position: absolute;","z-index: 99999;","width: 60px;","height: 60px"].join(""),document.body.appendChild(o)),o.style.top=e.changedTouches[0].clientY-30+"px",o.style.left=e.changedTouches[0].clientX-30+"px",o.style.display="block",setTimeout(function(){o.style.display="none"},360)},n.prototype.reset=function(){this.element.removeEventListener("touchend",this,!1),document.body.removeEventListener("touchmove",this,!1)},i.preventGhostClick=function(e,t){i.coordinates.push(e,t),window.setTimeout(i.pop,2500)},i.pop=function(){i.coordinates.splice(0,2)},i.onClick=function(e){for(var t=0;t<i.coordinates.length;t+=2){var r=i.coordinates[t],n=i.coordinates[t+1];Math.abs(e.clientX-r)<25&&Math.abs(e.clientY-n)<25&&(e.stopPropagation(),e.preventDefault())}},document.addEventListener("click",i.onClick,!0),i.coordinates=[],r.exports=n}),define("widgets/CustomSelect",["lib/template"],function(e,t,r){function n(e){this.triggerEl=e.triggerEl,this.inputEl=e.inputEl,this.optArr=e.optArr,this.onchange=e.onchange||function(){},this._originalSelectIndex=parseInt(this.inputEl.value||""),this._normalizedOptArr=this._normalizeData(e.optArr),this.bindEevent(),this.optionElArr=[],this._currentSelectedIndex=this._normalizedOptArr.selectedIndex,this._optionTmpl=e.optionTmpl||s,this._selectTmpl=['<div class="custom-select">','<ul class="custom-option-list">',"{{each data as value i}}",this._optionTmpl,"{{/each}}","</ul>","</div>"].join("")}var i=Spine.Events,o=e("./Popup"),c=e("./FastButton"),a=e("../lib/template"),s=['<li class="custom-option {{if value.selected}}selected{{/if}}" data-seq="{{i}}" lazytap="lazytap">','<span class="product-name">{{value.left}}</span>','<span class="product-price fr">{{value.right}}</span>',"</li>"].join("");n.prototype.bindEevent=function(){var e=this;new c(this.triggerEl,function(){e.render()})},n.prototype._normalizeData=function(e){for(var t,r,n,i,o=[],c=0,a=e.length;a>c;c++)t=e[c],r={},"[object Array]"==Object.prototype.toString.call(t)?(r.left=t[0]||"",r.right=t[1]||""):"object"==typeof t?(r.left=t.name,r.right=t.price,r.selected&&(n=r,i=c)):(r.left=t,r.right=""),o.push(r);return n?n.selected=!0:-1!=this._originalSelectIndex&&o[this._originalSelectIndex]?(i=this._originalSelectIndex,o[this._originalSelectIndex].selected=!0):(i=0,o[0]&&(o[0].selected=!0)),o.selectedIndex=i,o},n.prototype.change=function(e){e<this.optArr.length-1&&(this._originalSelectIndex=this._currentSelectedIndex=e,this.inputEl.value=this._currentSelectedIndex,self.onchange(self._currentSelectedIndex))},n.prototype.rebuildOptArr=function(e){e&&(this.optArr=e,this._originalSelectIndex=this._currentSelectedIndex=0,this.inputEl.value=this._currentSelectedIndex),this._normalizedOptArr=this._normalizeData(this.optArr)},n.prototype.render=function(e){var t=this;this.rebuildOptArr(e);var r=a.render(this._selectTmpl)({data:this._normalizedOptArr});o.open(r,function(e){for(var r=(e.querySelector(".confirm"),e.querySelector(".concel"),e.querySelectorAll(".custom-option")),n=function(){o.close(),t._originalSelectIndex=t._currentSelectedIndex,t.inputEl.value=t._currentSelectedIndex,t.onchange(t._currentSelectedIndex)},i=function(e){var i=e.currentTarget,o=i.getAttribute("data-seq");if(o){if(o==t._currentSelected)return;for(var c=0,a=r.length;a>c;c++)r[c].className=r[c].className.replace(" selected","");i.className=i.className+" selected",t._currentSelectedIndex=parseInt(o)}n()},a=0,s=r.length;s>a;a++)new c(r[a],i)})},$.extend(n.prototype,i),r.exports=n}),!function(){function e(e){return e.replace(b,"").replace(S,",").replace(_,"").replace(I,"").replace(x,"").split($)}function t(e){return"'"+e.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function r(r,n){function i(e){return p+=e.split(/\n/).length-1,d&&(e=e.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),e&&(e=y[1]+t(e)+y[2]+"\n"),e}function o(t){var r=p;if(l?t=l(t,n):c&&(t=t.replace(/\n/g,function(){return p++,"$line="+p+";"})),0===t.indexOf("=")){var i=u&&!/^=[=#]/.test(t);if(t=t.replace(/^=[=#]?|[\s;]*$/g,""),i){var o=t.replace(/\s*\([^\)]+\)/,"");f[o]||/^(include|print)$/.test(o)||(t="$escape("+t+")")}else t="$string("+t+")";t=y[1]+t+y[2]}return c&&(t="$line="+r+";"+t),g(e(t),function(e){if(e&&!h[e]){var t;t="print"===e?S:"include"===e?_:f[e]?"$utils."+e:m[e]?"$helpers."+e:"$data."+e,I+=e+"="+t+",",h[e]=!0}}),t+"\n"}var c=n.debug,a=n.openTag,s=n.closeTag,l=n.parser,d=n.compress,u=n.escape,p=1,h={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},v="".trim,y=v?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],b=v?"$out+=text;return $out;":"$out.push(text);",S="function(){var text=''.concat.apply('',arguments);"+b+"}",_="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+b+"}",I="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(c?"$line=0,":""),x=y[0],$="return new String("+y[3]+");";g(r.split(a),function(e){e=e.split(s);var t=e[0],r=e[1];1===e.length?x+=i(t):(x+=o(t),r&&(x+=i(r)))});var w=I+x+$;c&&(w="try{"+w+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+t(r)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var T=new Function("$data","$filename",w);return T.prototype=f,T}catch(O){throw O.temp="function anonymous($data,$filename) {"+w+"}",O}}var n=function(e,t){return"string"==typeof t?v(t,{filename:e}):c(e,t)};n.version="3.0.0",n.config=function(e,t){i[e]=t};var i=n.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},o=n.cache={};n.render=function(e,t){return v(e,t)};var c=n.renderFile=function(e,t){var r=n.get(e)||h({filename:e,name:"Render Error",message:"Template not found"});return t?r(t):r};n.get=function(e){var t;if(o[e])t=o[e];else if("object"==typeof document){var r=document.getElementById(e);if(r){var n=(r.value||r.innerHTML).replace(/^\s*|\s*$/g,"");t=v(n,{filename:e})}}return t};var a=function(e,t){return"string"!=typeof e&&(t=typeof e,"number"===t?e+="":e="function"===t?a(e.call(e)):""),e},s={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},l=function(e){return s[e]},d=function(e){return a(e).replace(/&(?![\w#]+;)|[<>"']/g,l)},u=Array.isArray||function(e){return"[object Array]"==={}.toString.call(e)},p=function(e,t){var r,n;if(u(e))for(r=0,n=e.length;n>r;r++)t.call(e,e[r],r,e);else for(r in e)t.call(e,e[r],r)},f=n.utils={$helpers:{},$include:c,$string:a,$escape:d,$each:p};n.helper=function(e,t){m[e]=t};var m=n.helpers=f.$helpers;n.onerror=function(e){var t="Template Error\n\n";for(var r in e)t+="<"+r+">\n"+e[r]+"\n\n";"object"==typeof console&&console.error(t)};var h=function(e){return n.onerror(e),function(){return"{Template Error}"}},v=n.compile=function(e,t){function n(r){try{return new s(r,a)+""}catch(n){return t.debug?h(n)():(t.debug=!0,v(e,t)(r))}}t=t||{};for(var c in i)void 0===t[c]&&(t[c]=i[c]);var a=t.filename;try{var s=r(e,t)}catch(l){return l.filename=a||"anonymous",l.name="Syntax Error",h(l)}return n.prototype=s.prototype,n.toString=function(){return s.toString()},a&&t.cache&&(o[a]=n),n},g=f.$each,y="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",b=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,S=/[^\w$]+/g,_=new RegExp(["\\b"+y.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),I=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,$=/^$|,+/;i.openTag="{{",i.closeTag="}}";var w=function(e,t){var r=t.split(":"),n=r.shift(),i=r.join(":")||"";return i&&(i=", "+i),"$helpers."+n+"("+e+i+")"};i.parser=function(e){e=e.replace(/^\s/,"");var t=e.split(" "),r=t.shift(),i=t.join(" ");switch(r){case"if":e="if("+i+"){";break;case"else":t="if"===t.shift()?" if("+t.join(" ")+")":"",e="}else"+t+"{";break;case"/if":e="}";break;case"each":var o=t[0]||"$data",c=t[1]||"as",a=t[2]||"$value",s=t[3]||"$index",l=a+","+s;"as"!==c&&(o="[]"),e="$each("+o+",function("+l+"){";break;case"/each":e="});";break;case"echo":e="print("+i+");";break;case"print":case"include":e=r+"("+t.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(i)){var d=!0;0===e.indexOf("#")&&(e=e.substr(1),d=!1);for(var u=0,p=e.split("|"),f=p.length,m=p[u++];f>u;u++)m=w(m,p[u]);e=(d?"=":"=#")+m}else e=n.helpers[r]?"=#"+r+"("+t.join(",")+");":"="+e}return e},"function"==typeof define?define("lib/template",[],function(){return n}):"undefined"!=typeof exports?module.exports=n:this.template=n}(),define("controller/car-schedule",["model/city","model/contact"],function(e){function t(e){for(var t,r,n,i,o=[e.allProvinceArr.map(function(e){return[e]}),(e.allCityMatrix[e.currentProvinceIndex]||[]).map(function(e){return[e]}),e.allDayArr.map(function(e){return[e]}),e.allTimeArr.map(function(e){return[e]})],c=document.querySelectorAll(".select-wrapper"),a=[],s=[],d=[],u=0,p=c.length;p>u;u++)t=c[u],r=t.querySelector(".custom-select-trigger"),n=t.querySelector("input"),n.value||(n.value=0),s.push(r),d.push(n),r&&n&&!function(t,r,n){i=new l({triggerEl:t,inputEl:r,optArr:o[n],onchange:function(r){function i(e,t){var r=e.querySelector(".product-name"),n=e.querySelector(".price");r.innerHTML=t[0],n&&(n.innerHTML=t[1])}if(-1!==r&&i(t,o[n][r]),0===n&&-1!==r&&r!==e.currentProvinceIndex){e.currentProvinceIndex=r,e.currentProvince=e.allProvinceArr[r],e.currentCity=e.allCityMatrix[r][0],e.currentCityIndex=0;var c=e.allCityMatrix[r].map(function(e){return[e]});o[n+1]=c,i(s[n+1],c[0]),a[n+1].render(c)}}}),a.push(i)}(r,n,u)}var r=e("../component/config"),n=e("../component/util"),i=e("../model/city"),o=e("../model/order"),c=e("../model/contact"),a=(e("../model/brand"),e("../model/model"),e("../widgets/Popup")),s=e("../widgets/FastButton"),l=e("../widgets/CustomSelect"),d=e("./common").sub({el:$("#car-schedule"),title:"上门服务信息",template:"template-schedule",doGetData:function(e,t){var r=e.userInputs||{};n.finish([i.fetch(),c.fetch({uid:"me"})],function(e,i){var o,c,a,s,l,d,u,p,f,m=[],h=[];c=a=0;var v=r.provinceInput,g=r.cityInput,y=r.dayInput,b=r.timeInput;if(d=r.nameInput,u=r.addressInput,p=r.phoneInput,dayIndex=y||0,timeIndex=b||0,i&&i.length){o=i[0],d=d||o.name,u=u||o.address,p=p||o.phone;var S;if(e.forEach(function(e,t){S=[],m.push(e.province),h.push(S),e.cities.forEach(function(e,r){S.push(e.city),e.cityCode==f&&(c=t,a=r)})}),0!==c&&(s=e[c],e.splice(c,1),e.unshift(s),m.splice(c,1),m.unshift(s.province),S=h[c],h.splice(c,1),h.unshift(S),c=0),0!==a){var _=e[c].cities,I=_[a];_.splice(a,1),_.unshift(I);var S=h[c];l=S[a],S.splice(a,1),S.unshift(l),a=0}}else h=[],m=e.map(function(e){return h.push(e.cities.map(function(e){return e.city})),e.province});v&&(c=v),g&&(a=g),s=e[c].province,l=e[c].cities[a].city;var x=1,$=new Date;$.getHours()>=14&&(x=2);var w=n.getDayArr(7,x),T=["上午","下午"],O={currentProvinceIndex:c,currentCityIndex:a,currentProvince:s,currentCity:l,allCities:e,allProvinceArr:m,allCityMatrix:h,allDayArr:w,allTimeArr:T,currentDayIndex:dayIndex,currentTimeIndex:timeIndex,currentDay:w[dayIndex],currentTime:T[timeIndex],name:d,address:u,phone:p};t(null,O)})},render:function(e){var i=this,o=template(this.template,e);this.el.html(o),setTimeout(function(){t.call(i,e)},200);var c=i.el.find("input[name=addressInput]"),l=i.el.find("input[name=nameInput]"),d=i.el.find("input[name=phoneInput]"),u=this.el.find(".j-nextstep"),p=function(t){var o=i.el.find("input[name=provinceInput]"),s=i.el.find("input[name=cityInput]"),u=i.el.find("input[name=dayInput]"),p=i.el.find("input[name=timeInput]"),f=o.val(),m=s.val(),h=c.val(),v=u.val(),g=p.val(),y=l.val(),b=d.val();if(t.preventDefault(),!h||!y||!b)return void(h?y?b||$("#phoneInput-error").removeClass("dn"):$("#nameInput-error").removeClass("dn"):$("#addressInput-error").removeClass("dn"));i.currentOrder.province=e.allProvinceArr[f],i.currentOrder.city=e.allCityMatrix[f][m],i.currentOrder.cityCode=e.allCities[f].cities[m].cityCode,i.currentOrder.address=h,i.currentOrder.day=e.allDayArr[v],i.currentOrder.time=["09:00","13:00"][g],i.currentOrder.name=y,i.currentOrder.phone=b;var S=n.makeDateFromStr(i.currentOrder.day+" "+i.currentOrder.time);i.currentOrder.date=S.valueOf(),i.currentOrder.save();var _=r.API_HOST+"/users/me/orders";a.openLoading(),$.ajax({type:"POST",url:_,contentType:"application/json",data:JSON.stringify({modelId:i.currentOrder.modelId,cityCode:i.currentOrder.cityCode,name:i.currentOrder.name,address:i.currentOrder.address,phone:i.currentOrder.phone,date:i.currentOrder.date,services:i.currentOrder.services}),success:function(){a.close();try{delete sessionStorage.stepSchedule}catch(t){}i.page.navigate("/service/"+e.service_id+"/model/"+e.model_id+"/success")},error:function(e,t,r){a.close(),alert("出错啦: "+t+r)}})};new s(u[0],p);var f=function(){input=$(this),input.parents(".form-row"),input.css("color","#88bb7d"),console.log(this);
var e=this.id+"-error";$("#"+e).addClass("dn")},m=function(){input=$(this),input.parents(".form-row"),input.css("color","")};[c,l,d].forEach(function(e){e.on("focus",f),e.on("blur",m)})},saveUserInput:function(){var e,t=this,r={},n=t.el.find("input");n.forEach(function(t){e=t.name,r[e]=t.value||""}),sessionStorage.scheduleUserInput=JSON.stringify(r)},deactivate:function(){this.saveUserInput(),this.constructor.__super__.deactivate.apply(this,arguments)},restoreUserInput:function(){var e;if(e=sessionStorage.scheduleUserInput)try{e=JSON.parse(e)}catch(t){e={}}return delete sessionStorage.scheduleUserInput,e},getData:function(e,t){var r=this;delete this.currentOrder;try{this.currentOrder=o.find("-1")}catch(n){}if(!this.currentOrder||this.currentOrder.destroyed)return void this.page.navigate("/service/"+e.service_id+"/model/"+e.model_id+"/cart");try{sessionStorage.stepSchedule=1}catch(n){}userInputs=r.restoreUserInput(),e.userInputs=userInputs,r.doGetData(e,function(n,i){$.extend(e,i,{sum:r.currentOrder.sum}),t(n,i)})}});return d}),define("model/city",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("City","province","cities"),r.extend({url:t.API_HOST+"/location/cities"}),r}),define("model/contact",[],function(e){var t=e("../component/config"),r=e("./common").sub();return r.configure("Contact","id","name","cityCode","city","address","phone"),r.extend({url:t.API_HOST+"/users/${uid}/contacts"}),r}),define("controller/car-success",[],function(e){var t=(e("../component/util"),e("../model/service"),e("../model/order")),r=(e("../model/brand"),e("../model/model"),e("./common").sub({el:$("#car-success"),title:"预约提交成功",template:"template-success",doGetData:function(e,r){var n,i,o=t.find("-1");n=o.__currentService,i=o.__currentVehicle;var c=$.extend(e,{currentOrder:o,currentService:n,currentVehicle:i});o.destroy(),r(null,c)},render:function(e){var t=template(this.template,e);this.el.html(t),new iScroll("j-success-container")},getData:function(e,r){var n=this;if(!e.service_id)return void this.page.navigate("/home");if(!e.model_id)return void this.page.navigate("/service/"+e.service_id+"/brand");delete this.currentOrder;try{this.currentOrder=t.find("-1")}catch(i){}return!this.currentOrder||this.currentOrder.destroyed?void this.page.navigate("/service/"+e.service_id+"/model/"+e.model_id+"/cart"):void n.doGetData(e,function(t,n){$.extend(e,n),r(t,n),sessionStorage.success=1})}}));return r});