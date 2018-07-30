class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.value;
        this.reason;

        this.onSuccessCallback = [];
        this.onErrorCallback = [];

        let resolve = val => {
            if (this.status === 'pending') {
                this.value = val;
                this.status = 'fulfilled';

                this.onSuccessCallback.forEach(fn => fn());
            }
        }

        let reject = reason => {
            if (this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';

                this.onErrorCallback.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    static resolve(value) {
        return new Promise((resolve) => {
            resolve(value);
        });
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    static all(promises) {
        return new Promise((resolve, reject) => {
            let arr = [];
            let index = 0;

            const saveData = (i, data) => {
                arr[i] = data;
                if (++index === promises.length) {
                    resolve(arr);
                }
            }

            for (let i = 0; i < promises.length; i++) {
                promises[i].then(data => {
                    saveData(i, data);
                }, reject);
            }
        });
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err;
        };

        let Promise2;
        promise2 = new Promise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === 'pending') {
                this.onSuccessCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });

                this.onErrorCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
}

let resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) {
        return reject(new TypeError('错了'));
    }
    let called;
    if (x != null && (typeof x === 'function' || typeof x === 'object')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call((x, y) => {
                    if (called) {
                        return;
                    } else {
                        called = true;
                    }
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) {
                        return;
                    } else {
                        called = true;
                    }
                    reject(r);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) {
                return;
            } else {
                called = true;
            }
            reject(e);
        }
    } else {
        resolve(x);
    }
}

/**
 * Promise/A+规范测试
 * npm i -g promises-aplus-tests
 * promises-aplus-tests Promise.js
 */

try {
    module.exports = Promise
} catch (e) {
}