import { Transform } from 'stream';

import { round } from '../../../base/interface/utils';

export class SizeTransformer extends Transform {
  private hasRead = 0;

  private readonly size;

  private readonly f;

  constructor(size, f: (size: number) => void) {
    super();
    this.size = size;
    this.f = f;
  }

  _transform(chunk, _, callback) {
    // @ts-ignore
    this.push(chunk);
    this.hasRead += chunk.length;
    const pct = round(this.hasRead / this.size, 3);
    this.f(pct);
    callback();
  }
}
