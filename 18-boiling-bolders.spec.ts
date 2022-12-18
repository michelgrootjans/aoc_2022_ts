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

type Coordinate = { x: number; y: number; z: number };
type Direction = 'N' | 'S' | 'E' | 'W' | 'U' | 'D';
type Type = 'Outside' | 'Inside' | 'Touching' | 'Unknown';
type Side = { direction: Direction, type: Type}

class Cube {
    public readonly sides: Side[]
    public readonly coordinate: Coordinate

    constructor(coordinate: Coordinate, sides: Side[]) {
        this.coordinate = coordinate;
        this.sides = sides;
    }

    freeSides(): number {
        return this.sides.filter(s => s.type !== 'Touching').length;
    }

    outSides() {
        return this.sides.filter(s => s.type === 'Outside').length;
    }
}

function areNeigbours(left: Cube, right: Cube): boolean {
    return Math.abs(left.coordinate.x - right.coordinate.x)
        + Math.abs(left.coordinate.y - right.coordinate.y)
        + Math.abs(left.coordinate.z - right.coordinate.z) === 1;
}

function canSeeOutside(cube: Coordinate, cubes: Coordinate[]) {
    const canSeeNorth = () => !cubes.some(other => cube.x < other.x && cube.y === other.y && cube.z === other.z);
    const canSeeSouth = () => !cubes.some(other => cube.x > other.x && cube.y === other.y && cube.z === other.z);
    const canSeeEast  = () => !cubes.some(other => cube.x === other.x && cube.y < other.y && cube.z === other.z);
    const canSeeWest  = () => !cubes.some(other => cube.x === other.x && cube.y > other.y && cube.z === other.z);
    const canSeeUp    = () => !cubes.some(other => cube.x === other.x && cube.y === other.y && cube.z < other.z);
    const canSeeDown  = () => !cubes.some(other => cube.x === other.x && cube.y === other.y && cube.z > other.z);

    return canSeeNorth() || canSeeSouth()
        || canSeeEast() || canSeeWest()
        || canSeeUp() || canSeeDown()
}

function neigboursOf(cube: Cube, cubes: Cube[]) {
    return cubes.filter((other) => areNeigbours(cube, other));
}

function toCoordinates(coordinates: number[][]): Coordinate[] {
    return coordinates
        .map(coordinate => ({x: coordinate[0], y: coordinate[1], z: coordinate[2]}));
}

function getType(coordinate: Coordinate, coordinates: Coordinate[]): Type {
    if(coordinates.some(other => coordinate.x === other.x && coordinate.y === other.y && coordinate.z === other.z))
        return 'Touching'
    return 'Outside';
}

function toCube(coordinate: Coordinate, coordinates: Coordinate[]): Cube {
    const sides: Side[] = [
        {direction: 'N', type: getType({...coordinate, y: coordinate.y + 1}, coordinates)},
        {direction: 'S', type: getType({...coordinate, y: coordinate.y - 1}, coordinates)},
        {direction: 'E', type: getType({...coordinate, x: coordinate.x + 1}, coordinates)},
        {direction: 'W', type: getType({...coordinate, x: coordinate.x - 1}, coordinates)},
        {direction: 'U', type: getType({...coordinate, z: coordinate.z + 1}, coordinates)},
        {direction: 'D', type: getType({...coordinate, z: coordinate.z - 1}, coordinates)},
    ];
    return new Cube(coordinate, sides);
}

function surfaceOf(coordinates: number[][]): number {
    return toCoordinates(coordinates)
        .map((coordinate, index, coordinates) => toCube(coordinate, coordinates))
        .map((cube) => cube.freeSides())
        .reduce((sum, sides) => sum + sides, 0);
}

function outsideSurface(coordinates: number[][]) {
    return toCoordinates(coordinates)
        .map((coordinate, index, coordinates) => toCube(coordinate, coordinates))
        .map((cube) => cube.outSides())
        .reduce((sum, sides) => sum + sides, 0);
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

