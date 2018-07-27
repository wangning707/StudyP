function println(msg) {
    console.log(msg);
}

// let strategies = {
//     'S': function (salary) {
//         return salary * 4;
//     },
//     'A': function (salary) {
//         return salary * 3;
//     },
//     'B': function (salary) {
//         return salary * 2;
//     }
// };

// let calculateBonus = function (level, salary) {
//     return strategies[level](salary);
// };

// println(calculateBonus('S', 20000));
// println(calculateBonus('A', 10000));

// let tween = {
//     linear: function (t, b, c, d) {
//         return c * t / d + b;
//     },
//     easeIn: function (t, b, c, d) {
//         return c * (t /= d) * t + b;
//     },
//     strongEaseIn: function (t, b, c, d) {
//         return c * (t /= d) * t * t * t * t + b;
//     },
//     strongEaseOut: function (t, b, c, d) {
//         return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
//     },
//     sineaseIn: function (t, b, c, d) {
//         return c * (t /= d) * t * t + b;
//     },
//     sineaseOut: function (t, b, c, d) {
//         return c * ((t = t / d - 1) * t * t + 1) + b;
//     }
// };

// let Animate = function(dom) {
//     this.dom = dom;
//     this.startTime = 0;
// }


// let str = 'abcd12345ed125ss123456789'.split('');
// let r = [''];
// let flag = 0;

// for (var i = 0; i < str.length; i++) {
//     if (IsNum(str[i])) {
//         if (!IsNum(str[i - 1])) {
//             flag++;
//             r[flag] = '';
//         }
//         r[flag] += str[i];
//     }
// }
// r.splice(0, 1);
// r.sort(function(a, b) {
//     return b.length - a.length;
// });

// println(r[0]);

// function IsNum(s) {
//     if (s != null && s != "" && s != " ") {
//         return !isNaN(s);
//     }
//     return false;
// }


// let lines = '1 1 1 3'.split(' ').map(function(item){
//     return parseInt(item);
// });
// let head = 0;
// let tail = lines.length-1;
// let count = 0;
// while (tail >= head){
//     if (lines[head] == lines[tail]){
//         head ++;
//         tail --;
//     } else if (lines[head] < lines[tail]){
//         lines[head + 1] += lines[head];
//         head ++;
//         count ++;
//     } else if (lines[head] > lines[tail]){
//         lines[tail - 1] += lines[tail];
//         tail --;
//         count ++;
//     }
// }
// println(count);


// let n = 3;

// let sum = 3 ** n;

// let chun = (3 ** (n-3)) * (n-2) * 2;

// let r = sum - chun;
// println(r);


// let Flower = function() {};
// let xiaoming = {
//     sendFlower: function(target) {
//         let flower = new Flower();
//         target.receiveFlower(flower);
//     }
// };

// let B = {
//     receiveFlower: function(flower) {
//         A.listenGoodMood(function() {
//             A.receiveFlower(flower);
//         });
//     }
// };

// let A = {
//     receiveFlower: function(flower) {
//         println('Receive flower ' + flower);
//     },
//     listenGoodMood: function(fn) {
//         setTimeout(function() {
//             fn();
//         }, 1000);
//     }
// };

// xiaoming.sendFlower(B);


// let mult = function () {
//     let a = 1;
//     for (let i = 0, l = arguments.length; i < l; i++) {
//         a = a * arguments[i];
//     }
//     return a;
// };

// let plus = function () {
//     let a = 0;
//     for (let i = 0, l = arguments.length; i < l; i++) {
//         a = a + arguments[i];
//     }
//     return a;
// };

// let createProxyFactory = function (fn) {
//     let cache = {};
//     return function () {
//         let args = Array.prototype.join.call(arguments, ',');
//         if (args in cache) {
//             return cache[args];
//         }
//         return cache[args] = fn.apply(this, arguments);
//     }
// };

// let proxyMult = createProxyFactory(mult),
//     proxyPlus = createProxyFactory(plus);

// println(proxyMult(1, 2, 3, 4)); // 输出：24
// println(proxyMult(1, 2, 3, 4)); // 输出：24
// println(proxyPlus(1, 2, 3, 4)); // 输出：10
// println(proxyPlus(1, 2, 3, 4)); // 输出：10



// let each = function (ary, callback) {
//     for (let i = 0, l = ary.length; i < l; i++) {
//         callback.call(ary[i], i, ary[i]);
//     }
// };

// let compare = function (ary1, ary2) {
//     if (ary1.length !== ary2.length) {
//         throw new Error('ary1 != ary2');
//     }
//     each(ary1, function (i, n) {
//         if (n != ary2[i]) {
//             throw new Error('ary1 != ary2');
//         }
//     });
//     println('ary1 == ary2');
// };

// compare([1, 2, 3], [1, 2, 4]);


// let Iterator = function (obj) {
//     let current = 0;
//     let next = function () {
//         current++;
//     };

//     let isDone = function () {
//         return current >= obj.length;
//     };

//     let getCurrItem = function () {
//         return obj[current];
//     };

//     return {
//         next: next,
//         isDone: isDone,
//         getCurrItem: getCurrItem
//     };
// };

// let compare = function (iterator1, iterator2) { 
//         if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
//             throw new Error('iterator1 != iterator2');
//         }
//         iterator1.next();
//         iterator2.next();
//     }
//     println('iterator1 == iterator2');
// };

// let iterator1 = Iterator([1, 2, 3]);
// let iterator2 = Iterator([1, 2, 3]);
// compare(iterator1, iterator2); // 输出：iterator1 和 iterator2 相等


// let salesOffices = {};

// salesOffices.clientList = [];

// salesOffices.listen = function (fn) {
//     this.clientList.push(fn);
// };

// salesOffices.trigger = function () {
//     for (let i = 0, fn; fn = this.clientList[i++];) {
//         fn.apply(this, arguments);
//     }
// };

// salesOffices.listen(function (price, squareMeter) { // 小明订阅消息
//     console.log('价格= ' + price);
//     console.log('squareMeter= ' + squareMeter);
// });
// salesOffices.listen(function (price, squareMeter) { // 小红订阅消息
//     console.log('价格= ' + price);
//     console.log('squareMeter= ' + squareMeter);
// });
// salesOffices.trigger(2000000, 88); // 输出：200 万，88 平方米
// salesOffices.trigger(3000000, 110); // 输出：300 万，110 平方米



// let Event = (function () {
//     let clientList = {},
//         listen,
//         trigger,
//         remove;

//     listen = function (key, fn) {
//         if (!clientList[key]) {
//             clientList[key] = [];
//         }
//         clientList[key].push(fn);
//     };
//     trigger = function () {
//         let key = Array.prototype.shift.call(arguments),
//             fns = clientList[key];
//         if (!fns || fns.length === 0) {
//             return false;
//         }
//         for (let i = 0, fn; fn = fns[i++];) {
//             fn.apply(this, arguments);
//         }
//     };

//     remove = function (key, fn) {
//         let fns = clientList[key];
//         if (!fns) {
//             return false;
//         }
//         if (!fn) {
//             fns && (fns.length = 0);
//         } else {
//             for (let l = fns.length - 1; l >= 0; l--) {
//                 let _fn = fns[l];
//                 if (_fn === fn) {
//                     fns.splice(1, 1);
//                 }
//             }
//         }
//     };

//     return {
//         listen: listen,
//         trigger: trigger,
//         remove: remove
//     }
// })();

// Event.listen('squareMeter88', function (price) {
//     console.log('price= ' + price);
// });

// Event.trigger('squareMeter88', 2000000);


// let macroCommand = function() {
//     return {
//         commandsList: [],
//         add: function(command) {
//             this.commandsList.push(command);
//         },
//         execute: function() {
//             for (let i=0, command; command = this.commandsList[i++];) {
//                 command.execute();
//             }
//         }
//     }
// };

// let openTvCommand = {
//     execute: function() {
//         console.log('打开电视');
//     },
//     add: function() {
//         throw new Error('叶对象不能添加子节点');
//     }
// };

// macroCommand = macroCommand();

// macroCommand.add(openTvCommand);
// openTvCommand.add(macroCommand);


let Folder = function (name) {
    this.name = name;
    this.files = [];
};

Folder.prototype.add = function (file) {
    this.files.push(file);
};
Folder.prototype.scan = function () {
    console.log('开始扫描文件夹: ' + this.name);
    for (let i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};

let File = function (name) {
    this.name = name;
};

File.prototype.add = function () {
    throw new Error('文件下面不能再添加文件');
};
File.prototype.scan = function () {
    console.log('开始扫描文件: ' + this.name);
};

var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('jQuery');
var file1 = new File('JavaScript 设计模式与开发实践');
var file2 = new File('精通 jQuery');
var file3 = new File('重构与模式')
folder1.add(file1);
folder2.add(file2);
folder.add(folder1);
folder.add(folder2);
folder.add(file3);

var folder3 = new Folder('Nodejs');
var file4 = new File('深入浅出 Node.js');
folder3.add(file4);
var file5 = new File('JavaScript 语言精髓与编程实践');
folder.scan(); 