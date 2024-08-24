const localHosts = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0'
]
window.IS_LOCAL_DEV = localHosts.includes(window.location.hostname)

if(IS_LOCAL_DEV) {
  const el = document.createElement('script')
  el.src = '/assets/js/data.js'
  document.body.appendChild(el)
}