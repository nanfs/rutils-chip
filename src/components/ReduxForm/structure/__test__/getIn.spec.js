import getIn from '../getIn'

describe('structure.getIn', () => {
  it('should return undefined if state is undefined', () => {
    expect(getIn(undefined, 'a')).toBe(undefined)
  })

  it('should return undefined if field is not match', () => {
    expect(getIn({ a: 1 }, 'b')).toBe(undefined)
  })

  it('should return expect value if field is match', () => {
    const state = {
      a: 1,
      b: {
        c: 2
      }
    }
    expect(getIn(state, 'a')).toBe(1)
    expect(getIn(state, 'b.c')).toBe(2)
  })

  it('a array in state', () => {
    const state1 = ['a']
    const state2 = { a: ['a'] }
    const state3 = {
      a: [
        {
          b: 'a'
        }
      ]
    }
    expect(getIn(state1, '[0]')).toBe('a')
    expect(getIn(state2, 'a[0]')).toBe('a')
    expect(getIn(state3, 'a[0].b')).toBe('a')
  })
})
