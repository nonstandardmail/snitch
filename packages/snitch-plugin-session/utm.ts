const commaTrimmerRegExp = /,+$/

export function trimCommas(compactUTMString: string) {
  return compactUTMString.replace(commaTrimmerRegExp, '')
}

/**
 * Parses not only search string for params but also a hash string
 * */
export function stringifyCompact(href: string): string {
  const url = new URL(href)

  const urlWithSearchParamsReplacedByHashParams = new URL(
    href.replace(url.search, '').replace('#', '?')
  )

  const getParam = (paramName: string): string =>
    url.searchParams.get(paramName) ||
    urlWithSearchParamsReplacedByHashParams.searchParams.get(paramName) ||
    ''

  return trimCommas(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(getParam).join(',')
  )
}

export function urlHasParams(href: string): boolean {
  return /utm_(source|medium|campaign|content|term)=[^&#]+/.test(href)
}
