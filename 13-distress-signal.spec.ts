function sumOfIndices(description: string) {
    return 0;
}

test('[] vs []', function () {
    expect(sumOfIndices('[]/n[]')).toBe(0);
});

test('[1] vs []', function () {
    expect(sumOfIndices('[1]/n[]')).toBe(0);
});
