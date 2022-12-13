import _ from 'lodash/fp'

class Value {
    public readonly v: number | Value[];

    constructor(value: number | Value[]) {
        this.v = value;
    }

    isSmallerThan(that: Value) {
        if (this.v instanceof Array && that.v instanceof Array) {
            for (let i = 0; i < this.v.length; i++) {
                if (this.isBigger(this.v[i], that.v[i])) return false;
            }
            // return this.v.length <= that.v.length;
        }
        return this.v <= that.v;
    }

    private isBigger<T>(left: T, right: T) {
        return left > right;
    }
}

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
        return this.left.isSmallerThan(this.right);
    }
}

function parse(description: string) {
    return description.split('/n/n')
        .map(pair => _.flow(
            _.split('/n'),
            _.map(eval),
        )(pair));
}

function toPair(description: string): Pair[] {
    return parse(description)
        .map((pair: any[], index: number): Pair => new Pair(new Value(pair[0]), new Value(pair[1]), index+1));
}

function orderedIndexes(description: string) {
    return toPair(description)
        .filter(pair => pair.isOrdered())
        .map(pair => pair.index);
}

function sumOfOrderedIndexes(description: string): number {
    return _.flow(
        orderedIndexes,
        _.sum,
    )(description);
}

describe('parse', () => {
    test.each([
        ['[1]/n[2]', [[[1], [2]],]],
        ['[1, 2]/n[2, 3]', [[[1, 2], [2, 3]],]],
        ['[1, [2]]/n[[2], 3]', [[[1, [2]], [[2], 3]],]],
        ['[1]/n[2]/n/n[3]/n[4]', [[[1], [2]], [[3], [4]]]],
        ['[1,1,3,1,1]/n[1,1,5,1,1]', [[[1,1,3,1,1],[1,1,5,1,1]]],]
    ])('%s => %o', (input: string, output: any[]) => {
        expect(parse(input)).toEqual(output)
    });
});

test('[1] vs [2]', () => {
    expect(orderedIndexes('[1]/n[2]')).toEqual([1]);
    expect(sumOfOrderedIndexes('[1]/n[2]')).toEqual(1);
});

test('[1] vs [1, 1]', () => {
    expect(orderedIndexes('[1]/n[1, 1]')).toEqual([1]);
    expect(sumOfOrderedIndexes('[1]/n[1, 1]')).toEqual(1);
});

test('[1, 1] vs [1]', () => {
    expect(orderedIndexes('[1, 1]/n[1]')).toEqual([]);
});

test('[2] vs [1]', () => {
    expect(orderedIndexes('[2]/n[1]')).toEqual([]);
});

const example = '' +
    '[1,1,3,1,1]\n[1,1,5,1,1]/n/n' + // 0: NOT ordered
    '[[1],[2,3,4]]\n[[1],4]\n\n' + // 1: ordered
    '[9]\n[[8,7,6]]\n\n' + // 2: ordered
    '[[4,4],4,4]\n[[4,4],4,4,4]\n\n' + // 3: NOT ordered
    '[7,7,7,7]\n[7,7,7]\n\n' + // 4: ordered
    '[]\n[3]\n\n' + // 5: NOT ordered
    '[[[]]]\n[[]]\n\n' + // 6: ordered
    '[1,[2,[3,[4,[5,6,7]]]],8,9]\n[1,[2,[3,[4,[5,6,0]]]],8,9]' // 7: NOT ordered

xtest('example part 1', function () {
    expect(parse(example)).toEqual([
            [[1,1,3,1,1],[1,1,5,1,1]],
            [[[1],[2,3,4]],[[1],4]],
            [[9],[[8,7,6]]],
            [[[4,4],4,4],[[4,4],4,4,4]],
            [[7,7,7,7],[7,7,7]],
            [[],[3]],
            [[[[]]],[[]]],
            [[1,[2,[3,[4,[5,6,7]]]],8,9],[1,[2,[3,[4,[5,6,0]]]],8,9]],
    ])

    // expect(orderedIndexes(example)).toEqual([1, 2, 4, 6]);
});


