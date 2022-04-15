import { EventEmitter } from 'events';

const DEFAULT_CONCURRENCY = 10;

export class TaskQueue extends EventEmitter {
    concurrency: number;
    running: number;
    queue: ((error: Error) => any)[]

    constructor (concurrency?) {
        super();
        this.concurrency = concurrency || DEFAULT_CONCURRENCY;
        this.running = 0;
        this.queue = []
    }

    pushTask = (task: () => any) => {
        this.queue.push(task);
        process.nextTick(this.next.bind(this));
    }

    next = () => {
        if (this.running === 0 && this.queue.length === 0) {
            return this.emit('empty');
        }
        while (this.running < this.concurrency && this.queue.length) {
            this.queue.unshift((error: Error) => {
                if (error) {
                    this.emit('error', error);
                }
                this.running--;
                process.nextTick(this.next.bind(this));
            });
            this.running++;
        }
    }
}