import _ from 'lodash'
import {input} from "./14-input";

type Air = '.'
type Rock = '#'
type Sand = 'o'
type Source = '+'
type Void = ' '
type Unit = Air | Rock | Sand | Source | Void

class Tile {
    public readonly coordinate: Coordinate;
    private _unit: Unit;

    constructor(coordinate: Coordinate, unit: Unit) {
        this.coordinate = coordinate;
        this._unit = unit;
    }

    get unit(): Unit {
        return this._unit;
    }

    set unit(value: Unit) {
        this._unit = value;
    }
}

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

    downRight(): Coordinate {
        return new Coordinate(this.x + 1, this.y + 1);
    }

    overlapsWith(that: Coordinate): boolean {
        return this.x === that.x && this.y === that.y;
    }
}

class Grid {
    protected grid: Tile[];

    constructor(grid: Tile[]) {
        this.grid = grid;
    }

    tick(): Grid {
        const grain = this.fallFrom(this.source().coordinate);
        if (this.grid.some(t => this.overlaps(t.coordinate, grain))) {
            this.tileAt(grain).unit = 'o';
        };
        return this;
    }


    set(coordinate: Coordinate, unit: Unit) {
        this.tileAt(coordinate).unit = unit
    }

    endState(): Grid {
        let counter = 0;
        const source = this.source().coordinate;
        let grain = this.fallFrom(source);
        while (this.isInGrid(grain)) {
            if(counter++ > 1000) throw 'too many loops'
            this.tileAt(grain).unit = 'o';
            grain = this.fallFrom(source);
        }
        return this;
    }

    protected fallFrom(from: Coordinate): Coordinate {
        if(!this.isInGrid(from)) return from;
        if (this.isFree(from.down())) return this.fallFrom(from.down());
        if (this.isFree(from.downLeft())) return this.fallFrom(from.downLeft());
        if (this.isFree(from.downRight())) return this.fallFrom(from.downRight());
        return from;
    }

    protected isFree(coordinate: Coordinate): boolean {
        const tile = this.tileAt(coordinate);
        if(['+', '#', 'o'].includes(tile.unit)) return false;
        if(['.'].includes(tile.unit)) return true;
        return tile.unit === ' ';
    }

    protected tileAt(coordinate: Coordinate): Tile {
        return this.grid.find(t => this.overlaps(t.coordinate, coordinate)) || new Tile(coordinate, ' ');
    }

    protected overlaps(left: Coordinate, right: Coordinate) {
        return left.x === right.x && left.y === right.y;
    }

    protected source(): Tile {
        const source = this.grid.find(t => t.unit === '+');
        if(!source) throw 'no source found';
        return source
    }

    protected isInGrid(grain: Coordinate) {
        return this.grid.some(t => this.overlaps(t.coordinate, grain));
    }

    grainsOfSand() {
        return this.grid.filter(t => t.unit === 'o').length;
    }

    render(): string {
        let result = '';

        const {topLeft, bottomRight} = this.boundaries();

        for (let y = topLeft.y; y <= bottomRight.y; y++) {
            for (let x = topLeft.x; x <= bottomRight.x; x++) {
                result += this.tileAt(new Coordinate(x, y)).unit;
            }
            result += '\n';
        }

        return result
    }

    protected boundaries() {
        const topLeft = new Coordinate(_.minBy(this.grid, 'coordinate.x')?.coordinate.x || 0, 0)
        const bottomRight = new Coordinate(_.maxBy(this.grid, 'coordinate.x')?.coordinate.x || 0, _.maxBy(this.grid, 'coordinate.y')?.coordinate.y || 0)


        return {topLeft, bottomRight};
    }

    move(times: number): Grid {
        return _.range(times).reduce((acc: Grid) => acc.tick(), this)
    }
}

class GridWithFloor extends Grid {
    private floor: number;

    constructor(t: Tile[]) {
        super(t);
        this.floor = this.boundaries().bottomRight.y + 2;
    }

    tick(): Grid {
        const grain = this.fallFrom(this.source().coordinate);
        this.tileAt(grain).unit = 'o';
        return this;
    }


    set(coordinate: Coordinate, unit: Unit) {
        this.tileAt(coordinate).unit = unit
    }

    endState(): Grid {
        let counter = 0;
        const source = this.source().coordinate;
        let grain = this.fallFrom(source);
        while (this.isInGrid(grain)) {
            if(counter++ > 1000) throw 'too many loops'
            this.tileAt(grain).unit = 'o';
            grain = this.fallFrom(source);
        }
        return this;
    }

    protected fallFrom(from: Coordinate): Coordinate {
        if (this.isFree(from.down())) return this.fallFrom(from.down());
        if (this.isFree(from.downLeft())) return this.fallFrom(from.downLeft());
        if (this.isFree(from.downRight())) return this.fallFrom(from.downRight());
        return from;
    }

    protected isFree(coordinate: Coordinate): boolean {
        const tile = this.tileAt(coordinate);
        if(['+', '#', 'o'].includes(tile.unit)) return false;
        if(['.'].includes(tile.unit)) return true;
        return coordinate.y < this.floor;
    }

    protected tileAt(coordinate: Coordinate): Tile {
        const tile = this.grid.find(t => this.overlaps(t.coordinate, coordinate));
        if(tile) return tile;

        if(coordinate.y < this.floor) return new Tile(coordinate, '.')
        if(coordinate.y === this.floor) return new Tile(coordinate, '#')
        return new Tile(coordinate, ' ');
    }

    protected overlaps(left: Coordinate, right: Coordinate) {
        return left.x === right.x && left.y === right.y;
    }

    protected source(): Tile {
        const source = this.grid.find(t => t.unit === '+');
        if(!source) throw 'no source found';
        return source
    }

    protected isInGrid(grain: Coordinate) {
        return this.grid.some(t => this.overlaps(t.coordinate, grain));
    }

    grainsOfSand() {
        return this.grid.filter(t => t.unit === 'o').length;
    }

    render(): string {
        let result = '';

        const {topLeft, bottomRight} = this.boundaries();

        for (let y = topLeft.y; y <= bottomRight.y; y++) {
            for (let x = topLeft.x; x <= bottomRight.x; x++) {
                result += this.tileAt(new Coordinate(x, y)).unit;
            }
            result += '\n';
        }

        return result
    }

    protected boundaries() {
        const topLeft = new Coordinate(_.minBy(this.grid, 'coordinate.x')?.coordinate.x || 0, 0)
        const bottomRight = new Coordinate(_.maxBy(this.grid, 'coordinate.x')?.coordinate.x || 0, _.maxBy(this.grid, 'coordinate.y')?.coordinate.y || 0)


        return {topLeft, bottomRight};
    }

    move(times: number): Grid {
        return _.range(times).reduce((acc: Grid) => acc.tick(), this)
    }

}

const example: number[][][] = [
    [[498, 4], [498, 6], [496, 6]],
    [[503, 4], [502, 4], [502, 9], [494, 9]],
];

function getRocks(paths: number[][][]): Coordinate[] {
    function order(lineRange: number[][], line: number): { from: number[], to: number[] } {
        const left = lineRange[line - 1];
        const right = lineRange[line];
        if (left[0] < right[0]) return {from: left, to: right};
        if (left[1] < right[1]) return {from: left, to: right};
        return {from: right, to: left};
    }

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

function buildGrid(paths: number[][][], createGrid: (t: Tile[]) => Grid) {
    const rocks = getRocks(paths);

    const topLeft = new Coordinate(_.minBy(rocks, 'x')?.x || 0, 0)
    const bottomRight = new Coordinate(_.maxBy(rocks, 'x')?.x || 0, _.maxBy(rocks, 'y')?.y || 0)

    const tiles = _.flatten(_.range(topLeft.y, bottomRight.y + 1)
        .map((y) => _.range(topLeft.x, bottomRight.x + 1)
            .map((x) => {
                const coordinate = new Coordinate(x, y);
                return new Tile(coordinate, '.');
            })));

    const grid = createGrid(tiles);
    grid.set(new Coordinate(500, 0), '+');
    for (const rock of rocks) {
        grid.set(rock, '#');
    }
    return grid;
}

function unitsAtRest(paths: number[][][], createGrid: (t: Tile[]) => Grid) {
    const grid = buildGrid(paths, createGrid);

    const endState = grid.endState();
    console.log(endState.render())
    return endState.grainsOfSand();
}

xtest('example - part 1', () => {
    expect(unitsAtRest(example, (t) => new Grid(t))).toBe(24)
});

test('example - part 2', () => {
    const grid = buildGrid(example, (t) => new GridWithFloor(t));

    const state = grid.move(24);
    const grid1 = state.move(1);
    // console.log(grid1.render());
    // console.log((state.grainsOfSand()))

    // expect(unitsAtRest(example, (t) => new GridWithFloor(t))).toBe(24)
});

xtest('input', function () {
    expect(unitsAtRest(input, (t) => new Grid(t))).toBe(979)
});
