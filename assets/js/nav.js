function navData () {
  return {
    commonList: [],
    classList: [],

    init () {
      this.getNavList();
    },

    async getFavicon (url) {
      /**
       * copyright: 2024.8.21
       * https://api.iowen.cn/doc/favicon.html
       * https://github.com/owen0o0/getFavicon
       */
      const host = new URL(url).host
      const faviconUrl = `https://api.iowen.cn/favicon/${host}.png`
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(faviconUrl)
        img.onerror = () => resolve('/assets/img/error.png')
        img.src = faviconUrl
      })
    },

    async getNavList () {
      const res = await axios.get('http://101.43.223.31:6600/read?filepath=bookmarks.json')

      if (res.status !== 200 || !res.data?.data) {
        this.commonList = []
        return
      }

      const data = res.data?.data[0]?.children?.filter(item => item.title === '书签栏')?.[0]?.children;

      // 常用的书签
      let commonList = []
      let classList = []
      for (let item of data) {
        item.children ? classList.push(item) : commonList.push(item)
      }
      this.commonList = commonList
      this.classList = classList

      console.log('hhh - data', data, classList)
    },

    get classListRender () {
      function generateDL(data, index) {
        let html = '<dl>';
        data.forEach((item) => {
          if (item.children) {
            // 为 dt 添加间隙
            html += `<dt style="margin-left: ${index * 20}px;">${item.title} 层级：${index}</dt>`;
            html += `<dd style="margin-left: ${index * 20}px;">${generateDL(item.children, index + 1)}</dd>`;
          } else {
            // 为 dd 添加间隙
            html += `<dd style="margin-left: ${index * 20}px;"><a href="${item.url}">${item.title}</a></dd>`;
          }
        });
        html += '</dl>';
        return html;
      }
    
      const resultHTML = generateDL(this.classList, 0);
      return resultHTML;
    }
  }
}