import { access, lstat, readdir } from 'fs';
import { TaskQueue } from './TaskQueue';

/*
 * 4.2: list files recursively
 * 
 * Write listNestedFiles(), a callback-style function that takes, as input, the path to a 
 * directory in the local filesystem and that asynchronously iterates over all the 
 * subdirectories to eventually return a list of all the files discovered.
 * 
 * My question: is there any file ordering requirement?  Not specified, so I guess no.
 */

export const listNestedFiles = (dirName: string, callback: (err: Error, files: string[]) => any) => {
    const taskQueue = new TaskQueue();

    const handleFile = (file: string, fileList: string[], callback: (err: Error, files: string[]) => any) => {
        fileList.push(file);
        lstat(file, (err, fileStats) => {
            if (err) {
                return callback(err, null);
            }
            if (fileStats.isDirectory) {
                taskQueue.pushTask(() => addFilesFrom(file, fileList, callback));
            }
        });
    }

    const addFilesFrom = (subDirName: string, fileList: string[], callback: (err: Error, files: string[]) => any) => {
        readdir(subDirName, (err, files) => {
            if (err) {
                return callback(err, null);
            }
            files.forEach(file => handleFile(file, fileList, callback));
        });
    }

    access(dirName, (err) => {
        if (err) {
            return callback(err, null);
        }
        const allFiles = [];
        taskQueue.pushTask(() => addFilesFrom(dirName, allFiles, callback))
                 .on('empty', () => callback(null, allFiles));
    });
}