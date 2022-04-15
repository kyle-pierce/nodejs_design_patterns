import { EventEmitter } from 'events';

/*
 * 3.4: playing with errors
 *
 * Modify the function created in exercises 3.3 so that it produces an error if the timestamp at the moment 
 * of a tick (including the initial one that we added as part of exercise 3.3) is divisible by 5.  Propagate
 * the error using both the callback and the event emitter.
 * 
 * Hint: use Date.now() to get the timestamp and the remainder (%) operator to check whether the 
 * timestamp is divisible by 5.
 */

const ticker = (tickUntilMs: number, callback: (error: Error | null, numTicks: number) => any) => {
    const eventEmtter = new EventEmitter();
    const msBetweenTicks = 50;

    const continueTicker = (ticksSoFar: number) => {
        process.nextTick(() => eventEmtter.emit('tick'));
        if (Date.now() % 5 === 0) {
            const error = new Error('timestamp is evenly divisible by 5');
            eventEmtter.emit('error', error);
            process.nextTick(() => callback(error, ticksSoFar));
        } else if (ticksSoFar * 50 >= tickUntilMs) {
            process.nextTick(() => callback(null, ticksSoFar));
        } else {
            setTimeout(() => continueTicker(ticksSoFar + 1), msBetweenTicks);
        }
    }

    continueTicker(0);
    return eventEmtter;
}