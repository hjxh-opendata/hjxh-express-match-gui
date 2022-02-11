# dev notes

[toc]

## finished

### :white_check_mark:  channel split of erp and trd, otherwise would go into a mess

## experience

### IMPROVE: 关于首行检测算法+英文抬头导致第二类错误发生

所谓第二类错误就是取假错误，明明是错的，却认为是对的。

为提升系统系统，加入了首行检测算法，并为了程序的可读性，规定用户输入为英文抬头。

结果由于英文的通用性，既可以被`utf-8`识别，也可以被`gbk`识别，导致单单考首行检测目标字段（也就是抬头）是否存在无法区分编码信息。

导致可能是gbk编码的文件在utf-8的检测中被错误通过，错误认为是utf-8格式。

为此，有两种解决方案。

1. 将抬头部分或全部改成中文，这样抬头就包含了编码信息，可以准确地识别出utf-8或是gbk。目前采用的是这个办法，程序端改的代码量少，实现简单，客户端要把列名“id”改成“单号”。
2. 实现一段智能中文检测算法，但这个难度较大，性能也势必较低，因为它不是一个确定文字是不是中文的问题，而是确定一块buffer是不是中文，以及是不是特定中文编码的问题。

具体见下图：
<img alt="picture 4" src=".imgs/readme-1641626002506-042bc7088fbd215f528a00cb2f447a0f4186c8a82dfd81e18c844d0420f18529.png" />  

以及相关参考链接： [c# - How can I detect the encoding/codepage of a text file - Stack Overflow](https://stackoverflow.com/questions/90838/how-can-i-detect-the-encoding-codepage-of-a-text-file)

<img alt="picture 5" src=".imgs/readme-1641626065186-bbc4c6b27c353f81197b74545ea990ae714ebb751a6aa78cd2e9019df372d2c0.png" />  

文中提到，我可以猜，是的，我可以猜，那在我们目前这个实现上没有必要。

### 忍痛隔离 `parseFileWithoutHeader` 接口，2022年01月08日

<img alt="picture 3" src=".imgs/readme-1641584680631-28c6799f9c20398d8dd7f4a35759ab6a79b27f71135303c4de57af1295981dff.png" />  

### Do not use global electron

These days,

### I can only use Sqlite3 for one connection

Developers of `prisma` are devoted to work, and I learned a lot from their github issue.

And I am surprised to find that I can only use one connection limit in order not to cause timeout.

<img alt="picture 3" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/readme-1641077750638-95aae5aa45812bd1b433bc2d273b093369e4cd8b4209ebf48deeda8150bbc411.png" width="480" />  

ref:

- [Support setting a timeout for SQLite · Issue #2955 · prisma/prisma](https://github.com/prisma/prisma/issues/2955)

## Bugfix

### FIXME: build windows version on macOS

Can't use the following config (`"arch": "universal"`) since there's no `universal` version of `sqlite3`.

```json
        "win": {
            "target": {
                "target": "portable",
                "arch": "universal"
            }
        },
```

![picture 14](../.imgs/finished-1644552546365-b2b0c995d0773a6cda674a3b211d95f730053340c6c5a65a144bef11abb45dfa.png)  

If we change the url in the above from `https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v5.0.2/napi-v3-win32-universal.tar.gz` to `https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v5.0.2/napi-v3-win32-x64.tar.gz`.

Then the url is available (not 403).

### :white_check_mark: FIXED: download binary electron using proper mirror

```sh
ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/
```

When pack using `npm run app:dist` (i.e. `electron-builder`), it shows mirror is unavailable:

![picture 5](.imgs/readme-1644510840176-6a466b314d3749a26e07fc77d98b714d2fd1a2da0c1e8e824c4424c40f25014f.png)  

And then I checked the shown url and after I copied the link address, it indicates `https://registry.npmmirror.com/-/binary/electron/v17.0.0/electron-v17.0.0-darwin-x64.zip` rather than `https://npm.taobao.org/mirrors/electron/17.0.0/electron-v17.0.0-darwin-x64.zip`, also not the file under the html at: `https://registry.npmmirror.com/binary.html?path=electron/v17.0.0/` 

So, maybe we should change our mirror url to be something like `https://registry.npmmirror.com`

![picture 4](.imgs/readme-1644510821821-d671d0ed844872f89ca25d7d7aae243875ea22380735aa1b1b959826fca9e3ab.png)  

However, it still shows error:

![picture 6](.imgs/readme-1644511116181-6bfd294f166773d276bf0387479b89ba4c6f15d4a26b4b2029fca57e14e38746.png)  

Then I understood it's because the `npmrc` config:

![picture 7](.imgs/readme-1644511163808-99a1188f2d8f9067465ffd5158fa18db05f4f775ea315db2b866c6d8e3aa518e.png)  

![picture 8](.imgs/readme-1644511236301-481a6557b24c86ed7880f7db53f3a0d35cb39c41d384c790e2be38c371060ab4.png)  

So I just uncommented it.

But it still won't help!

---

Finally, I followed the electron official documentation and successfully downloaded!

![picture 10](.imgs/readme-1644512331667-68dbdaeca0877ed08fd232da5dbb532a043c513dbf06067a184aadbe434e525c.png)  

![picture 9](.imgs/readme-1644512305906-766f963e835bb0c9b37ff2c3b19559f3ba19cabbc482697341a873e054b939bb.png)  

And the lesson I learned is not to believe third-party components (especially by Chinese):

![picture 11](.imgs/readme-1644512409109-6b4448de29d9de12cd9045a6f0e93da5bba094ffb06b8e1da8dc493e4d583934.png)  


### :white_check_mark: uploading trd would also have erp

It's version problem, and now it has gone along with the version update.

### :white_check_mark: when parsing file, the focus won't be broke even switching tabs

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

### :white_check_mark: 实现TRD的数据读取与存储

### [PASS] add log module. updated 2022-01-10.

### :white_check_mark： 实现`better-sqlite3`的表定义与封装

<img alt="picture 1" src=".imgs/readme-1641513479890-b40f4b84e7c4b68820621bef53990ba4720f7145ad1a827765774c385ce963a9.png" />  

### :white_check_mark: db init with `generate table in source code` or via `.env`.

2022-01-04，it's very successful and valuable to finally solve this problem!

### :white_check_mark: change `asar: false`. 2022-01-03 tried this option, but does no help to out project, except let me more clear about what there are in the archive.

### :white_check_mark: add electron menu. 2022-01-02

### :white_circle: replace the progress stream, since it doesn't synchronize with the database, and not accurate for percentage measure。2022-01-02 19:49:20。

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

### :white_check_mark: add the global settings json file, so that the frontend and the backend can mutually use it。2022-01-02 17:04:24

### :white_check_mark: 省份匹配。2022-01-02，用之前的程序改成js版即可

### :white_check_mark: 测试ERP的数据读取与存储。1-1: finished

### :white_check_mark: 优化文件读取过程中的前端界面展示。12-31: finished

### :white_check_mark: TS2339: Property 'erp' does not exist on type 'PrismaClient '. 12-28: The solution is to use `npx prisma generate`

### :white_check_mark: 解析数据有误问题

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

### :white_check_mark: `sqlite3、typeorm` native dependency

2021-12-30 update：there is no need to think about `typeorm` any longer since I have decided to use `prisma` which works
well.

安装`sqlite3, typeorm`之后没法运行`electron`了
<img alt="picture 87" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640739763499-hjxh_express_match-9a466a1ba9c7e3921873956cbed26e0aec705605d42efc653a7d45e76ae73aab.png" width="480" />

ref:

- [What is exactly native dependency? · Issue #1042 · electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1042)

### :white_check_mark: 学习`prisma`的连接与插入业务流设计范式。

方案：`prisma`
会在第一次query时自动连接数据库，拥有一个数据库连接池，所以无需我自己管理。ref: [Connecting and disconnecting (Concepts) | Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management)

### :white_check_mark: csv只读取第一行

方案：在`fast-csv`的第一个回调里处理就可以，这里就是第一行；如果不是行的话，可以用`fs`的`start | end`参数控制。

### :white_check_mark: 寻求`fast-csv` skip error的方案。

结果：官方回复：[Skip row at on('error') event ](https://github.com/C2FO/fast-csv/issues/179#:~:text=No%2C%20if%20an%20error%20is%20encountered%20it%20is%20usually%20because%20the%20parser%20is%20unsure%20how%20to%20proceed%20with%20the%20file%2C%20and%20can%20lead%20to%20very%20unpredictable%20results.)

<img alt="picture 2" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640844862434-readme-d430a803f9cf6cba63b866ddfde9bf1a40e94425b20f27b0be462ee986a75e7f.png" width="480" />  

### :white_check_mark: 支持上传的文件的 Sample 备份预览（包含head与tail五行）。

这是之前的方案，目前已经不采用，目前不存在0/1的问题，即不是按文件为基本单位传输给用户，而是在读取过程中持续地按行为基本单位（可选：筛选出有问题的部分）传输给用户，因此备份预览没有意义也不需要了。

### :white_check_mark: 完成数据库、前端、后端的基本设计。2021年12月22日

### :white_check_mark: no-headers pass but headers not

The reason is that I wrote condition of `_id === null` with always return `true` since the default 'error result'
is `""`, an empty string not `null`.

So, I remedied it by changing the condition to `!_id` which can detect not only `null` but also 'empty'. And then I
fixed this bug.

<img alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640844532391-readme-097119c7c9ee1495027a008fa92a7e3a24200f32e1b76f5b6aa00ed875defc30.png" width="480" />  

### :white_check_mark: `progress-stream` cause bug

2021年12月29日04:47:04，在引入`progress-stream`包后导致了`csv`解析的错误，后来测试发现，只要把`progress-stream`放在`fast-csv`
之前就行了。想来也是，毕竟`progress-stream`是处理`stream`的，而`csv`那一步已经变成`row`了，具体细节我也不明白也不是很重要，这里会用就行了。
<img alt="picture 84" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640724530991-hjxh_express_match-c68e2f5550740af90b70137dcd9b0cc1946817232135f21bc5bd39e311b27b2d.png" width="480" />

- [freeall/progress-stream: Read the progress of a stream](https://github.com/freeall/progress-stream)
- [progress-stream - npm](https://www.npmjs.com/package/progress-stream)
- [node.js - streams with percentage complete - Stack Overflow](https://stackoverflow.com/questions/17798047/streams-with-percentage-complete)

### :white_check_mark: `try...catch...finally` problem

:white_check_mark: 2021年12月29日03:40:04，`try...catch`结构中，`finally`为什么会提前结束？事实上这个问题是我对js中的`try...catch...finally`
理解不够深刻，还拿着`python`中的同步思维去理解的。js里的这套结构体远比我想象地复杂，但是呢，为了避免这种复杂（在`try`或者`catch`中各种乱返回），一种好的办法就是只在`finally`
里返回（当然，这点我是知道的，只不过没有把它当做信仰）。

更新：我后续在那块代码中修改了写法，剔除了`try...catch...`，所以`finally`的问题也就不存在了。

启示：尽量不要在异步程序中使用`t...c...f`，否则可要小心了。

- [Finally in Promises & Try/Catch - DEV Community](https://dev.to/annarankin/finally-in-promises--trycatch-2c44)
- [javascript - Why does a return in `finally` override `try`? - Stack Overflow](https://stackoverflow.com/questions/3837994/why-does-a-return-in-finally-override-try)

### :white_check_mark: ipcRenderer duplicate response

2021年12月29日01:03:02，ipc通信中前端逐步累积渲染问题，猜测原因，可能是1. `ipcRenderer`中的端口使用`on`导致重复监听，并且最后的`removeAllListeners`方法没有生效；2.`react`
问题。貌似重新启动一下`electron`就好了……

<img alt="picture 83" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1640720270634-hjxh_express_match-62f7db110abe26336dac47f3e63730fad39c52dc2808b2fc6e52df7f5968309c.png" width="480" />  

更新：实际上这个问题，是由`try...catch...finally`使用不当导致的，和`electron`、`react`都没关系，它们的部分都是正常的，`electron`的`listener`
监听部分失效，但是重新启动一下它也正常了。关于`t...c...f`问题见[:white_check_mark: `try...catch...finally` problem](#--x-trycatchfinally-problem)

### :white_check_mark: how to asynchronously and partially read csv

csv异步、小量快读读取.csv文件头部信息，以确定编码。已实现，基于`fast-csv`解决了中文乱码导致`node-csv`无法读取的问题，同时基于`iconv`实现了`gbk`与`utf-8`之间的无缝转换

### :white_check_mark: which to choose: `node-csv` or `fast-csv`

csv文件读取的选型与方法。经过鉴定，`node-csv`的接口比较低级，`fast-csv`更高些，并且更加稳健，输出方式（可以设置headers有或者无）比较友好，所以选择`fast-csv`。在读取上，有`fs.read`
，`fs.readFile`，`fs.createReadStream`等几种方式，经过比较，`fs.read`接口比较低级，速度快，适合用于编码测试；等测试完后使用`fs.createReadStream`
处理流数据比较好，方便与`iconv`、`fast-csv`等配合。

### :white_check_mark: axios `form-data` parse bug

本地前端上传文件`options`信息：

![-](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/ac1429ee.png)

远程前端上传文件`options`信息：

![-](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/6f1243c3.png)

这是在前端进行文件上传的断点调试

![-](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/dc88c60b.png)

基于这个，再进行服务端文件调试，比对文件信息的不同。但是现在的问题是服务端进入不了程序逻辑，直接被fastapi拒绝了。

## Philosophy

### Eslint is good

If you want to improve your coding ability, especially the coding quality, the most recommend way is to read `eslint`.

ref:

- [no-plusplus - Rules - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/rules/no-plusplus)

### Modularization helps me done right

After hours of module composition, I'm happy to find my design error.

Modularization yyds!
<img alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/readme-1641052998954-2fc1cb2343ca3e9e40f19538182c72d0f43e2e7476e521683caf46d59050aa62.png" width="480" />

### Interface helps me done right

<img alt="picture 7" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-d7a46ab674b86b2c28e65dc92b42cf1e98582d198eaeec97bce367a445f65b01.png" width="480" />  

### Interface 和 Object 之间的关系

如图，在我花了漫长的时间终于设计出一个目前接口比较良好的`handleParseFile`的函数之后，为了暴露给前端，我需要写一个接口。

<img alt="picture 4" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-08c70036013b62c68d84bf1538263862871efec0814c921e3517ed365e3aa06e.png" width="480" />  

这个时候，问题来了，我当然可以直接用`ReturnType`自动追踪这个函数的参数与返回类型……

OH NO！

写着写着我发现我想错了，我虽然可以从函数自动得到它的返回类型，但我貌似是没法得到这个函数的参数类型的吧（待确定）！

你看，写笔记还是有帮助的，不写还不知道自己的认知其实是错的呢！

这就先去查一查，是否可以将接口自动同步于某个函数，或者说，是否可以从函数生成接口。

<img alt="picture 5" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-92782ca14860a1fdd296780dacb182dc39b77a46003287b9840ab4418c7fa926.png" width="480" />  


确实不行！都没有相关问题！

老老实实写接口吧！（原以为是先有鸡再有蛋的问题呢！结果ts直接把“蛋生鸡”路给封了！）

<img alt="picture 6" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-33d3c4df2305f5bec0d0e224f3c0d3b4bf975c4dcf8e97b12acbc91231dc2d89.png" width="480" />  

### Error类的继承设计

很有意思的一点，就是在整合优化代码时，发现整合到了Error类的冗余定义。

再仔细想想`eslint`对每个文件只能有一个`class`导出的约定，还挺有意思的，把类拆开，代码变得更加好组织了。

<img alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-7c97f8ad346bedd96babc43432586abaf2e8021cc544ee9104bd4acc60f758ad.png" width="480" />  

所以接下来就是把所有用这个类的代码都消掉了。

<img alt="picture 2" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-3509c6d0e8faed8ed48bba788d98982be9a409fcf0a82a50018d991dd96e0a33.png" width="480" />  

OK，很快就消除完了，毕竟我后续定义的`MyError`类是这个`TestCsv...`类的超集。

<img alt="picture 3" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/%24readme-%7Btimestamp%7D-336828a9db961bc373c845d3c389506aecfd61e11ef6532912755f04657f595c.png" width="480" />  
