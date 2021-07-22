const commaTrimmerRegExp = /,+$/

export function trimCommas(compactUTMString: string) {
  return compactUTMString.replace(commaTrimmerRegExp, '')
}

export function stringifyCompact(href: string): string {
  const url = new URL(href)
  const getParam = (paramName: string): string => url.searchParams.get(paramName) || ''
  return trimCommas(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(getParam).join(',')
  )
}

export function urlHasParams(href: string): boolean {
  return /utm_(source|medium|campaign|content|term)=[^&#]+/.test(href)
}
