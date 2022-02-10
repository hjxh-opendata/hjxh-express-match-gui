# dev notes

[toc]

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
