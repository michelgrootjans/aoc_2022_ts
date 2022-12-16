import {input} from "./15-input";

class Coordinate {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    overlapsWith(that: Coordinate) {
        return this.x === that.x && this.y === that.y;
    }

    distanceTo(that: Coordinate): number {
        return Math.abs(this.x - that.x) + Math.abs(this.y - that.y);
    }
}

function parseSensors(description: string): Link[] {
    function parseSensor(line: string): Link {
        const coordinates = line.replace('Sensor at ', '')
            .replace('closest beacon is at ', '')
            .split(': ')
            .map(parseCoordinate);
        return {sensor: coordinates[0], beacon: coordinates[1], distance: coordinates[0].distanceTo(coordinates[1])}
    }

    function parseCoordinate(description: string): Coordinate {
        const points = description.split(',')
            .map(point => point.split('=')[1])
            .map(point => parseInt(point));
        return new Coordinate(points[0], points[1])
    }

    return description.split('\n').map(parseSensor);
}

type Link = { sensor: Coordinate; beacon: Coordinate, distance: number };

class Scanner {
    private links: Link[];

    constructor(links: Link[]) {
        this.links = links;
    }

    scan(lineNumber: number): number {
        const emptyPositions = new Set();
        for (const link of this.links.filter(l => {
            if (l.sensor.y + l.distance < lineNumber) return false;
            if (l.sensor.y - l.distance > lineNumber) return false;
            return true;
        })) {
            let {sensor, beacon, distance}: Link = link;
            const deltaY = Math.abs(sensor.y - lineNumber);
            const deltaX = distance - deltaY;
            for (let x = sensor.x - deltaX; x <= sensor.x + deltaX; x++) {
                if(beacon.overlapsWith(new Coordinate(x, lineNumber))) continue
                emptyPositions.add(x);
            }
        }
        return emptyPositions.size;
    }
}

const example = '' +
    'Sensor at x=2, y=18: closest beacon is at x=-2, y=15\n' +
    'Sensor at x=9, y=16: closest beacon is at x=10, y=16\n' +
    'Sensor at x=13, y=2: closest beacon is at x=15, y=3\n' +
    'Sensor at x=12, y=14: closest beacon is at x=10, y=16\n' +
    'Sensor at x=10, y=20: closest beacon is at x=10, y=16\n' +
    'Sensor at x=14, y=17: closest beacon is at x=10, y=16\n' +
    'Sensor at x=8, y=7: closest beacon is at x=2, y=10\n' +
    'Sensor at x=2, y=0: closest beacon is at x=2, y=10\n' +
    'Sensor at x=0, y=11: closest beacon is at x=2, y=10\n' +
    'Sensor at x=20, y=14: closest beacon is at x=25, y=17\n' +
    'Sensor at x=17, y=20: closest beacon is at x=21, y=22\n' +
    'Sensor at x=16, y=7: closest beacon is at x=15, y=3\n' +
    'Sensor at x=14, y=3: closest beacon is at x=15, y=3\n' +
    'Sensor at x=20, y=1: closest beacon is at x=15, y=3'

test('example', () => {
    const scanner = new Scanner(parseSensors(example));
    expect(scanner.scan(10)).toBe(26);
});

xtest('input', () => {
    const scanner = new Scanner(parseSensors(input));
    expect(scanner.scan(2000000)).toBe(6124805);
});
