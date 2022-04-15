import { EventEmitter } from 'events';

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