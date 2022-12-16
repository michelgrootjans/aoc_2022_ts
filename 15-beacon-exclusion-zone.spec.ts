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

class Scan {
    private topLeft: Coordinate;
    private bottomRight: Coordinate;
    private points: Point[];

    constructor(links: Link[]) {
        this.points = links.reduce((acc: { coordinate: Coordinate, type: string }[], sensor) =>
            [...acc, {coordinate: sensor.sensor, type: 'S'}, {coordinate: sensor.beacon, type: 'B'}], []);

        this.topLeft = new Coordinate(
            _.minBy(this.points, 'coordinate.x')?.coordinate.x || 0,
            _.minBy(this.points, 'coordinate.y')?.coordinate.y || 0
        );
        this.bottomRight = new Coordinate(
            _.maxBy(this.points, 'coordinate.x')?.coordinate.x || 0,
            _.maxBy(this.points, 'coordinate.y')?.coordinate.y || 0
        );

    }

    private getPoint(coordinate: Coordinate): string {
        return this.points.find(p => this.overlaps(coordinate, p.coordinate))?.type || '.';
    }

    private overlaps(left: Coordinate, right: Coordinate): boolean {
        return left.overlapsWith(right);
    }

    render(): string {
        const map = []
        for (let y = this.topLeft.y; y <= this.bottomRight.y; y++) {
            const line: string[] = [];
            map.push(line);
            for (let x = this.topLeft.x; x <= this.bottomRight.x; x++) {
                line.push(this.getPoint(new Coordinate(x, y)));
            }
        }
        let result = '     ';
        for (let x = this.topLeft.x; x <= this.bottomRight.x; x++) {
            result += x === 0 ? ' ' : Math.abs(x % 10);
        }
        result += '\n';
        for (let y = 0; y < map.length; y++) {
            const line = (y + this.topLeft.y + ' ').padEnd(5, ' ') + map[y].join('');
            for (let x = 0; x < line.length; x++) {
                result += line[x]
            }
            result += '\n';
        }
        return result
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
    const scan = new Scan(sensors)
    console.log(scan.render())
});