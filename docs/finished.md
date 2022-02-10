# dev finished (bugfix/todo)

[toc]

## :white_check_mark: uploading trd would also have erp

It's version problem, and now it has gone along with the version update.

## :white_check_mark: when parsing file, the focus won't be broke even switching tabs

update 2022-01-10 20:00:43: it's the typical problem of old state.

And the easiest solution is to use `react-usestateref`

```ts
import useState from 'react-usestateref';

const [count, setCount, counterRef] = useState(0);

console.log(couterRef.current); // it will always have the latest state value
setCount(20);
console.log(counterRef.current);
```

ref:

- [javascript - React hooks: accessing up-to-date state from within a callback - Stack Overflow](https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback)

## :white_check_mark: 实现TRD的数据读取与存储

## [PASS] add log module. updated 2022-01-10.

## :white_check_mark： 实现`better-sqlite3`的表定义与封装

<img alt="picture 1" src=".imgs/readme-1641513479890-b40f4b84e7c4b68820621bef53990ba4720f7145ad1a827765774c385ce963a9.png" />  

## :white_check_mark: db init with `generate table in source code` or via `.env`.

2022-01-04，it's very successful and valuable to finally solve this problem!

## :white_check_mark: change `asar: false`. 2022-01-03 tried this option, but does no help to out project, except let me more clear about what there are in the archive.

## :white_check_mark: add electron menu. 2022-01-02

## :white_circle: replace the progress stream, since it doesn't synchronize with the database, and not accurate for percentage measure。2022-01-02 19:49:20。

I have done some research on how to do the `pipe` on node stream, and learned a lot.

In fact, I first browsed node.js documentation, but in a loss.

Then I dived into the source code of the package I am using: `progress-stream`, and realized he used the dependent
package of `through2`.

Then I followed the github of `through2`, which gave me the following valuable instruction:

<img alt="picture 4" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/readme-1641124409482-1c069776954120fe6eee94cfce02304aa1df52ba6f439eafde9fe08aff5dfa3f.png" width="480" />  

![xxx](.imgs/readme-1641124409482-1c069776954120fe6eee94cfce02304aa1df52ba6f439eafde9fe08aff5dfa3f.png)

Hence, based on my knowledge, I diy one for simplicity without any third package.

```ts
import { Transform } from 'stream';

import { round } from '../../../../universal';

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
```

And also, I came up with the idea of using two percentage calculator, one for read file size, one for saved rows.

Afterwards, I realized the final ideal effect, which is accurate and lovely -- two circular progresses:

<img alt="picture 5" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/readme-1641124623310-610165c32f2a9c057a43b9bce837f83a949d1b5cb514d84c83fa00fd25a638ae.png" width="480" />  

Thanks for all !

ref:

- [stream 流 | Node.js API 文档](http://nodejs.cn/api/stream.html#class-streamwritable)


- [API 文档 - Node.js 中文网](http://api.nodejs.cn/)

- [rvagg/through2: Tiny wrapper around Node streams2 Transform to avoid explicit subclassing noise](https://github.com/rvagg/through2)

- [through2原理解析 - SegmentFault 思否](https://segmentfault.com/a/1190000011740894)

## :white_check_mark: add the global settings json file, so that the frontend and the backend can mutually use it。2022-01-02 17:04:24

## :white_check_mark: 省份匹配。2022-01-02，用之前的程序改成js版即可

## :white_check_mark: 测试ERP的数据读取与存储。1-1: finished

## :white_check_mark: 优化文件读取过程中的前端界面展示。12-31: finished

## :white_check_mark: TS2339: Property 'erp' does not exist on type 'PrismaClient '. 12-28: The solution is to use `npx prisma generate`

## :white_check_mark: 解析数据有误问题

<img alt="picture 85" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640727064460-hjxh_express_match-ef7ad551f05d995b7d62a68dd1266da479d4fe23db55bc33e90a88659de823b2.png" width="480" />  

webstorm csv
<img alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640818483726-readme-6b9898d3ca36fd93ba344066a0a0edc4ae1f5ded1bb4514d7b6a6b7f826ee23f.png" width="480" />

wps csv
<img alt="picture 2" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640818676192-readme-234f19b03d36c2ed0dbf4b4e63ac9ff71eb7403f548a2ced3a95fef68fc09ebf.png" width="480" />

sublime csv
<img alt="picture 3" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640818798363-readme-23414155e8d44b50106386793550f69266edb4bb56ab2265acb53e5579beb927.png" width="480" />

:heart: attempt to save to wps [update: 不愧是我]
<img alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640850093908-readme-5eed7e6b10041c726e1ed91bda8847e6bd0739ba086c507777fa06b100bffbc1.png" width="480" />

This solution is rather robust, and does solve my problem, which achieves a balance between server code and user
experience!

What a genius I am that a flash of inspiration occurred to my mind which suggested me to give 're-saving' a shot :
heavy_exclamation_mark:

<img alt="picture 2" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640852978049-readme-a3aeac71d966dc7ba96fcfa5d8250f8dc9cfd32219644f4c776876bab9f1bb57.png" width="480" />  

## :white_check_mark: `sqlite3、typeorm` native dependency

2021-12-30 update：there is no need to think about `typeorm` any longer since I have decided to use `prisma` which works
well.

安装`sqlite3, typeorm`之后没法运行`electron`了
<img alt="picture 87" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640739763499-hjxh_express_match-9a466a1ba9c7e3921873956cbed26e0aec705605d42efc653a7d45e76ae73aab.png" width="480" />

ref:

- [What is exactly native dependency? · Issue #1042 · electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1042)

## :white_check_mark: 学习`prisma`的连接与插入业务流设计范式。

方案：`prisma`
会在第一次query时自动连接数据库，拥有一个数据库连接池，所以无需我自己管理。ref: [Connecting and disconnecting (Concepts) | Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management)

## :white_check_mark: csv只读取第一行

方案：在`fast-csv`的第一个回调里处理就可以，这里就是第一行；如果不是行的话，可以用`fs`的`start | end`参数控制。

## :white_check_mark: 寻求`fast-csv` skip error的方案。

结果：官方回复：[Skip row at on('error') event ](https://github.com/C2FO/fast-csv/issues/179#:~:text=No%2C%20if%20an%20error%20is%20encountered%20it%20is%20usually%20because%20the%20parser%20is%20unsure%20how%20to%20proceed%20with%20the%20file%2C%20and%20can%20lead%20to%20very%20unpredictable%20results.)

<img alt="picture 2" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640844862434-readme-d430a803f9cf6cba63b866ddfde9bf1a40e94425b20f27b0be462ee986a75e7f.png" width="480" />  

## :white_check_mark: 支持上传的文件的 Sample 备份预览（包含head与tail五行）。

这是之前的方案，目前已经不采用，目前不存在0/1的问题，即不是按文件为基本单位传输给用户，而是在读取过程中持续地按行为基本单位（可选：筛选出有问题的部分）传输给用户，因此备份预览没有意义也不需要了。

## :white_check_mark: 完成数据库、前端、后端的基本设计。2021年12月22日

## :white_check_mark: no-headers pass but headers not

The reason is that I wrote condition of `_id === null` with always return `true` since the default 'error result'
is `""`, an empty string not `null`.

So, I remedied it by changing the condition to `!_id` which can detect not only `null` but also 'empty'. And then I
fixed this bug.

<img alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640844532391-readme-097119c7c9ee1495027a008fa92a7e3a24200f32e1b76f5b6aa00ed875defc30.png" width="480" />  

## :white_check_mark: `progress-stream` cause bug

2021年12月29日04:47:04，在引入`progress-stream`包后导致了`csv`解析的错误，后来测试发现，只要把`progress-stream`放在`fast-csv`
之前就行了。想来也是，毕竟`progress-stream`是处理`stream`的，而`csv`那一步已经变成`row`了，具体细节我也不明白也不是很重要，这里会用就行了。
<img alt="picture 84" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640724530991-hjxh_express_match-c68e2f5550740af90b70137dcd9b0cc1946817232135f21bc5bd39e311b27b2d.png" width="480" />

- [freeall/progress-stream: Read the progress of a stream](https://github.com/freeall/progress-stream)
- [progress-stream - npm](https://www.npmjs.com/package/progress-stream)
- [node.js - streams with percentage complete - Stack Overflow](https://stackoverflow.com/questions/17798047/streams-with-percentage-complete)

## :white_check_mark: `try...catch...finally` problem

:white_check_mark: 2021年12月29日03:40:04，`try...catch`结构中，`finally`为什么会提前结束？事实上这个问题是我对js中的`try...catch...finally`
理解不够深刻，还拿着`python`中的同步思维去理解的。js里的这套结构体远比我想象地复杂，但是呢，为了避免这种复杂（在`try`或者`catch`中各种乱返回），一种好的办法就是只在`finally`
里返回（当然，这点我是知道的，只不过没有把它当做信仰）。

更新：我后续在那块代码中修改了写法，剔除了`try...catch...`，所以`finally`的问题也就不存在了。

启示：尽量不要在异步程序中使用`t...c...f`，否则可要小心了。

- [Finally in Promises & Try/Catch - DEV Community](https://dev.to/annarankin/finally-in-promises--trycatch-2c44)
- [javascript - Why does a return in `finally` override `try`? - Stack Overflow](https://stackoverflow.com/questions/3837994/why-does-a-return-in-finally-override-try)

## :white_check_mark: ipcRenderer duplicate response

2021年12月29日01:03:02，ipc通信中前端逐步累积渲染问题，猜测原因，可能是1. `ipcRenderer`中的端口使用`on`导致重复监听，并且最后的`removeAllListeners`方法没有生效；2.`react`
问题。貌似重新启动一下`electron`就好了……

<img alt="picture 83" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640720270634-hjxh_express_match-62f7db110abe26336dac47f3e63730fad39c52dc2808b2fc6e52df7f5968309c.png" width="480" />  

更新：实际上这个问题，是由`try...catch...finally`使用不当导致的，和`electron`、`react`都没关系，它们的部分都是正常的，`electron`的`listener`
监听部分失效，但是重新启动一下它也正常了。关于`t...c...f`问题见[:white_check_mark: `try...catch...finally` problem](#--x-trycatchfinally-problem)

## :white_check_mark: how to asynchronously and partially read csv

csv异步、小量快读读取.csv文件头部信息，以确定编码。已实现，基于`fast-csv`解决了中文乱码导致`node-csv`无法读取的问题，同时基于`iconv`实现了`gbk`与`utf-8`之间的无缝转换

## :white_check_mark: which to choose: `node-csv` or `fast-csv`

csv文件读取的选型与方法。经过鉴定，`node-csv`的接口比较低级，`fast-csv`更高些，并且更加稳健，输出方式（可以设置headers有或者无）比较友好，所以选择`fast-csv`。在读取上，有`fs.read`
，`fs.readFile`，`fs.createReadStream`等几种方式，经过比较，`fs.read`接口比较低级，速度快，适合用于编码测试；等测试完后使用`fs.createReadStream`
处理流数据比较好，方便与`iconv`、`fast-csv`等配合。

## :white_check_mark: axios `form-data` parse bug

本地前端上传文件`options`信息：

![-](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/ac1429ee.png)

远程前端上传文件`options`信息：

![-](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/6f1243c3.png)

这是在前端进行文件上传的断点调试

![-](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/dc88c60b.png)

基于这个，再进行服务端文件调试，比对文件信息的不同。但是现在的问题是服务端进入不了程序逻辑，直接被fastapi拒绝了。
