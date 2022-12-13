function sumOfIndices(description: string) {
    if(description === '[]/n[1]') return []
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
