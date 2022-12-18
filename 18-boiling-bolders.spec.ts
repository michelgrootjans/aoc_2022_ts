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

function toCubes(coordinates: number[][]): Cube[] {
    return coordinates
        .map(cube => ({x: cube[0], y: cube[1], z: cube[2]}));
}

function surfaceOf(coordinates: number[][]): number {
    return toCubes(coordinates)
        .map((cube, index, cubes) => (
            6 - neigboursOf(cube, cubes).length
        ))
        .reduce((sum, sides) => sum + sides, 0);
}

function outsideSurface(coordinates: number[][]) {
    return surfaceOf(coordinates);
}

describe('total surface ', () => {
    test('no cubes', () => {
        expect(surfaceOf([])).toBe(0);
    });
    test('one cube', () => {
        expect(surfaceOf([[1, 1, 1]])).toBe(6);
    });
    test('two cubes', () => {
        expect(surfaceOf([[1, 1, 1], [10, 10, 10]])).toBe(6 * 2);
    });
    test('two touching cubes', () => {
        expect(surfaceOf([[1, 1, 1], [2, 1, 1]])).toBe(5 * 2);
    });
    test('example: part 1', () => {
        expect(surfaceOf(example)).toBe(64);
    });

    test('input: part 1', () => {
        expect(surfaceOf(input)).toBe(4348);
    });
});

describe('outside sruface', () => {
    test('no cubes', () => {
        expect(outsideSurface([])).toBe(0);
    });
    test('one cube', () => {
        expect(outsideSurface([[1, 1, 1]])).toBe(6);
    });
    test('two cubes', () => {
        expect(outsideSurface([[1, 1, 1], [10, 10, 10]])).toBe(6 * 2);
    });
    test('two touching cubes', () => {
        expect(outsideSurface([[1, 1, 1], [2, 1, 1]])).toBe(5 * 2);
    });
    xtest('example: part 2', () => {
        expect(outsideSurface(example)).toBe(58);
    });
});

