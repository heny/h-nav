// %s 分割
function searchData () {
  let self = null;

  return {
    list: searchList,
    content: '',
    currentSearchCateGory: '',
    currentSearchData: {},
    selectSearchListIndex: -1,
    // 是否显示下拉框
    showSelect: false,

    showSearchResult: true,
    searchResultList: [],

    flattenList (arr) {
      let result = [];

      for (const item of arr) {
        // 跳过标题包含 "隐藏" 的项
        if (item.title && item.title.includes("隐藏")) {
          continue; // 跳过当前项
        }

        if (item.url) {
          result.push(item); // 添加当前项
        }
        if (item.children && Array.isArray(item.children)) {
          // 递归调用平铺子项
          result = result.concat(this.flattenList(item.children));
        }
      }

      return result;
    },

    init () {
      self = this
      this.currentSearchCateGory = this.list[0].key
      this.currentSearchData = this.listItem[0]
      window.addEventListener('keydown', this.autoSearch)
    },

    destroy() {
      window.removeEventListener('keydown', this.autoSearch)
    },

    autoSearch (event) {
      if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
        // 阻止默认行为（避免在输入框中输入"/"）
        event.preventDefault();

        // 找到搜索输入框并聚焦
        self.$refs.searchInput.focus();
      }
    },

    get listItem () {
      return this.list.find(item => item.key === this.currentSearchCateGory).children
    },

    // 搜索本地书签
    onFilterLocalList () {
      if (!this.content) {
        this.searchResultList = []
        return
      }
      const result = this.flattenList(this.$store.pageStore.data)
      this.searchResultList = result.filter(item =>
        item.title.toLowerCase().includes(this.content.toLowerCase())
      ).slice(0, 20)
    },

    onSearchListItem (item) {
      this.currentSearchCateGory = item.key
      this.currentSearchData = this.listItem[0]
    },

    onSelectItem (item, event) {
      event.stopPropagation()

      this.currentSearchData = item
      this.content = ''
      this.searchResultList = []
      this.cancelSelectBox()
    },

    onSearchResultClick (item, event) {
      // 使用mousedown事件，而不是click事件，避免先失焦
      event.stopPropagation()

      if (this.currentSearchData.key === 'local') {
        window.open(item.url)
        this.content = '';
      }
    },

    cancelSelectBox () {
      this.showSelect = false
      document.removeEventListener('click', this.selectBoxEvent)
    },

    selectBoxEvent () {
      self.cancelSelectBox()
    },

    onFocus () {
      this.showSearchResult = true
      this.onFilterLocalList()

      window.addEventListener('keydown', this.searchKeydown)
    },

    searchKeydown (event) {
      console.log('hhh - event.key', event.key)
      if (event.key === 'ArrowDown') {
        ++self.selectSearchListIndex;
        self.selectSearchListIndex = Math.max(0, Math.min(self.selectSearchListIndex, self.searchResultList.length - 1));
        const currentItem = self.searchResultList[self.selectSearchListIndex]
        self.content = currentItem.url
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        --self.selectSearchListIndex;
        if (self.selectSearchListIndex <= 0) {
          self.selectSearchListIndex = 0
        }
        const currentItem = self.searchResultList[self.selectSearchListIndex]
        self.content = currentItem.url
      }

      if (event.key === 'Enter') {
        window.open(self.parseUrl())
        self.content = ''
      }
    },

    parseUrl () {
      const text = self.content
      if (text.includes('http')) {
        return text
      }

      if (!text.includes('.')) {
        return `https://www.baidu.com/s?ie=UTF-8&wd=${text}`
      }

      return `http://${text}`
    },

    onBlur () {
      this.showSearchResult = false
      this.searchResultList = []
      this.selectSearchListIndex = -1
      window.removeEventListener('keydown', this.searchKeydown)
    },

    onSearch () {
      if (!this.content) {
        this.searchResultList = []
        return
      }

      if (this.currentSearchData.key === 'local') {
        this.onFilterLocalList()
      } else {
        const skipUrl = this.currentSearchData.url.replace('%s', this.content)
        window.open(skipUrl)
        this.content = '';
      }
    },

    onChange () {
      // 实时搜索的key
      if (this.currentSearchData.key === 'local') {
        this.onSearch()
        return
      }

      axios.get(`https://suggestion.baidu.com/su?p=3&ie=UTF-8&cb=&wd=${this.content}`).then(res => {
        console.log('hhh - res', res)
      })
    },

    highlightMatch (title) {
      if (!this.content) return title; // 如果没有查询，返回原始标题
      const escapedQuery = this.content.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');
      const regex = new RegExp(escapedQuery, 'gi');
      return title.replace(regex, `<span style="color: #e74c3c;">$&</span>`);
    },

    showSelectBox (event) {
      // 避免点击就执行selectBoxEvent
      event.stopPropagation();

      if (this.showSelect) {
        this.cancelSelectBox()
      } else {
        this.showSelect = true
        document.addEventListener('click', this.selectBoxEvent)
      }
    }
  }
}