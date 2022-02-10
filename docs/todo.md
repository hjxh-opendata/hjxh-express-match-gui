
# dev todo

[toc]

## TODO: channel split of erp and trd, otherwise would go into a mess

## TODO: Redux

## TODO: 本地持久化

## TODO： 实现TRD与ERP的对比

## IMPROVE: update electron title based on version number

I checked a few of articles, and to find there is no unified answer.

~~Maybe, the best idea and can-be-controlled approach is to update title at the same time when updating the version number in package.json, and I am to do this.~~

Oh no, since the final title rendered in the frontend, is first initialized in BrowserWindow in main.js, and then be updated by the renderer template. However, the template is fixed, not directly from the package.json in release app dir.

So, I have no idea now to change the title of template based on the package.json, unless doing some sophisticated handles.

ref:

- [node.js - How can I use variables in package.json? - Stack Overflow](https://stackoverflow.com/questions/43705195/how-can-i-use-variables-in-package-json)

- [How do I change the name of the electron window? · Issue #2543 · electron/electron](https://github.com/electron/electron/issues/2543)

- [Is there a way to get the app Version from package.json? · Issue #6451 · electron/electron](https://github.com/electron/electron/issues/6451)
