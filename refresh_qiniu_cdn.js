const qiniu = require('qiniu');

async function refreshCdnCache() {
  const accessKey = process.env.QINIU_ACCESS_KEY;
  const secretKey = process.env.QINIU_SECRET_KEY;
  const domain = process.env.QINIU_DOMAIN;

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const cdnManager = new qiniu.cdn.CdnManager(mac);

  // 修改 URLs 格式
  const urls = [`http://${domain}/`, `https://${domain}/`];

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

    // 添加更详细的日志
    console.log("CDN缓存刷新结果:", JSON.stringify(result, null, 2));
    
    // 检查刷新是否成功
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