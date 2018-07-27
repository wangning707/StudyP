(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Swiper = factory();
    }
}(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    var Swiper = function (options) {
        this.initData(options);  //初始化数据
        //初始化面板指示点
        if (this.haveDots) {
            this.initDots();
        }
        this.initPlay();
    };

    Swiper.prototype = {
        constructor: Swiper,
        initData: function (options) {
            this.el = window.document.querySelector(options.el);  //元素
            this.dirs = options.dirs;  //图片路径
            this.haveDots = options.haveDots || false;  //是否显示面板指示点
            this.interval = options.interval || 5000;  //自动切换时间间隔
            this.duration = options.duration || 1000;  //滑动动画时长
            this.timer = null;  //切换图片定时器
            this.showTimer = null;  //显示图片定时器
            this.imgs = [];  //已经加载的图片
            this.index = 0;  //当前显示图片下标
            this.dots;  //面板指示点

            this.el.classList.add('swiper');
        },
        initDots: function () {
            var dots = '<div class="focus-content-container"><ul class="focus-content">';
            for (var i = 0; i < this.dirs.length; i++) {
                dots += '<li class="focus-content-item"><a class="focus-anchor" id="' + i + '"></a></li>';
            }
            dots += '</ul></div>';
            this.el.innerHTML += dots;
            this.dots = window.document.getElementsByClassName("focus-anchor");
            this.dots[this.index].style.opacity = '1';
            this.addHandle();
        },
        initPlay: function () {
            var self = this;
            if (!self.imgs[self.index]) {
                self.initImg();
            }

            self.imgs[self.index].load();
            self.el.style.opacity = '1';

            self.timer = setTimeout(TIMER, self.interval);

            function TIMER() {
                self.index = self.index >= self.dirs.length - 1 ? 0 : self.index + 1;
                if (!self.imgs[self.index]) {
                    self.initImg();
                }
                self.el.style.opacity = '0';
                clearTimeout(self.timer);
                clearTimeout(self.showTimer);
                self.showTimer = setTimeout(function () {
                    self.imgs[self.index].load();
                    self.el.style.opacity = 1;
                    if (self.haveDots) {
                        self.dots[self.index].style.opacity = '1';
                        for (var i = 0; i < self.dirs.length; i++) {
                            if (i != self.index) {
                                self.dots[i].style.opacity = 0.5;
                            } else {
                                self.dots[i].style.opacity = 1;
                            }
                        }
                    }
                }, self.duration);
                self.timer = setTimeout(TIMER, self.interval);
            }
        },
        initImg: function () {
            var self = this;
            self.imgs[self.index] = new Image();
            self.imgs[self.index].src = self.dirs[self.index];
            self.imgs[self.index].load = function () {
                self.el.style.backgroundImage = 'url(' + this.src + ')';
            };
        },
        addHandle: function () {
            var self = this;
            for (var i = 0; i < this.dirs.length; i++) {
                this.dots[i].addEventListener('mouseup', clickDot, false);
            }

            function clickDot(event) {
                event = event ? event : window.event;
                var target = event.target ? event.target : event.srcElement;
                self.index = target.id;
                for (var i = 0; i < self.dirs.length; i++) {
                    if (i != self.index) {
                        self.dots[i].style.opacity = 0.5;
                    } else {
                        self.dots[i].style.opacity = 1;
                    }
                }
                clearTimeout(self.timer);
                clearTimeout(self.showTimer);
                self.initPlay();
            }
        }
    }
    return Swiper;
}));