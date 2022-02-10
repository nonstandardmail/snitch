let pageScrollsDepthCache: Number[] = []

const listeners: Function[] = []

window.addEventListener('scroll', function() {
  const scrollPosition = window.scrollY
  const scrollDepth =
    scrollPosition /
    (Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) -
      window.innerHeight)
  const scrollDepthPercent = 10 * Math.round((100 * scrollDepth) / 10)
  if (!~pageScrollsDepthCache.indexOf(scrollDepthPercent)) {
    pageScrollsDepthCache.push(scrollDepthPercent)
    listeners.forEach(listener => listener(scrollDepthPercent))
  }
})

export default function listenForScrollChange(onScrollChange: Function) {
  if (!~listeners.indexOf(onScrollChange)) listeners.push(onScrollChange)
}

export const clearScrollDepthsCache = () => (pageScrollsDepthCache = [])
