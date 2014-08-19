/*
combined files : 

kg/attr-anim/1.0.0/index

*/
/**
 * @fileoverview 
 * @author 秋知<benfchen.cf@alibaba-inc.com>
 * @module attr-anim
 **/

KISSY.add('kg/attr-anim/1.0.0/index',function(S){
var PI = Math.PI, pow = Math.pow, sin = Math.sin, parseNumber = parseFloat, CUBIC_BEZIER_REG = /^cubic-bezier\(([^,]+),([^,]+),([^,]+),([^,]+)\)$/i, BACK_CONST = 1.70158;
var Easing = {
    /**
* swing effect.
*/
    swing: function (t) {
        return 0.5 - Math.cos(t * PI) / 2;
    },
    /**
* Uniform speed between points.
*/
    easeNone: function(t){
        return t;
    },
    linear: function(t){
        return t;
    },
    /**
* Begins slowly and accelerates towards end. (quadratic)
*/
    easeIn: function (t) {
        return t * t;
    },
    /**
* Begins quickly and decelerates towards end.  (quadratic)
*/
    easeOut: function (t) {
        return (2 - t) * t;
    },
    /**
* Begins slowly and decelerates towards end. (quadratic)
*/
    easeBoth: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t : 0.5 * (1 - --t * (t - 2));
    },
    /**
* Begins slowly and accelerates towards end. (quartic)
*/
    easeInStrong: function (t) {
        return t * t * t * t;
    },
    /**
* Begins quickly and decelerates towards end.  (quartic)
*/
    easeOutStrong: function (t) {
        return 1 - --t * t * t * t;
    },
    /**
* Begins slowly and decelerates towards end. (quartic)
*/
    easeBothStrong: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t * t * t : 0.5 * (2 - (t -= 2) * t * t * t);
    },
    /**
* Snap in elastic effect.
*/
    elasticIn: function (t) {
        var p = 0.3, s = p / 4;
        if (t === 0 || t === 1) {
            return t;
        }
        return 0 - pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p);
    },
    /**
* Snap out elastic effect.
*/
    elasticOut: function (t) {
        var p = 0.3, s = p / 4;
        if (t === 0 || t === 1) {
            return t;
        }
        return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
    },
    /**
* Snap both elastic effect.
*/
    elasticBoth: function (t) {
        var p = 0.45, s = p / 4;
        if (t === 0 || (t *= 2) === 2) {
            return t;
        }
        if (t < 1) {
            return -0.5 * (pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
        }
        return pow(2, -10 * (t -= 1)) * sin((t - s) * (2 * PI) / p) * 0.5 + 1;
    },
    /**
* Backtracks slightly, then reverses direction and moves to end.
*/
    backIn: function (t) {
        if (t === 1) {
            t -= 0.001;
        }
        return t * t * ((BACK_CONST + 1) * t - BACK_CONST);
    },
    /**
* Overshoots end, then reverses and comes back to end.
*/
    backOut: function (t) {
        return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1;
    },
    /**
* Backtracks slightly, then reverses direction, overshoots end,
* then reverses and comes back to end.
*/
    backBoth: function (t) {
        var s = BACK_CONST;
        var m = (s *= 1.525) + 1;
        if ((t *= 2) < 1) {
            return 0.5 * (t * t * (m * t - s));
        }
        return 0.5 * ((t -= 2) * t * (m * t + s) + 2);
    },
    /**
* Bounce off of start.
*/
    bounceIn: function (t) {
        return 1 - Easing.bounceOut(1 - t);
    },
    /**
* Bounces off end.
*/
    bounceOut: function (t) {
        var s = 7.5625, r;
        if (t < 1 / 2.75) {
            r = s * t * t;
        } else if (t < 2 / 2.75) {
            r = s * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            r = s * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            r = s * (t -= 2.625 / 2.75) * t + 0.984375;
        }
        return r;
    },
    /**
* Bounces off start and end.
*/
    bounceBoth: function (t) {
        if (t < 0.5) {
            return Easing.bounceIn(t * 2) * 0.5;
        }
        return Easing.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    }
}; 

/**
@class AttrAnim 针对元素的attribute的动画实现，支持KISSY5.0.0
@param elem {window|HTMLElement} 要添加动画的元素。若要对窗口添加滚动条的动画，直接传入 window
@param endAttrsObj {Object} 要改变的attribute
@param config {Object} 动画配置
*/
function AttrAnim(elem, endAttrsObj, config){
    var self = this;
    self.elem = elem;

    self.duration = config.duration;
    self.easingFunction = Easing[config.easing];
    self.complete = config.complete;
    self.endAttrsObj = endAttrsObj;

    self.alreadyStartRun = false;
    self.isRunning = false;
    self.isComplete = false;
    self.isPaused = false;
    self.nowTime = 0;
    self.frameTime = 16;

}

AttrAnim.prototype.run = function(){
    var self = this;

    if(self.elem == window){  //针对窗口的scrollTop/scrollLeft兼容各个浏览器
        self.elemInitScrollTop = document.documentElement.scrollTop + document.body.scrollTop;
        self.elemInitScrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft;
        if(self.elemInitScrollLeft == self.endAttrsObj.scrollLeft || self.elemInitScrollTop == self.endAttrsObj.scrollTop){
            self.complete(self.elem);
            return;
        }
    }else{
        self.elemInitScrollLeft = self.elem.scrollLeft;
        self.elemInitScrollTop = self.elem.scrollTop;
    }

    if(self.alreadyStartRun) { return; }

    self.alreadyStartRun = true;
    self.isRunning = true;
    self.animTimer = setInterval(function(){
        self._elemInNextStep(self.nowTime);
        self.nowTime += self.frameTime/1000;
        
    },self.frameTime);
}

AttrAnim.prototype._elemInNextStep = function(nowTime){
    var self = this;
    if(nowTime < self.duration){
       var nowAttrPecent  = self.easingFunction(nowTime/self.duration);
       if(self.elem == window){
            var windowEndLeft = self.endAttrsObj.scrollLeft ? (self.elemInitScrollLeft + (self.endAttrsObj.scrollLeft - self.elemInitScrollLeft)*nowAttrPecent) : 0,
                windowEndTop = self.endAttrsObj.scrollTop ? (self.elemInitScrollTop + (self.endAttrsObj.scrollTop - self.elemInitScrollTop)*nowAttrPecent) : 0;
            window.scrollTo(windowEndLeft,windowEndTop);
       }else{
           self.endAttrsObj.scrollLeft && (self.elem.scrollLeft = self.elemInitScrollLeft + (self.endAttrsObj.scrollLeft - self.elemInitScrollLeft)*nowAttrPecent);
           self.endAttrsObj.scrollTop && (self.elem.scrollTop = self.elemInitScrollTop + (self.endAttrsObj.scrollTop - self.elemInitScrollTop)*nowAttrPecent);

       }
    }else{
        clearInterval(self.animTimer);
        self._jumpEnd();
        self.isComplete = true;
        self.complete(self.elem);
    }  
}

AttrAnim.prototype.stop = function(isGoToTheEnd){
    var self = this;
    if(!this.isRunning) { return; }

    isGoToTheEnd && self._jumpEnd();
    clearInterval(this.animTimer);
    
}

AttrAnim.prototype._jumpEnd = function(){
    var self = this;
    if(self.elem == window){
        var windowEndLeft = self.endAttrsObj.scrollLeft ? self.endAttrsObj.scrollLeft : 0,
            windowEndTop = self.endAttrsObj.scrollTop ? self.endAttrsObj.scrollTop : 0;
        window.scrollTo(windowEndLeft,windowEndTop);
    }else{
       self.endAttrsObj.scrollLeft && (self.elem.scrollLeft = self.endAttrsObj.scrollLeft);
       self.endAttrsObj.scrollTop && (self.elem.scrollTop = self.endAttrsObj.scrollTop);
    }
}

AttrAnim.prototype.pause = function(){
    var self = this;
    if(self.isRunning){
        clearInterval(self.animTimer);
        self.isRunning = false;
        self.isPaused = true;
    }
}

AttrAnim.prototype.resume = function(){
    var self = this;

    if(!self.isPaused){ return; }
    self.isPaused = false;
    self.isRunning = true;
    self.animTimer = setInterval(function(){
        self.nowTime += self.frameTime/1000;

        self._elemInNextStep(self.nowTime);
        
    },self.frameTime);
}

AttrAnim.prototype.isRunning = function(){
    return this.isRunning;
}

AttrAnim.prototype.isPaused = function(){
    return this.isPaused;
}

return AttrAnim;
})
