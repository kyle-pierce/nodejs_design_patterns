import { EventEmitter } from 'events';
import { readFile } from 'fs';

/*
 * 3.1: a simple event
 * 
 * Modify the asynchronous FindRegex class so that it emits and event when the find process starts,
 * passing the input file list as an argument.  
 * 
 * Hint: beware of Zalgo!
 */

class FindRegex extends EventEmitter {
    regex: string;
    files: string[];

    constructor(regex) {
        super();
        this.regex = regex;
        this.files = [];
    }

    addFile = (file: string) => {
        this.files.push(file);
        return this;
    }

    find = () => {
        // wrong: this would be synchronous, but the rest of the event emissions are async
        this.emit('start_bad', this.files);

        // right: this makes it async to match the other events
        process.nextTick(() => this.emit('start_good', this.files));

        for (const file of this.files) {
            readFile(file, 'utf8', (err, content) => {
                if (err) {
                    return this.emit('error', err);
                }
                this.emit('fileread', file);
                const match = content.match(this.regex);
                if (match) {
                    match.forEach(el => this.emit('found', file, el));
                }
            });
        }
        return this;
    }
}