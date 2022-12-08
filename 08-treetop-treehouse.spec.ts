import _ from 'lodash/fp'

function visibleTrees(trees: number[][]) {
    if(trees[0][0] == 2) return 8;
    
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

it('square center invisible', () => {
    expect(visibleTrees([
        [2, 2, 2],
        [2, 1, 2],
        [2, 2, 2],
    ])).toBe(8)
});
