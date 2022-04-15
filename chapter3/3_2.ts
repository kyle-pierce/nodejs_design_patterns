import { EventEmitter } from 'events';

/*
 * 3.2: ticker
 * 
 * Write a function that accepts a number and a callback as the arguments.  The function will return an
 * EventEmitter that emits an event called tick every 50ms until the number of milliseconds is passed
 * from the invocation of the function.  The function will also call the callback when the number of
 * milliseconds has passed, providing, as the result, the total count of tick events emitted.
 * 
 * Hint: you can use setTimeout() to schedule another setTimeout() recursively.
 */

const ticker = (tickUntilMs: number, callback: (error: Error | null, numTicks: number) => any) => {
    const eventEmtter = new EventEmitter();
    const msBetweenTicks = 50;

    const continueTicker = (ticksSoFar: number) => {
        if (ticksSoFar * 50 >= tickUntilMs) {
            // use nextTick so this branch is async, just like the other branch
            process.nextTick(() => callback(null, ticksSoFar));
        } else {
            setTimeout(() => {
                eventEmtter.emit('tick');
                continueTicker(ticksSoFar + 1)
            }, msBetweenTicks);
        }
    }

    continueTicker(0);
    return eventEmtter;
}