import { EventEmitter } from 'events';

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