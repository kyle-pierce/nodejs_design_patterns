import { accessSync, lstat, readdir } from 'fs';

/*
 * 4.2: list files recursively
 * 
 * Write listNestedFiles(), a callback-style function that takes, as input, the path to a 
 * directory in the local filesystem and that asynchronously iterates over all the 
 * subdirectories to eventually return a list of all the files discovered.
 * 
 * My question: is there any file ordering requirement?  Not specified, so I guess no.
 */

const listNestedFiles = (dirName: string, callback: (err: Error, files: string[]) => any) => {
    // make sure given directory exists synchronously, since otherwise proceeding will cause errors
    try {
        accessSync(dirName);
    } catch (err) {
        return process.nextTick(() => callback(err, null));
    }

    const handleFile = (file: string, callback: (err: Error, filePath: string) => any) => {
        callback(null, file);
        lstat(file, (err, fileStats) => {
            if (err) {
                return callback(err, null);
            }
            if (fileStats.isDirectory) {
                addFilesFrom(file, callback);
            }
        });
    }

    const addFilesFrom = (subDirName: string, callback: (err: Error, filePath: string) => any) => {
        readdir(subDirName, (err, files) => {
            if (err) {
                return callback(err, null);
            }
            files.forEach(file => handleFile(file, callback));
        });
    }

    const allFiles = [];
    addFilesFrom(dirName, (err, filePath) => {
        if (err) {
            return callback(err, null);
        }
        allFiles.push(filePath);
    });

    // TODO: how do we know when all the files have been processed?  I don't think we want
    //       to call the given callback with the allFiles list before then
}