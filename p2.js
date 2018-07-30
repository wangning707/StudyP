function Promise(exexutor) {
    let self = this;
    self.value = undefined;
    self.reason = undefined;
    self.status = 'pending';

    self.onFulFilledCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'resolved';

            self.onFulFilledCallbacks.forEach(onFulFilled => {
                onFulFilled(self.value);
            });
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            self.onRejectedCallbacks.forEach(onRejected => {
                onRejected(self.reason);
            });
        }
    }

    try {
        exexutor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = function (onFulFilled, onRejected) {
    if (this.status === 'pending') {
        this.onFulFilledCallbacks.push(() => {
            onFulFilled(this.value);
        });
        this.onRejectedCallbacks.push(() => {
            onRejected(this.reason);
        });
    } else if (this.status === 'resolved') {
        onFulFilled(this.value);
    } else if (this.status === 'rejected') {
        onRejected(this.reason);
    }
}


let pms = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (parseInt(Math.random() * 10) > 5) {
            console.log('随机数大于5，算任务成功了')
            resolve('还可以传参哦')
        } else {
            console.log('随机数< 5，算任务失败了')
            reject('还可以传参哦< 5')
        }
    }, 1500)
})

pms.then((value) => {
    console.log('success', value)
}, (reason) => {
    console.log('fail', reason)
})

pms.then((value) => {
    console.log('success1', value)
}, (reason) => {
    console.log('fail1', reason)
})
pms.then((value) => {
    console.log('success2', value)
}, (reason) => {
    console.log('fail2', reason)
})
