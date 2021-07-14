import createUniqueId from '../src/create-unique-id'
import './util/setup-crypto'

describe('#createUniqueId', () => {
  it('it creates unique id', () => {
    expect(typeof createUniqueId() === 'string').toBeTruthy()
    expect(createUniqueId() !== createUniqueId()).toBeTruthy()
  })
})
