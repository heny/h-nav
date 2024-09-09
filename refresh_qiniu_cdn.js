const qiniu = require('qiniu');

async function refreshCdnCache() {
  const accessKey = process.env.QINIU_ACCESS_KEY;
  const secretKey = process.env.QINIU_SECRET_KEY;
  
  // 从环境变量读取 URLs
  const urlsString = process.env.QINIU_URLS || '';
  const urls = urlsString.split('\n').map(url => url.trim()).filter(url => url);

  if (urls.length === 0) {
    console.error('没有提供有效的 URLs');
    process.exit(1);
  }

  console.log('准备刷新的 URLs:', urls);

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const cdnManager = new qiniu.cdn.CdnManager(mac);

  try {
    const result = await new Promise((resolve, reject) => {
      cdnManager.refreshUrls(urls, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
        } else if (respInfo.statusCode !== 200) {
          reject(new Error(`状态码: ${respInfo.statusCode}, 响应: ${JSON.stringify(respBody)}`));
        } else {
          resolve(respBody);
        }
      });
    });

    console.log("CDN缓存刷新结果:", JSON.stringify(result, null, 2));
    
    if (result.code === 200) {
      console.log("CDN缓存已成功刷新");
    } else {
      console.error("CDN缓存刷新失败:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("CDN缓存刷新失败:", error);
    process.exit(1);
  }
}

refreshCdnCache();