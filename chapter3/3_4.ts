import { EventEmitter } from 'events';

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