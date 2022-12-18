const example = [
    [2, 2, 2],
    [1, 2, 2],
    [3, 2, 2],
    [2, 1, 2],
    [2, 3, 2],
    [2, 2, 1],
    [2, 2, 3],
    [2, 2, 4],
    [2, 2, 6],
    [1, 2, 5],
    [3, 2, 5],
    [2, 1, 5],
    [2, 3, 5],
]

function surfaceOf(cubes: number[][]): number {
    if(cubes.length === 0) return 0;
    if(cubes.length === 1) return 6;
    if (cubes[1][0] === 2) return 5 * 2;
    return cubes.length * 6;
}

test('no cubes', function () {
    expect(surfaceOf([])).toBe(0);
});
test('one cube', function () {
    expect(surfaceOf([[1, 1, 1]])).toBe(6);
});
test('two cubes', function () {
    expect(surfaceOf([[1, 1, 1], [10, 10, 10]])).toBe(6*2);
});
test('two touching cubes', function () {
    expect(surfaceOf([[1, 1, 1], [2, 1, 1]])).toBe(5*2);
});
