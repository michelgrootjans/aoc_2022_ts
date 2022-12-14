import _ from 'lodash'

const example: number[][][] = [
    [[498, 4], [498, 6], [496, 6]],
    [[503, 4], [502, 4], [502, 9], [494, 9]],
];

function order(lineRange: number[][], line: number): {from: number[], to: number[]} {
    const left = lineRange[line - 1];
    const right = lineRange[line];
    if(left[0] < right[0]) return {from: left, to: right};
    if(left[1] < right[1]) return {from: left, to: right};
    return {from: right, to: left};
}

function unitsAtRest(paths: number[][][]) {
    const rocks: {x: number, y:number}[] = []
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
        const lineRange = paths[pathIndex];
        for (let line = 1; line < lineRange.length; line++) {
            const {from, to} = order(lineRange, line);
            console.log({from, to})
            for (let x = from[0]; x <= to[0]; x++) {
                for (let y = from[1]; y <= to[1]; y++) {
                    rocks.push({x, y});
                }
            }
        }
    }

    let grid = '';

    function getPoint(x: number, y: number) {
        const hasRock = rocks.some(rock => rock.x === x && rock.y === y);
        if(hasRock)
            return '#'
        return '.';
    }

    grid += _.range(10).map(
        (y) => _.range(494, 504)
            .map((x) => getPoint(x, y))
            .join('')
    )
        .join('\n')
    console.log(grid);
    return 24;
}

test('example', function () {
    expect(unitsAtRest(example)).toBe(24)
});