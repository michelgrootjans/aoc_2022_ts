import _ from 'lodash/fp'

type Value = number | Value[]
// type Pair = {left: [Value], right: [Value], index: number}
class Pair {
    public readonly left: Value;
    public readonly right: Value;
    public readonly index: number;

    constructor(left: Value, right: Value, index: number) {
        this.left = left;
        this.right = right;
        this.index = index;
    }

    isOrdered() {
        return this.isInOrder(this.left, this.right);
    }

    private isInOrder(left: Value, right: Value) {
        return _.isEqual(right, []);
    }
}

function parse(description: string): Pair[] {
    return description.split('/n/n')
    .map(pair => _.flow(
        _.split('/n'),
        _.map(eval),
        )(pair))
    .map((pair: any[], index: number): Pair => new Pair(pair[0], pair[1], index));
}

function orderedIndexes(description: string) {
    return parse(description)
        .filter(pair => pair.isOrdered())
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
    '[1,1,3,1,1]\n[1,1,5,1,1]\n\n' + // 0: NOT ordered
    '[[1],[2,3,4]]\n[[1],4]\n\n' + // 1: ordered
    '[9]\n[[8,7,6]]\n\n' + // 2: ordered
    '[[4,4],4,4]\n[[4,4],4,4,4]\n\n' + // 3: NOT ordered
    '[7,7,7,7]\n[7,7,7]\n\n' + // 4: ordered
    '[]\n[3]\n\n' + // 5: NOT ordered
    '[[[]]]\n[[]]\n\n' + // 6: ordered
    '[1,[2,[3,[4,[5,6,7]]]],8,9]\n[1,[2,[3,[4,[5,6,0]]]],8,9]' // 7: NOT ordered

xtest('example part 1', function () {
    expect(orderedIndexes(example)).toEqual([1,2,4,6]);
});


