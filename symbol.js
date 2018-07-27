(function() {
    let root = this;

    let generateName = (function() {
        let postfix = 0;
        return function(descString) {
            postfix++;
            return '@@' + descString + '_' + postfix;
        };
    })();

    let SymbolPolyfill = function Symbol(description) {
        if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor');

        let descString = description === undefined ? undefined : String(description);

        let symbol = Object.create({
            toString: function() {
                return this.__Name__;
            },
            valueOf: function() {
                return this;
            }
        });

        Object.defineProperties(symbol, {
            '__Description__': {
                value: descString,
                writable: false,
                enumerable: false,
                configurable: false
            },
            '__Name__': {
                value: generateName(descString),
                writable: false,
                enumerable: false,
                configurable: false
            }
        });

        return symbol;
    }

    let forMap = {};

    Object.defineProperties(SymbolPolyfill, {
        'for': {
            value: function(description) {
                let descString = description === undefined ? undefined : String(description)
                return forMap[descString] ? forMap[descString] : forMap[descString] = SymbolPolyfill(descString);
            },
            writable: true,
            enumerable: false,
            configurable: true
        },
        'keyFor': {
            value: function(symbol) {
                for (let key in forMap) {
                    if (forMap[key] === symbol) return key;
                }
            },
            writable: true,
            enumerable: false,
            configurable: true
        }
    });

    root.SymbolPolyfill = SymbolPolyfill;
})();

// Test code
var a = SymbolPolyfill('foo');
var b = SymbolPolyfill('foo');

console.log(a ===  b); // false

var o = {};
o[a] = 'hello';
o[b] = 'hi';

console.log(o); // Object { "@@foo_1": "hello", "@@foo_2": "hi" }

var s1 = Symbol('foo')
console.log(s1.valueOf()); // Symbol(foo)