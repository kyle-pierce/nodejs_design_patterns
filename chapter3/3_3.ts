import { EventEmitter } from 'events';

/*
 * 3.3: a simple modification
 * 
 * Modify the function created in exercise 3.2 so that it emits a tick event immediately after
 * the function is invoked.
 */

const ticker = (tickUntilMs: number, callback: (error: Error | null, numTicks: number) => any) => {
    const eventEmtter = new EventEmitter();
    const msBetweenTicks = 50;

    const continueTicker = (ticksSoFar: number) => {
        // use nextTick so first 'tick' event is async, like the others would be
        process.nextTick(() => eventEmtter.emit('tick'));
        if (ticksSoFar * 50 >= tickUntilMs) {
            process.nextTick(() => callback(null, ticksSoFar));
        } else {
            setTimeout(() => continueTicker(ticksSoFar + 1), msBetweenTicks);
        }
    }

    continueTicker(0);
    return eventEmtter;
}