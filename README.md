# chrome 书签导航网
* 导航项目：[https://github.com/heny/h-nav](https://github.com/heny/h-nav)
* 同步书签扩展：[https://github.com/heny/chrome-bookmarks-util](https://github.com/heny/chrome-bookmarks-util)
* 书签上传接口：[https://github.com/heny/simple-upload-api](https://github.com/heny/simple-upload-api)

## 环境配置
项目 -> settings -> secrets -> actions -> 新建仓库变量
* QINIU_ACCESS_KEY：七牛云的access_key
* QINIU_SECRET_KEY：七牛云的secret_key
* QINIU_DOMAIN：域名（不带协议，只填写域名）
* QINIU_BUCKET：空间名字

## 部署到七牛云
提交代码时：`sh ./publish.sh 'feat: update'`

发布时会做的工作：
  1. 改变css、js、scss文件的文件名
  2. 更新index.html中引用的文件名
  3. 通过actions自动上传到七牛云
  4. 通过actions自动刷新cdn缓存