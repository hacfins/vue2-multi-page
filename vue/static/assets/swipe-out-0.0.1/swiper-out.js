/**
 * Created by hacfin005 on 2018/6/20.
 */
/* ===============================================================================
 ************   Swipeout ************
 =============================================================================== */
/* global $:true */
$.support = (function() {
    var support = {
        touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
    };
    return support;
})();
$.touchEvents = {
    start: $.support.touch ? 'touchstart' : 'mousedown',
    move: $.support.touch ? 'touchmove' : 'mousemove',
    end: $.support.touch ? 'touchend' : 'mouseup'
};
$.getTouchPosition = function(e) {
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

+function ($) {
    "use strict";

    var cache = [];
    var TOUCHING = 'swipeout-touching'

    var Swipeout = function(el) {

        this.container = $(el);
        this.mover = this.container.find('>.weui-cell__bd')

        this.attachEvents();

        cache.push(this)


    }

    Swipeout.prototype.touchStart = function(e) {


        var p = $.getTouchPosition(e);

        this.container.addClass(TOUCHING);
        this.start = p;
        this.swip_startX = 0;
        this.startTime = + new Date;
        var transform =  this.mover.css('transform').match(/-?[\d\.]+/g)


        if (transform && transform.length) this.swip_startX = parseInt(transform[4])
        this.diffX = this.diffY = 0;


        // this._closeOthers()
        this.limit = this.container.find('>.weui-cell__ft').width() || 68; // 因为有的时候初始化的时候元素是隐藏的（比如在对话框内），所以在touchstart的时候计算宽度而不是初始化的时候



    };

    Swipeout.prototype.touchMove= function(e) {


        if(!this.start) return true;
        var p = $.getTouchPosition(e);
        this.diffX = p.x - this.start.x;
        this.diffY = p.y - this.start.y;
        if (Math.abs(this.diffX) < Math.abs(this.diffY)) { // 说明是上下方向在拖动
            this.close()
            //Hacfin
            this.container.find('.info-list-con-oper').css('visibility','visible')
            this.start = false
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        var x = this.diffX + this.startX
        if (x > 0) x = 0;
        if (Math.abs(x) > this.limit) x = - (Math.pow(-(x+this.limit), .7) + this.limit)

        this.mover.css("transform", "translate3d("+x+"px, 0, 0)");
    };
    Swipeout.prototype.touchEnd = function(e) {
        if (!this.start){
            cache.forEach(function (s) {
                var t = s.mover.css('transform').match(/-?[\d\.]+/g)
                if(t && typeof t[4] != 'undefined'&& t[4] !=0){
                    if(s.container.hasClass('weui-cell_swiped')){
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

            if(this.container.hasClass('weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }

            this.open()

        } else if(this.diffX <= 5 && t<300){
            this._closeOthers()

            //Hacfin
            if(this.swip_startX != 0){
                if(this.container.hasClass('weui-cell_swiped')){
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.close();
                this.container.find('.info-list-con-oper').css('visibility','visible')


            }
            if(!$(e.target).hasClass('info-list-con-oper')&&!$(e.target).hasClass('fa-info-more')){

                cache.forEach(function (s) {
                    var t = s.mover.css('transform').match(/-?[\d\.]+/g)
                    if(t && typeof t[4] != 'undefined'&& t[4] !=0){
                        if(s.container.hasClass('weui-cell_swiped')){
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        return false
                    }
                })
            }


        }else if (this.diffX >5 && t < 300) { // 向右快速滑动，或者单击,则关闭
            //Hacfin
            if(this.container.hasClass('weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }

            this.close()
            //Hacfin
            this.container.find('.info-list-con-oper').css('visibility','visible')

        } else if (x > 0 || -x <= this.limit / 2) {
            //Hacfin
            if(this.container.hasClass('weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }
            this.close()
            //Hacfin
            this.container.find('.info-list-con-oper').css('visibility','visible')

        } else {
            //Hacfin
            if(this.container.hasClass('weui-cell_swiped')){
                e.preventDefault();
                e.stopPropagation();
            }
            this.open()

        }

    };


    Swipeout.prototype.close = function() {
        this.container.removeClass(TOUCHING);
        this.mover.css("transform", "translate3d(0, 0, 0)");
        this.container.trigger('swipeout-close');
    }

    Swipeout.prototype.open = function() {
        this.container.removeClass(TOUCHING);
        this._closeOthers()
        this.mover.css("transform", "translate3d(" + (-this.limit) + "px, 0, 0)");
        this.container.trigger('swipeout-open');
    }

    Swipeout.prototype.attachEvents = function() {
        var el = this.mover;

        el.on($.touchEvents.start, $.proxy(this.touchStart, this));
        el.on($.touchEvents.move, $.proxy(this.touchMove, this));
        el.on($.touchEvents.end, $.proxy(this.touchEnd, this));
    }
    Swipeout.prototype._closeOthers = function() {
        //close others
        var self = this
        cache.forEach(function (s) {
            if (s !== self) {
                s.close();
                s.container.find('.info-list-con-oper').css('visibility','visible')
            }
        })
    }

    var swipeout = function(el) {
        return new Swipeout(el);
    };

    $.fn.swipeout = function (arg) {
        return this.each(function() {
            var $this = $(this)
            var s = $this.data('swipeout') || swipeout(this);
            $this.data('swipeout', s);

            if (typeof arg === typeof 'a') {
                s[arg]()
            }
        });
    }

    $('.weui-cell_swiped').swipeout() // auto init
}($);