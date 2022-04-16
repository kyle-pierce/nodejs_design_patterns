import { readFile, writeFile } from 'fs';

/*
 * 4.1: file concatenation
 * 
 * Write the implementation of concatFiles(), a callback-style function that takes two or more 
 * paths to text files in the filesystem and a destination file.  The function must copy the contents
 * of every source file into the destination file, respecting the order of the files as provided by
 * the arguments list.  For instance, given two files, if the first file contains 'foo' and the 
 * second file contains 'bar', the function should write 'foobar' (and not 'barfoo') in the
 * destination file.  Note that the preceding example signature is not valid Javascript syntax: you 
 * need to find a different way to handle an arbitrary number of arguments.  For instance, you could
 * use rest parameters syntax (nodejsdp.link/rest-parameters).
 */

export const concatFiles = (dst: string, callback: (err: Error) => any, src1: string, src2: string, ...additionalSrcs: string[]) => {
    const srcFiles = [src1, src2, ...additionalSrcs];

    const iterate = (startIndex: number, contentAccumulator: string, callback: (err: Error, content: string) => any) => {
        if (startIndex === srcFiles.length) {
            return callback(null, contentAccumulator);
        }

        readFile(srcFiles[startIndex], (err, contents) => {
            if (err) {
                return callback(err, null);
            }
            iterate(startIndex + 1, contentAccumulator + contents, callback);
        });
    };

    iterate(0, '', (err, contents) => {
        if (err) {
            return callback(err);
        }
        writeFile(dst, contents, callback);
    });
}