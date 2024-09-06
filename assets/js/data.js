// 搜索list数据
const searchList = [
  {
    name: '搜索',
    key: 'search',
    children: [
      {
        name: '本地',
        key: 'local',
        icon: 'icon-bendi'
      },
      {
        name: '百度',
        key: 'baidu',
        icon: 'icon-baidu',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=%s'
      },
      {
        name: '谷歌',
        key: 'google',
        icon: 'icon-google',
        url: 'https://www.google.com/search?q=%s'
      },
      {
        name: 'Bing',
        key: 'bing',
        icon: 'icon-Bing',
        url: 'https://www.bing.com/search?q=fdsa'
      },
      {
        name: '开发',
        key: 'kaifa',
        url: 'https://kaifa.baidu.com/searchPage?wd=%s'
      },
    ]
  },
  {
    name: '社交',
    key: 'social',
    children: [
      {
        name: '掘金',
        key: 'juejin',
        icon: 'icon-juejin',
        url: 'https://juejin.cn/search?query=%s&type=0'
      },
    ]
  },
  {
    name: '开发',
    key: 'dev',
    children: [
      {
        name: 'GitHub',
        key: 'github',
        icon: 'icon-github-fill',
        url: 'https://github.com/search?q=%s&ref=opensearch'
      },
      {
        name: 'npmjs',
        key: 'npmjs',
        icon: 'icon-npmjs-fill',
        url: 'https://www.npmjs.com/search?q=%s'
      },
      {
        name: '码云',
        key: 'gitee',
        icon: 'icon-gitee-fill-round',
        url: 'https://gitee.com/search?utf8=%E2%9C%93&type=&fork_filter=on&q=%s'
      },
      {
        name: 'CodePen',
        key: 'codepen',
        url: 'https://codepen.io/search/pens?q=%s'
      },
    ]
  },
  {
    name: 'AI搜索',
    key: 'ai',
    children: [
      {
        name: 'phind',
        key: 'phind',
        url: 'https://www.phind.com/search?q=%s'
      },
      {
        name: '云言',
        key: 'yunyan',
        url: 'https://so.nuu.su/search?q=%s'
      }
    ]
  }
]