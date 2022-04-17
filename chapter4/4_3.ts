import { access, lstat, readdir, readFile } from "fs";
import { TaskQueue } from './TaskQueue';

/*
 * 4.3: recursive find
 * 
 * Write recursiveFind(), a callback-style function that takes a path to a directory 
 * in the local filesystem and a keyword.  The function must find all the text files
 * within the given directory that contain the given keyword in the file contents.  The
 * list of matching files should be returned using the callback when the search is
 * completed.  If no matching file is found, the callback must be invoked with an 
 * empty array.  Bonus points if you make the search recursive.  Extra bonus points
 * if you manage to perform the search within different files and subdirectories in parallel.
 */

export const recursiveFind = (dir: string, keyword: string, callback: (err: Error, results: string[]) => any) => {
    const taskQueue = new TaskQueue();

    const addIfContainsKeyword = (file: string, fileList: string[], callback: (err: Error, files: string[]) => any) => {
        readFile(file, (err, contents) => {
            if (err) {
                return callback(err, null);
            }
            if (keyword in contents) {
                fileList.push(file);
            }
        });
    }

    const handleFile = (file: string, fileList: string[], callback: (err: Error, files: string[]) => any) => {
        lstat(file, (err, fileStats) => {
            if (err) {
                return callback(err, null);
            }
            if (fileStats.isDirectory) {
                taskQueue.pushTask(() => addFilesFrom(file, fileList, callback));
            } else {
                addIfContainsKeyword(file, fileList, callback);
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

    access(dir, (err) => {
        if (err) {
            return callback(err, null);
        }
        const results = [];
        taskQueue.pushTask(() => addFilesFrom(dir, results, callback))
                 .on('empty', () => callback(null, results));
    });
}