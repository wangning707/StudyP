function MVVM(options) {
    // init
    this.$data = options.data;
    this.$methods = options.methods;
    this.$el = options.el;

    // save data's attribute to all the watcher
    this._binding = {};

    // use observer & compile
    this._observer(options.data);
    this._compile();

    // this.xxx proxy this.$data.xxx
    this.proxyAttribute();
}

// 将this.<attr>的调用代理到this.$data.<attr>上，同时this.<attr>的值的改变也会同步到this.$data.<attr上>
MVVM.prototype.proxyAttribute = function () {
    var keys = Object.keys(this.$data);
    var self = this;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        (function (key) {
            Object.defineProperty(self, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return self.$data[key];
                },
                set: function (newVal) {
                    if (newVal !== self.$data[key]) {
                        self.$data[key] = newVal;
                    }
                }
            })
        })(key)
    }
}

MVVM.prototype._observer = function (data) {
    const self = this;

    for (let key in this.$data) {

        if (this.$data.hasOwnProperty(key)) {
            // init attribute to subscriber container (array)
            this._binding[key] = {
                _directives: [],
                _texts: []
            };

            if (typeof this.$data[key] === 'object') {
                return this._observer(this.$data[key]);
            }

            let val = data[key];
            // IIFE get true cycle item
            (function (value, key) {
                Object.defineProperty(self.$data, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return value;
                    },
                    set(newval) {
                        if (newval === value) {
                            return;
                        }
                        value = newval;
                        // listen data changed get all attributes to subscriber, tell view update attribute
                        if (self._binding[key]._directives) {
                            self._binding[key]._directives.forEach(function (watcher) {
                                watcher.update();
                            }, self);
                        }
                        // listen data changed get all attributes to subscriber, tell view update text
                        if (self._binding[key]._texts) {
                            self._binding[key]._texts.forEach(function (watcher) {
                                watcher.update();
                            }, self);
                        }
                    }
                });
            })(val, key);
        }
    }
}

MVVM.prototype._compile = function () {
    const self = this;
    let dom = document.querySelector(this.$el);
    let children = dom.children;
    let i = 0,
        j = 0;

    // update function, but when observer's modal's data changed, use update function by Wathcer's update, to update dom
    let update = null;
    for (; i < children.length; i++) {
        let node = children[i];
        (function (node) {
            // analysis {{}} 's content
            // save order's original content, if not so, when data update can't finish replace
            let text = node.innerText;
            let matches = text.match(/{{([^{}]+)}}/g);
            if (matches && matches.length) {
                // save node bind all attributes
                node.bindingAttributes = [];
                for (j = 0; j < matches.length; j++) {
                    // data's attribute
                    let attr = matches[j].match(/{{([^{}]+)}}/)[1];
                    // save data of bind this node
                    node.bindingAttributes.push(attr);
                    (function (attr) {
                        updater = function () {
                            // changed attribute to text exchange
                            let innerText = text.replace(new RegExp('{{' + attr + '}}', 'g'), self.$data[attr]);
                            // if this node bind many attributes eg:<div>{{title}}{{description}}</div>
                            for (let k = 0; k < node.bindingAttributes.length; k++) {
                                if (node.bindingAttributes[k] !== attr) {
                                    // recover unchanged attribute to text
                                    innerText = innerText.replace('{{' + node.bindingAttributes[k] + '}}', self.$data[node.bindingAttributes[k]]);
                                }
                            }
                            node.innerText = innerText;
                        }
                        self._binding[attr]._texts.push(new Watcher(self, attr, updater));
                    })(attr);
                }
            }

            // analysis vue order
            let attributes = node.getAttributeNames();
            for (j = 0; j < attributes.length; j++) {
                // vue order
                let attribute = attributes[j];
                // DOM attribute
                let domAttr = null;
                // bind data's attribute
                let vmDataAttr = node.getAttribute(attribute);

                if (/v-bind:([^=]+)/.test(attribute)) {
                    // analysis v-bind
                    domAttr = RegExp.$1;
                    // update function
                    updater = function (val) {
                        node[domAttr] = val;
                    }
                    // data attribute bind mult-watchers
                    self._binding[vmDataAttr]._directives.push(new Watcher(self, vmDataAttr, updater));
                } else if (attribute === 'v-model' && (node.tagName == 'INPUT' || node.tagName == 'TEXTAREA')) {
                    // analysis v-model
                    // update function
                    updater = function (val) {
                        node.value = val;
                    }
                    // data's attribute bind mult-watchers
                    self._binding[vmDataAttr]._directives.push(
                        new Watcher(self, vmDataAttr, updater)
                    );
                    // listen input/textarea's data changed, update to model, realize double direction bind
                    node.addEventListener('input', function (evt) {
                        let $el = evt.currentTarget;
                        self.$data[vmDataAttr] = $el.value;
                    });
                } else if (/v-on:([^=]+)/.test(attribute)) {
                    // analysis v-on
                    let event = RegExp.$1;
                    let method = vmDataAttr;
                    node.addEventListener(event, function (evt) {
                        self.$methods[method] && self.$methods[method].call(self, evt);
                    });
                }
            }
        })(node);
    }
}

function Watcher(vm, attr, cb) {
    this.vm = vm; //viewmodel
    this.attr = attr; //data's attribute, one watcher observe one data's attribute
    this.cb = cb; // update function, define iin compile
    // init view
    this.update();
}

Watcher.prototype.update = function () {
    // tell compile's update function update dom
    this.cb(this.vm.$data[this.attr]);
}