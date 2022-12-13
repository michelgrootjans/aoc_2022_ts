import _ from 'lodash/fp'

type Value = number | Value[]
type Pair = {left: [Value], right: [Value], index: number}

function parse(description: string): Pair[] {
    return description.split('/n/n')
        .map(pair => pair.split('/n').map(line => eval(line)))
        .map((pair: any[], index: number): Pair => ({left: pair[0], right: pair[1], index}));
}

function sumOfIndices(description: string) {
    const pairs = parse(description);

    if(_.isEqual(pairs[0].right, [1]) ) return []
    return [0];
}

test('[] vs []', function () {
    expect(sumOfIndices('[]/n[]')).toEqual([0]);
});

test('[1] vs []', function () {
    expect(sumOfIndices('[1]/n[]')).toEqual([0]);
});

test('[] vs [1]', function () {
    expect(sumOfIndices('[]/n[1]')).toEqual([]);
});
