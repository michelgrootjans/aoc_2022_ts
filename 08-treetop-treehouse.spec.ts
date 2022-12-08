import _ from 'lodash/fp'
import {input} from "./08-input";

class Views {
    private readonly trees: number[][];

    constructor(trees: number[][]) {
        this.trees = trees;
    }

    viewsOf(rowIndex: number, columnIndex: number): number[][] {
        const row = this.trees[rowIndex];
        const column = this.trees.map(value => value[columnIndex]);

        const viewUp = _.flow(_.take(rowIndex), _.reverse)(column);
        const viewDown = _.drop(rowIndex + 1)(column);
        const viewLeft = _.flow(_.take(columnIndex), _.reverse)(row);
        const viewRight = _.drop(columnIndex + 1)(row);
        return [viewUp, viewDown, viewLeft, viewRight];
    }
}

function visibleTrees(trees: number[][]) {
    let visibleTrees = 0;
    const v = new Views(trees);

    for (let rowIndex = 0; rowIndex < trees.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < trees[rowIndex].length; columnIndex++) {
            const value = trees[rowIndex][columnIndex];
            const isVisible = _.some((view: number[]): boolean => _.every((tree: number) => tree < value)(view));

            visibleTrees += isVisible(v.viewsOf(rowIndex, columnIndex)) ? 1 : 0;
        }
    return visibleTrees;
}

function scenicScoreOf(value: number, view: number[]): number {
    if (view.length === 0) {
        return 0;
    }
    const treesVisible = _.takeWhile((tree: number) => tree < value)(view);
    if (treesVisible.length < view.length) {
        return treesVisible.length + 1;
    }
    return treesVisible.length;
}

function bestScenicScore(trees: number[][]) {
    let bestScenicScore = 0;
    const v = new Views(trees);

    for (let rowIndex = 0; rowIndex < trees.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < trees[rowIndex].length; columnIndex++) {
            const value = trees[rowIndex][columnIndex];
            const viewsOf = v.viewsOf(rowIndex, columnIndex);
            const scenicScores = viewsOf
                .map((view: number[]) => scenicScoreOf(value, view))

            const currentScenicScore = scenicScores.reduce((acc, a) => acc * a, 1)
            if (bestScenicScore < currentScenicScore) bestScenicScore = currentScenicScore;
        }
    return bestScenicScore;
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

test('example part 1', () => {
    expect(visibleTrees([
        [3, 0, 3, 7, 3,],
        [2, 5, 5, 1, 2,],
        [6, 5, 3, 3, 2,],
        [3, 3, 5, 4, 9,],
        [3, 5, 3, 9, 0,],
    ])).toBe(21)
});

test('input part 1', () => expect(visibleTrees(input)).toBe(1849));

test('example part 2', () => {
    expect(bestScenicScore([
        [3, 0, 3, 7, 3,],
        [2, 5, 5, 1, 2,],
        [6, 5, 3, 3, 2,],
        [3, 3, 5, 4, 9,],
        [3, 5, 3, 9, 0,],
    ])).toBe(8)
});

xtest('input part 2', () => expect(bestScenicScore(input)).toBe(1849));
