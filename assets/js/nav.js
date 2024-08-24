function navData () {
  let self = null;
  return {
    // 第一级的链接
    commonList: [],
    // 第一级的目录
    commonClassList: [],

    currentActiveItem: {},

    level: 1,
    
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
      let data = []

      if(!window.IS_LOCAL_DEV) {
        const res = await axios.get('https://json-service.hrhe.cn/read?filepath=bookmarks.json')
  
        if (res.status !== 200 || !res.data?.data) {
          this.commonList = []
          return
        }
  
        data = res.data?.data[0]?.children?.filter(item => item.title === '书签栏')?.[0]?.children;
      } else {
        data = constantData
      }

      // 常用的书签
      let commonList = []
      let classList = []
      for (let item of data) {
        item.children ? classList.push(item) : commonList.push(item)
      }
      this.commonList = commonList
      this.commonClassList = classList
      this.currentActiveItem = this.commonClassList[0]

      console.log('hhh - data', data, classList, this.currentActiveItem)
    },

    onDirectoryChange(item) {
      this.currentActiveItem = item
      ++this.level
    },

    onTabChange(item) {
      this.currentActiveItem = item
      this.level = 1
    },

    findItemById(data, id) {
      for (const item of data) {
        // 检查当前项
        if (item.id === id) {
          return item;
        }
        // 如果有 children，则递归查找
        if (item.children) {
          const found = this.findItemById(item.children, id);
          if (found) {
            return found;
          }
        }
      }
      return null; // 如果未找到
    },

    onBack() {
      --this.level
      const preItem = this.findItemById(this.commonClassList, this.currentActiveItem.parentId)
      this.currentActiveItem = preItem
    },
  }
}