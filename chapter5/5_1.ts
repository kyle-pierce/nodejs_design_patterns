/*
 * 5.1: dissecting Promise.all
 * 
 * Implement your own version of Promise.all() leveraging promises, async/await, or a
 * combination of the two.  The function must be functionally rquivalent to its original counterpart
 */

export const promiseAll = async (promises: Iterable<Promise<any>>): Promise<any> => {
    const promisesArray = Array.from(promises);
    const resolvedPromises = [];

    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < promisesArray.length; i++) {
            promisesArray[i]
                .catch(err => reject(err))
                .then(result => {
                    resolvedPromises[i] = result;
                    if (resolvedPromises.length === promisesArray.length) {
                        return resolve(resolvedPromises);
                    }
                })
        }
    });
}

// code below here is just for testing purposes

const sleep = (ms: number): Promise<number> => {
    return new Promise(resolve => setTimeout(() => {
        console.log('  done waitiing ' + ms + 'ms');
        return resolve(ms);
    }, ms));
}

const testPromiseAllResolves = (fn: (input: Promise<any>[]) => Promise<any>, logString: string) => {
    console.log(logString + ' (where all promises resolve)');
    const promises = [
        sleep(20),
        sleep(5),
        sleep(10),
        sleep(100)
    ];
    fn(promises).then(results => console.log('  results: [' + results + ']'));
}

const testPromiseAllReject = (fn: (input: Promise<any>[]) => Promise<any>, logString: string) => {
    console.log(logString + ' (where a promise rejects)');
    const promises = [
        sleep(20),
        sleep(5),
        Promise.reject('this one is rejected'),
        sleep(100)
    ];
    fn(promises).then(results => console.log('  results: [' + results + ']'))
                .catch(err => console.log('  oh no, we get this error: ' + err));
}

const main = async () => {
    testPromiseAllResolves(promiseAll, "testing my promise all implementation")

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\n');

    testPromiseAllResolves(Promise.all.bind(Promise), "testing built-in Promise.all(...) implementation");

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\n');
    
    testPromiseAllReject(promiseAll, "testing my promise all implementation");

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\n');

    testPromiseAllReject(Promise.all.bind(Promise), "testing built-in Promise.all(...) implementation");
}

main();