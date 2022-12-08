import _ from 'lodash/fp'

const visibleTrees = _.flow(
        _.flatten,
        _.sum,
    )

it('should ', () => {
    expect(visibleTrees([[1]])).toBe(1)
});