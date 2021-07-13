import * as utm from '../src/utm'

describe('#stringifyCompact', () => {
  it('is stringifies utm parmas from url', () => {
    expect(utm.stringifyCompact('https://mysite.com/?utm_source=vk&utm_term=mysite')).toEqual(
      'vk,,,,mysite'
    )
    expect(utm.stringifyCompact('https://mysite.com/?utm_source=vk')).toEqual('vk')
  })
})

describe('#trimCommas', () => {
  it('is trims compact utm string commas out', () => {
    expect(utm.trimCommas('vk,,,,mysite')).toEqual('vk,,,,mysite')
    expect(utm.trimCommas('vk,promopost,,,')).toEqual('vk,promopost')
    expect(utm.trimCommas(',,,,mysite')).toEqual(',,,,mysite')
    expect(utm.trimCommas(',,,,')).toEqual('')
  })
})

describe('#urlHasParams', () => {
  it('tests if url has utm params in it', () => {
    expect(utm.urlHasParams('https://mysite.com/?utm_source=vk&utm_term=mysite')).toBeTruthy()
    expect(utm.urlHasParams('https://mysite.com/?utm_source=&utm_term=')).toBeFalsy()
  })
})
