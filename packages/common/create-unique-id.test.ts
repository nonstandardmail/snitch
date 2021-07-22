import '../common/testutil/setup-crypto'
import createUniqueId from './create-unique-id'

describe('#createUniqueId', () => {
  it('it creates unique id', () => {
    expect(typeof createUniqueId() === 'string').toBeTruthy()
    expect(createUniqueId() !== createUniqueId()).toBeTruthy()
  })
})
