import * as fs from 'fs';
import progressStream from 'progress-stream';
import { Transform, TransformCallback } from 'stream';

// class MyTransform extends Transform {
//   private len = 0;
//
//   _transform(chunk, encoding, callback) {
//     // this.push(chunk);
//     console.log({ encoding, curLen: (this.len += chunk.length) });
//     callback();
//   }
// }

const progress = progressStream((_) => {
  console.log(JSON.stringify(_));
});

const fp = process.argv[2];
const fileSize = fs.statSync(fp).size;
fs.createReadStream(fp)
  .pipe(progress)
  .pipe(
    new Transform({
      transform: (chunk, _, callback) => {
        console.log(chunk.length);
        callback();
      },
    })
  )
  .on('data', () => {
    //   console.log({ data });
  })
  .on('end', () => {
    console.log('end');
  });
