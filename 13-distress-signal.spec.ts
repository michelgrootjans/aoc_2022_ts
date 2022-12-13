import _ from 'lodash/fp'

type Value = number | Value[]
type Pair = {left: [Value], right: [Value], index: number}

function parse(description: string): Pair[] {
    return description.split('/n/n')
        .map(pair => _.flow()(pair.split('/n')).map(eval))
        .map((pair: any[], index: number): Pair => ({left: pair[0], right: pair[1], index}));
}

function isOrdered(p: Pair) {
    return _.isEqual(p.right, []);
}

function orderedIndexes(description: string) {
    return parse(description)
        .filter(pair => isOrdered(pair))
        .map(pair => pair.index);
}

function sumOfOrderedIndexes(description: string): number {
    return _.flow(
        orderedIndexes,
        _.sum,
    )(description);
}

test('[] vs []', function () {
    expect(orderedIndexes('[]/n[]')).toEqual([0]);
    expect(sumOfOrderedIndexes('[]/n[]')).toEqual(0);
});

test('[1] vs []', function () {
    expect(orderedIndexes('[1]/n[]')).toEqual([0]);
    expect(sumOfOrderedIndexes('[1]/n[]')).toEqual(0);
});

test('[] vs [1]', function () {
    expect(orderedIndexes('[]/n[1]')).toEqual([]);
});

const example = '' +
    '[1,1,3,1,1]\n' +
    '[1,1,5,1,1]\n' +
    '\n' +
    '[[1],[2,3,4]]\n' +
    '[[1],4]\n' +
    '\n' +
    '[9]\n' +
    '[[8,7,6]]\n' +
    '\n' +
    '[[4,4],4,4]\n' +
    '[[4,4],4,4,4]\n' +
    '\n' +
    '[7,7,7,7]\n' +
    '[7,7,7]\n' +
    '\n' +
    '[]\n' +
    '[3]\n' +
    '\n' +
    '[[[]]]\n' +
    '[[]]\n' +
    '\n' +
    '[1,[2,[3,[4,[5,6,7]]]],8,9]\n' +
    '[1,[2,[3,[4,[5,6,0]]]],8,9]'

xtest('example part 1', function () {
    expect(orderedIndexes(example)).toEqual([1,2,4,6]);
});


