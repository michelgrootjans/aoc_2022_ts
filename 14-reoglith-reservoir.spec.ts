import _ from 'lodash'
import {input} from "./14-input";

type Air = '.'
type Rock = '#'
type Sand = 'o'
type Source = '+'
type Tile = Air | Rock | Sand | Source

class Coordinate {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    down(): Coordinate {
        return new Coordinate(this.x, this.y + 1);
    }

    downLeft(): Coordinate {
        return new Coordinate(this.x - 1, this.y + 1);
    }

    downRight() {
        return new Coordinate(this.x + 1, this.y + 1);
    }
}

class Grid {
    private source: Coordinate;
    private rocks: Coordinate[];
    private sand: Coordinate[];

    private topLeft: Coordinate;
    private bottomRight: Coordinate;
    private grid: Tile[][];
    private g: { coordinate: Coordinate, tile: Tile }[];

    constructor(source: Coordinate, rocks: Coordinate[], sand: Coordinate[] = []) {
        this.source = source;
        this.sand = sand;
        this.rocks = rocks;

        this.topLeft = new Coordinate(_.minBy(rocks, 'x')?.x || 0, source.y)
        this.bottomRight = new Coordinate(_.maxBy(rocks, 'x')?.x || 0, _.maxBy(rocks, 'y')?.y || 0)

        this.g = _.flatten(_.range(this.topLeft.y, this.bottomRight.y + 1)
            .map((y) => _.range(this.topLeft.x, this.bottomRight.x + 1)
                .map((x) => {
                    const coordinate = new Coordinate(x, y);
                    return {coordinate, tile: this.getPoint(coordinate)};
                })));


        this.grid = _.range(this.topLeft.y, this.bottomRight.y + 1).map(
            (y) => _.range(this.topLeft.x, this.bottomRight.x + 1)
                .map((x) => {
                    return this.getPoint(new Coordinate(x, y));
                }));
    }

    render(): string {
        return this.grid.map(line => line.join('')).join('\n')
    }

    tick(): Grid {
        const newSand = this.newSand(this.source);
        return new Grid(this.source, this.rocks, [...this.sand, newSand]);
    }


    isFree(coordinate: Coordinate) {
        return this.g.find(t => this.overlaps(t.coordinate, coordinate))?.tile === '.';
    }

    private newSand(from: Coordinate): Coordinate {
        if (this.isFree(from.down())) return this.newSand(from.down());
        if (this.isFree(from.downLeft())) return this.newSand(from.downLeft());
        if (this.isFree(from.downRight())) return this.newSand(from.downRight());
        return from;
    }

    private fallFrom(current: Coordinate): Coordinate {
        if (this.overlaps(current, this.source)) return current.down()
        if (this.rocks.some(rock => this.overlaps(current, rock))) return current;
        return current.down();
    }

    private getPoint(coordinate: Coordinate): Tile {
        if (this.overlaps(this.source, coordinate)) return '+'
        if (this.rocks.some(rock => this.overlaps(rock, coordinate))) return '#';
        if (this.sand.some(rock => this.overlaps(rock, coordinate))) return 'o';
        return '.';
    }

    private overlaps(left: Coordinate, right: Coordinate) {
        return left.x === right.x && left.y === right.y;
    }
}

const example: number[][][] = [
    [[498, 4], [498, 6], [496, 6]],
    [[503, 4], [502, 4], [502, 9], [494, 9]],
];

function order(lineRange: number[][], line: number): { from: number[], to: number[] } {
    const left = lineRange[line - 1];
    const right = lineRange[line];
    if (left[0] < right[0]) return {from: left, to: right};
    if (left[1] < right[1]) return {from: left, to: right};
    return {from: right, to: left};
}

function getRocks(paths: number[][][]): Coordinate[] {
    const rocks: Coordinate[] = []
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
        const lineRange = paths[pathIndex];
        for (let line = 1; line < lineRange.length; line++) {
            const {from, to} = order(lineRange, line);
            for (let x = from[0]; x <= to[0]; x++) {
                for (let y = from[1]; y <= to[1]; y++) {
                    rocks.push(new Coordinate(x, y));
                }
            }
        }
    }
    return rocks;
}

function unitsAtRest(paths: number[][][]) {
    const grid = new Grid(new Coordinate(500, 0), getRocks(paths));
    console.log(grid.tick().tick().tick().render());
    return 24;
}

test('example', function () {
    expect(unitsAtRest(example)).toBe(24)
});

xtest('input', function () {
    expect(unitsAtRest(input)).toBe(24)
});
