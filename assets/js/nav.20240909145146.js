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

    // 添加一个缓存对象
    faviconCache: new Map(),

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

    onCommonItem (item, isExpand) {
      if (!isExpand) {
        this.onOpenUrl(item)
      } else {
        this.showExpand = false
      }
    },

    // 检查url是否有效
    checkUrlisValid (url) {
      if (!url) {
        return false
      }

      if(url.startsWith('http')) {
        try {
          const parsedUrl = new URL(url)
          // 检查主机名是否为IP地址
          const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
          if (ipRegex.test(parsedUrl.hostname)) {
            return false
          }
          return true
        } catch (error) {
          return false
        }
      }

      return false
    },

    async getFavicon (url, className) {
      // 检查缓存中是否已存在
      if (this.faviconCache.has(url)) {
        return this.faviconCache.get(url);
      }

      if (!this.checkUrlisValid(url)) {
        return '/assets/img/img-error.png'
      }

      return new Promise((resolve) => {
        const checkAndLoadFavicon = () => {
          const element = document.querySelector(`.${className}`);
          if (!element) {
            setTimeout(checkAndLoadFavicon, 100);
            return;
          }

          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              observer.disconnect();
              this.loadFaviconImage(url).then(resolve);
            }
          }, { rootMargin: '50px' });

          observer.observe(element);
        };

        checkAndLoadFavicon();
      });
    },

    // 加载图片
    loadFaviconImage(url) {
      return new Promise((resolve) => {
        const host = new URL(url).host;
        const faviconUrl = `https://api.iowen.cn/favicon/${host}.png`;
        const img = new Image();
        img.onload = () => {
          this.faviconCache.set(url, faviconUrl); // 使用完整URL作为键
          resolve(faviconUrl);
        };
        img.onerror = () => {
          this.faviconCache.set(url, '/assets/img/img-error.png'); // 使用完整URL作为键
          resolve('/assets/img/img-error.png');
        };
        img.src = faviconUrl;
      });
    },

    async getNavList () {
      this.$store.pageStore.loading = true

      // if (!this.isLocalDev) {
        try {
          const res = await axios.get('https://json-service.hrhe.cn/read?filepath=bookmarks.json', { timeout: 15000 })

          if (res.status !== 200 || !res.data?.data) {
            this.commonList = []
            return
          }

          this.$store.pageStore.data = res.data.data
        } catch (error) {
          this.$store.pageStore.loading = false
          const result = confirm('加载超时，是否重新加载？')
          if(result) location.reload()
          return
        }
      // } else {
      //   this.$store.pageStore.data = constantData
      // }

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
      console.log('hhh - this.commonClassList', this.commonClassList)
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

    onOpenUrl (item) {
      if (item.url.startsWith('http')) {
        window.open(item.url)
      } else if (item.url.startsWith('javascript:')) {
        // 对于javascript: URL，显示一个警告
        alert('警告：此链接包含JavaScript代码。出于安全考虑，我们不能自动执行它。请查看控制台复制执行')
        // 可选：显示代码内容供用户查看
        console.log('JavaScript代码:', item.url.slice(11))
      } else {
        // 处理其他类型的URL
        console.log('不支持的URL类型:', item.url)
      }
    }
  }
}
