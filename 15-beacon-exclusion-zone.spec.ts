import _ from "lodash";

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
        return {sensor: coordinates[0], beacon: coordinates[1]}
    }

    function parseCoordinate(description: string): Coordinate {
        const points = description.split(',')
            .map(point => point.split('=')[1])
            .map(point => parseInt(point));
        return new Coordinate(points[0], points[1])
    }

    return description.split('\n').map(parseSensor);
}

type Link = { sensor: Coordinate; beacon: Coordinate };

type Point = { coordinate: Coordinate; type: string };

class Scanner {
    private points: Point[];
    private links: Link[];

    constructor(links: Link[]) {
        this.links = links;
        this.points = links.reduce((acc: { coordinate: Coordinate, type: string }[], sensor) =>
            [...acc, {coordinate: sensor.sensor, type: 'S'}, {coordinate: sensor.beacon, type: 'B'}], []);
    }

    private getPoint(coordinate: Coordinate): string {
        return this.findPoint(coordinate)?.type || '.';
    }

    private setPoint(coordinate: Coordinate, type: string) {
        const point = this.findPoint(coordinate);
        if (point) {
            if (point.type === '.') {
                point.type = type;
            }
        } else {

            this.points.push({coordinate, type})
        }
    }

    private findPoint(coordinate: Coordinate) {
        return this.points.find(p => this.overlaps(coordinate, p.coordinate));
    }

    private overlaps(left: Coordinate, right: Coordinate): boolean {
        return left.overlapsWith(right);
    }

    render(): string {
        const topLeft = new Coordinate(
            _.minBy(this.points, 'coordinate.x')?.coordinate.x || 0,
            _.minBy(this.points, 'coordinate.y')?.coordinate.y || 0
        );
        const bottomRight = new Coordinate(
            _.maxBy(this.points, 'coordinate.x')?.coordinate.x || 0,
            _.maxBy(this.points, 'coordinate.y')?.coordinate.y || 0
        );

        const map = []
        for (let y = topLeft.y; y <= bottomRight.y; y++) {
            const line: string[] = [];
            map.push(line);
            for (let x = topLeft.x; x <= bottomRight.x; x++) {
                line.push(this.getPoint(new Coordinate(x, y)));
            }
        }
        let result = '     ';
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            result += x === 0 ? ' ' : Math.abs(x % 10);
        }
        result += '\n';
        for (let y = 0; y < map.length; y++) {
            const line = (y + topLeft.y + ' ').padEnd(5, ' ') + map[y].join('');
            for (let x = 0; x < line.length; x++) {
                result += line[x]
            }
            result += '\n';
        }
        return result
    }

    scan() {
        for (const link of this.links) {
            this.scanLink(link);
        }
    }

    private scanLink({sensor, beacon}: Link) {
        const distance = sensor.distanceTo(beacon);
        for (let y = 0; y < distance; y++) {
            for (let x = 0; x < distance; x++) {
                for (let i = 1; i <= distance; i++) {
                    for (let j = 0; j <= i; j++) {
                        this.setPoint(new Coordinate(sensor.x + i - j, sensor.y + j), '#')
                        this.setPoint(new Coordinate(sensor.x - i + j, sensor.y + j), '#')
                        this.setPoint(new Coordinate(sensor.x - i + j, sensor.y - j), '#')
                        this.setPoint(new Coordinate(sensor.x + i - j, sensor.y - j), '#')
                    }
                }
            }
        }
    }

    emptyLocationsOnLine(number: number) {
        return this.points
            .filter(p => p.coordinate.y === number)
            .filter(p => p.type === '#')
            .length;
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

test('should work', () => {
    const sensors = parseSensors(example);
    const scanner = new Scanner(sensors);
    scanner.scan()
    expect(scanner.emptyLocationsOnLine(10)).toBe(26);
    console.log(scanner.render())
});