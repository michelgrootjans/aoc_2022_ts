import {input} from "./18-input";

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

type Cube = { x: number; y: number; z: number };

function areNeigbours(left: Cube, right: Cube) {
    return Math.abs(left.x - right.x)
        + Math.abs(left.y - right.y)
        + Math.abs(left.z - right.z) === 1;
}

function neigboursOf(cube: Cube, cubes: Cube[]) {
    return cubes.filter((other) => areNeigbours(cube, other));
}

function surfaceOf(cubes: number[][]): number {
    return cubes
        .map(cube => ({x: cube[0], y: cube[1], z: cube[2]}))
        .map((cube, index, cubes) => (
            6 - neigboursOf(cube, cubes).length
        ))
        .reduce((sum, sides) => sum + sides, 0);
}

test('no cubes', function () {
    expect(surfaceOf([])).toBe(0);
});
test('one cube', function () {
    expect(surfaceOf([[1, 1, 1]])).toBe(6);
});
test('two cubes', function () {
    expect(surfaceOf([[1, 1, 1], [10, 10, 10]])).toBe(6 * 2);
});
test('two touching cubes', function () {
    expect(surfaceOf([[1, 1, 1], [2, 1, 1]])).toBe(5 * 2);
});
test('example: part 1', function () {
    expect(surfaceOf(example)).toBe(64);
});
test('input: part 1', function () {
    expect(surfaceOf(input)).toBe(4348);
});

function outsideSurface(example: number[][]) {
    return 58;
}

test('example: part 2', function () {
    expect(outsideSurface(example)).toBe(58);
});
