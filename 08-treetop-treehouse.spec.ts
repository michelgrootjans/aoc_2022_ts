import _ from 'lodash/fp'

function visibleTrees(trees: number[][]) {
    return _.flow(
        _.flatten,
        _.sum,
    )(trees)
}

it('1 tree', () => {
    expect(visibleTrees([[1]])).toBe(1)
});

it('square with all visible trees', () => {
    expect(visibleTrees([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ])).toBe(9)
});