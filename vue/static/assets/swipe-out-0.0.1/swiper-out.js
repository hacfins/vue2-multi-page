/**
 * Created by hacfin005 on 2018/6/20.
 */
/* ===============================================================================
 ************   Swipeout ************
 =============================================================================== */
/* global $:true */
var support = {
    touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
};
var touchEvents = {
    start: support.touch ? 'touchstart' : 'mousedown',
    move: support.touch ? 'touchmove' : 'mousemove',
    end: support.touch ? 'touchend' : 'mouseup'
};
function getTouchPosition(e) {
    e = e.originalEvent || e; //jquery wrap the originevent
    if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
        return {
            x: e.targetTouches[0].pageX,
            y: e.targetTouches[0].pageY
        };
    } else {
        return {
            x: e.pageX,
            y: e.pageY
        };
    }
};

+function () {
    "use strict";

    var cache = [];
    var TOUCHING = 'swipeout-touching'

    var Swipeout = function(el) {

        this.container = el;
        this.mover = this.container.querySelectorAll('.weui-cell__bd')[0]

        this.attachEvents();

        cache.push(this)


    }

    Swipeout.prototype.touchStart = function(e) {


        if(!_hasClass(this.container,'weui-cell_swiped')){
            return;
        }
        var p = getTouchPosition(e);

        this.container.className += ' '+ TOUCHING;
        this.start = p;
        this.swip_startX = 0;
        this.startTime = + new Date;
        var transform =  _computeStyle(this.mover,'transform').match(/-?[\d\.]+/g)
        if (transform && transform.length) this.swip_startX = parseInt(transform[4])
        this.diffX = this.diffY = 0;


        // this._closeOthers()
        this.limit = this.container.querySelectorAll('.weui-cell__ft')[0].clientWidth || 68; // 因为有的时候初始化的时候元素是隐藏的（比如在对话框内），所以在touchstart的时候计算宽度而不是初始化的时候


    };

    Swipeout.prototype.touchMove= function(e) {


        if(!this.start) return true;
        var p = getTouchPosition(e);
        this.diffX = p.x - this.start.x;
        this.diffY = p.y - this.start.y;
        if (Math.abs(this.diffX) < Math.abs(this.diffY)) { // 说明是上下方向在拖动
            this.close()
            //Hacfin
            if( this.container.querySelectorAll('.info-list-con-oper').length > 0){
                this.container.querySelectorAll('.info-list-con-oper')[0].style.visibility = 'visible'
            }

            this.start = false
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        var x = this.diffX + this.startX
        if (x > 0) x = 0;
        if (Math.abs(x) > this.limit) x = - (Math.pow(-(x+this.limit), .7) + this.limit)

        this.mover.style.transform = "translate3d("+x+"px, 0, 0)";
    };
    Swipeout.prototype.touchEnd = function(e) {

        if (!this.start){

            cache.forEach(function (s) {
                var t = _computeStyle(s.mover,'transform').match(/-?[\d\.]+/g)
                if(t && typeof t[4] != 'undefined'&& t[4] !=0){
                    if(_hasClass(s.container,'weui-cell_swiped')){
                        e.preventDefault();
                        e.stopPropagation();
                        s.close()
                    }
                }
            })
            return true;
        }
        this.start = false;
        var x = this.diffX + this.swip_startX
        var t = new Date - this.startTime;


        if (this.diffX < -5 && t < 300) { // 向左快速滑动，则打开
            //Hacfin

            if(_hasClass(this.container,'weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }

            this.open()

        } else if(this.diffX <= 5 && t<300){

            this._closeOthers()

            //Hacfin
            if(this.swip_startX != 0){
                if(_hasClass(this.container,'weui-cell_swiped')){
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.close();
                if(this.container.querySelectorAll('.info-list-con-oper').length > 0){
                    this.container.querySelectorAll('.info-list-con-oper')[0].style.visibility = 'visible'
                }



            }
            if(!_hasClass(e.target,'info-list-con-oper')&&!_hasClass(e.target,'fa-info-more') ){

                cache.forEach(function (s) {
                    var t = _computeStyle(s.mover,'transform').match(/-?[\d\.]+/g)
                    if(t && typeof t[4] != 'undefined'&& t[4] !=0){
                        if(_hasClass(s.container,'weui-cell_swiped')){
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        return false
                    }
                })
            }


        }else if (this.diffX >5 && t < 300) { // 向右快速滑动，或者单击,则关闭
            //Hacfin

            if(_hasClass(this.container,'weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }

            this.close()
            //Hacfin
            if(this.container.querySelectorAll('.info-list-con-oper').length > 0){
                this.container.querySelectorAll('.info-list-con-oper')[0].style.visibility = 'visible'
            }


        } else if (x > 0 || -x <= this.limit / 2) {

            //Hacfin
            if(_hasClass(this.container,'weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }
            this.close()
            //Hacfin
            if(this.container.querySelectorAll('.info-list-con-oper').length > 0){
                this.container.querySelectorAll('.info-list-con-oper')[0].style.visibility = 'visible'
            }

        } else {
            //Hacfin
            if(_hasClass(this.container,'weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }
            this.open()

        }

    };

    Swipeout.prototype.close = function() {
        _removeClass(this.container,TOUCHING)
        this.mover.style.transform = "translate3d(0, 0, 0)";
        _trigger('swipeout-close', this.container);
    }

    Swipeout.prototype.open = function() {
        _removeClass(this.container,TOUCHING)
        this._closeOthers()
        this.mover.style.transform = "translate3d(" + (-this.limit) + "px, 0, 0)"
        _trigger('swipeout-open', this.container);
    }

    Swipeout.prototype.attachEvents = function() {
        var el = this.mover;
        el.addEventListener(touchEvents.start, this.touchStart.bind(this));
        el.addEventListener(touchEvents.move, this.touchMove.bind(this));
        el.addEventListener(touchEvents.end, this.touchEnd.bind(this));
    }
    Swipeout.prototype._closeOthers = function() {
        //close others
        var self = this
        cache.forEach(function (s) {
            if (s !== self) {
                s.close();

                if( s.container.querySelectorAll('.info-list-con-oper').length > 0){
                    s.container.querySelectorAll('.info-list-con-oper')[0].style.visibility = 'visible'
                }

            }
        })
    }

    var swipeout = function(el) {
        return new Swipeout(el);
    };
    function initSwipeOut(str,methodName){
       var elem_arr = document.querySelectorAll(str);
        for(var i = 0; i < elem_arr.length; i++){
            var s = swipeout(elem_arr[i]);
            if (methodName) {
                s[methodName]()
            }
        }

    }
    window.$swipeout = initSwipeOut;
}();