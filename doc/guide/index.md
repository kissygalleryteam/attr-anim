## 综述

AttrAnim是一个能对Dom元素或window做scrollLeft/scrollTop属性滚动动画的模块。由于KISSY5.0在高级浏览器中默认使用 anim/transition 模块来做动画，如果要对 scrollLeft/scrollTop 属性做动画还需手动引入 anim/timer 模块，模块体积相对较大成本高，此时则可以考虑使用这个 attr-anim 模块来实现 scrollLeft/scrollTop 的动画。

* 版本：1.0
* 作者：秋知
* demo：[http://gallery.kissyui.com/attr-anim/1.0/demo/index.html](http://gallery.kissyui.com/attr-anim/1.0/demo/index.html)

## 初始化组件
		
    S.use('kg/attr-anim/1.0.0/index', function (S, AttrAnim) {

        var scrollInstance =  new AttrAnim(document.getElementById('test'),{
                scrollTop : 150
          },{
            duration : 4,
            easing : 'swing',
            complete : function(){
                alert('anim end!');
            }
          });
    })
	

## API说明

### 配置参数

构造函数：AttrAnim(elem, propsObj, config)
@param elem {window|HTMLElement} 要添加动画的元素。若要对窗口添加滚动条的动画，直接传入 window
@param propsObj {Object} 要做动画的scrollLeft/scrollTop
@param config {Object} 动画配置
@param config.duration {Number} 动画时间
@param config.easing {String} 动画平滑函数，参考[kissy anim easing](http://docs.kissyui.com/1.4/docs/html/demo/anim/easing.html#easing-visual)
@param config.complete {Function} 动画结束回调函数

### 方法

*run()*: 运行动画

*stop(isGoToEnd)*: 停止动画
@param isGoToEnd {Boolean} 是否跳到最后一帧

*pause()*: 暂停动画

*resume()*: 继续动画 

*isRunning()*: 返回是否正在动画状态

*isPaused()*: 返回是否暂停动画状态