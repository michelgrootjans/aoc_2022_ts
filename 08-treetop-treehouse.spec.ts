import _ from 'lodash/fp'
import {forOwn} from "lodash";

function visibleTrees(trees: number[][]) {
    let visibleTrees = 0;

    for (let rowIndex = 0; rowIndex < trees.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < trees[rowIndex].length; columnIndex++) {
            const value = trees[rowIndex][columnIndex];
            const row = trees[rowIndex];
            const column = trees.map(function(value) { return value[columnIndex]; });
            const neighborsUp = _.take(rowIndex)(column);
            const neighborsDown = _.drop(rowIndex + 1)(column);
            const neighborsLeft = _.take(columnIndex)(row);
            const neighborsRight = _.drop(columnIndex + 1)(row);


            function visible(neigbors: number[][]): boolean {
                function isHigher(tree: number) {
                    const higher = tree < value;
                    return higher;
                }

                function highestInRow(neigbor: number[]): boolean {
                    return _.every(isHigher)(neigbor);
                }

                return _.some(highestInRow)(neigbors);
            }

            const count = visible([neighborsUp, neighborsDown, neighborsLeft, neighborsRight]) ? 1 : 0;
            visibleTrees += count;
            // console.log({rowIndex, columnIndex, value, row, column, neighborsUp, neighborsDown, neighborsLeft, neighborsRight, count})
        }
    }
    return visibleTrees;
}

test('1 tree', () => {
    expect(visibleTrees([[1]])).toBe(1)
});

test('square with all visible trees', () => {
    expect(visibleTrees([
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1],
    ])).toBe(9)
});

test('square center invisible', () => {
    expect(visibleTrees([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ])).toBe(8)
});

test('example', () => {
    expect(visibleTrees([
        [3,0,3,7,3,],
        [2,5,5,1,2,],
        [6,5,3,3,2,],
        [3,3,5,4,9,],
        [3,5,3,9,0,],
    ])).toBe(21)
});
