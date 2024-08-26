function navData () {
  return {
    // 第一级的链接
    commonList: [],
    // 第一级的目录
    commonClassList: [],

    currentActiveItem: {},

    // 是否本地开发
    isLocalDev: false,

    // 目录层级
    level: 1,

    // 常用应用展开
    showExpand: true,

    // 当前处于展开位置的应用
    currentExpandIndex: null,

    async init () {
      self = this

      const localHosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
      ]
      this.isLocalDev = localHosts.includes(window.location.hostname)

      await this.getNavList()

      this.resizeAppChange()
      window.addEventListener('resize', this.resizeAppChange.bind(this))
    },

    resizeAppChange () {
      this.$nextTick(() => {
        const gridContainer = document.querySelector('.app-list.grid-small');
        const columns = getComputedStyle(gridContainer).gridTemplateColumns.split(' ').length;
        this.currentExpandIndex = columns - 1;
      })
    },

    onCommonItem(item, isExpand) {
      if(!isExpand) {
        window.open(item.url)
      } else {
        this.showExpand = false
      }
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

    getFaviconSync (url) {
      const host = new URL(url).host
      const faviconUrl = `https://api.iowen.cn/favicon/${host}.png`
      return faviconUrl
    },

    async getNavList () {
      this.$store.pageStore.loading = true

      if (!this.isLocalDev) {
        const res = await axios.get('https://json-service.hrhe.cn/read?filepath=bookmarks.json')

        if (res.status !== 200 || !res.data?.data) {
          this.commonList = []
          return
        }

        this.$store.pageStore.data = res.data.data
      } else {
        this.$store.pageStore.data = constantData
      }

      this.$store.pageStore.loading = false

      this.$store.pageStore.data = this.$store.pageStore.data[0]?.children?.filter(item => item.title === '书签栏')?.[0]?.children;

      // 常用的书签
      let commonList = []
      let classList = []
      for (let item of this.$store.pageStore.data) {
        item.children ? classList.push(item) : commonList.push(item)
      }
      this.commonList = commonList
      this.commonClassList = classList
      this.currentActiveItem = this.commonClassList[0]
      console.log('hhh - this.$store.pageStore.data', this.$store.pageStore.data, classList, this.currentActiveItem)
    },

    onDirectoryChange (item) {
      this.currentActiveItem = item
      ++this.level
    },

    onTabChange (item) {
      this.currentActiveItem = item
      this.level = 1
    },

    findItemById (data, id) {
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

    onBack () {
      --this.level
      const preItem = this.findItemById(this.commonClassList, this.currentActiveItem.parentId)
      this.currentActiveItem = preItem
    },
  }
}
