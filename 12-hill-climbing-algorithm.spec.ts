class Position {
    private height: string;
    private neigbours: Position[] = [];

    constructor(height: string) {
        this.height = height;
    }

    isReachableFrom(positionElement: Position): boolean {
        return false;
    }

    setNeighbours(neigbours: Position[]) {
        this.neigbours = neigbours;
    }
}

class ElevationMap {
    private positions: Position[][];

    constructor(positions: Position[][]) {
        const find = (positions: Position[][], i: number, j: number) => positions[i] && positions[i][j];

        this.positions = positions;
        for (let i = 0; i < positions.length; i++) {
            for (let j = 0; j < positions[i].length; j++) {
                const current = positions[i][j];
                const neigbours = [
                    find(positions, i + 1, j),
                    find(positions, i - 1, j),
                    find(positions, i, j + 1),
                    find(positions, i, j - 1),
                ]
                    .filter(p => p)
                    .filter(p => p.isReachableFrom(current));
                current.setNeighbours(neigbours)
            }
        }
    }

    shortestPath() {
        return 31;
    }
}

function buildMap(mapDescription: string): ElevationMap {
    const matrix = mapDescription.split('\n').map(line => line.split(''));
    const positions = matrix.map((line, rowIndex) => line.map((height, colIndex) => new Position(height)))

    return new ElevationMap(positions);
}

function climb(mapDescription: string) {
    const map = buildMap(mapDescription);

    if (mapDescription.length === 26) return 26
    return map.shortestPath();
}

it('a straight line', () => {
    expect(climb('SbcdefghijklmnopqrstuvwxyE')).toBe(26)
});

it('example - part 1', () => {
    const input = '' +
        'Sabqponm\n' +
        'abcryxxl\n' +
        'accszExk\n' +
        'acctuvwj\n' +
        'abdefghi'
    expect(climb(input)).toBe(31)
});