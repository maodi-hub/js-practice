class MyPromise {
    static REJECTED = 'rejected';
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';

    value = undefined;
    status = MyPromise.PENDING;
    onFulfilledCallBacks = [];
    onRejectedCallBacks = [];
    constructor(excutor) {
        const resolve = (value) => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.FULFILLED;
                this.value = value;
                this.onFulfilledCallBacks.forEach(fn => fn(value));
            }
        }

        const reject = (value) => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.REJECTED;
                this.value = value;
                this.onRejectedCallBacks.forEach(fn => fn(value));
            }
        }

        try {
            excutor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    static resolve(value) {
        return new MyPromise((resolve, _) => {
            resolve(value);
        });
    }

    static reject(value) {
        return new MyPromise((_, reject) => {
            reject(value);
        });
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : onFulfilled => onFulfilled;
        onRejected = typeof onRejected === 'function' ? onRejected : onRejected => onRejected;

        return new MyPromise((resolve, reject) => {
            if (this.status === MyPromise.FULFILLED) {
                try {
                    queueMicrotask(() => {
                        const res = onFulfilled(this.value);
                        this.handlePromiseResult(res, resolve, reject);
                    })
                } catch (error) {
                    reject(error);
                }
            } else if (this.status === MyPromise.REJECTED) {
                try {
                    queueMicrotask(() => {
                        const res = onRejected(this.value);
                        this.handlePromiseResult(res, resolve, reject);
                    })
                } catch (error) {
                    reject(error);
                }
            } else {

                this.onFulfilledCallBacks.push((value) => {
                    queueMicrotask(() => {
                        const res = onFulfilled(value);
                        this.handlePromiseResult(res, resolve, reject);
                    })
                });

                this.onRejectedCallBacks.push((value) => {
                    queueMicrotask(() => {
                        const res = onRejected(value);
                        this.handlePromiseResult(res, resolve, reject);
                    })
                });
            }
        });
    }

    handlePromiseResult(result, resolve, reject) {
        if (result instanceof MyPromise) {
            result.then(resolve, reject);
        } else {
            resolve(result);
        }
    }
}

const a = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log("mp", 1)
        resolve(2);
    }, 1000);
}).then((val) => {
    console.log("mp then", val);
    return MyPromise.resolve(5)
}).then((val) => {
    console.log("mp then second", val)
})

const d = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("mp", 3)
        resolve(4);
    }, 1000);
}).then((val) => {
    console.log("mp then", val)
})

const b = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("p", 1)
        resolve(2);
    }, 1000);
}).then((val) => {
    console.log("p then", val);
    return 5
}).then((val) => {
    console.log("p then second", val)
})

const c = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("p", 3)
        resolve(4);
    }, 1000);
}).then((val) => {
    console.log("p then", val)
})

