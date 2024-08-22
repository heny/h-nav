function navData () {
  let self = null;
  return {
    commonList: [],
    classList: [],

    init () {
      self = this
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

    getFaviconSync(url) {
      const host = new URL(url).host
      const faviconUrl = `https://api.iowen.cn/favicon/${host}.png`
      return faviconUrl
    },

    async getNavList () {
      const res = await axios.get('https://json-service.hrhe.cn/read?filepath=bookmarks.json')

      if (res.status !== 200 || !res.data?.data) {
        this.commonList = []
        return
      }

      const data = res.data?.data[0]?.children?.filter(item => item.title === '书签栏')?.[0]?.children;

      // const data = constantData

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
        let html = '<dl class="other-book">';

        let linkHtml = '<div class="link-group">'
        data.forEach((item) => {
          if (item.children) {
            html += `<dt style="margin-left: ${index * 20}px; margin-bottom: 10px;">${item.title} 层级：${index}</dt>`;
            html += `<dd style="margin-left: ${index * 20}px;">${generateDL(item.children, index + 1)}</dd>`;
          } else {
            linkHtml += `
              <dd style="margin-left: ${index * 20}px;">
                <a class="other-link-item" role="button" target="_blank" href="$${item.url}">
                  <img src="${self.getFaviconSync(item.url)}" alt="${item.title}" style="width: 20px; height: 20px; vertical-align: middle;">
                  <div class="other-link-item-title">${item.title}</div>
                </a>
              </dd>
            `;
          }
        });
        linkHtml += '</div>'
        html += linkHtml;

        html += '</dl>';
        return html;
      }

      const copyClassList = JSON.parse(JSON.stringify(this.classList))
    
      const resultHTML = generateDL(copyClassList, 0);
      console.log('hhh - copyClassList', copyClassList)
      return resultHTML;
    }
  }
}