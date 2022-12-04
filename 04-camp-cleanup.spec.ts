import _ from 'lodash/fp'
import {input} from "./04-input";

class Section {
    private start: number;
    private end: number;

    constructor(ids: string) {
        const split = _.flow(
            _.split('-'),
            _.map(parseInt),
        )(ids);
        this.start = split[0];
        this.end = split[1];
    }

    containsFully(that: Section) {
        return this.start <= that.start && that.end <= this.end
    }

    overlaps(that: Section) {
        return this.start <= that.end && that.start <= this.end
    }
}

const overlapsCompletely = ([leftIds, rightIds]: string[]): boolean => {
    const left = new Section(leftIds)
    const right = new Section(rightIds)
    return left.containsFully(right) || right.containsFully(left);
};

it.each([
    ['1-1', '2-2'],
    ['2-2', '1-1'],
])("%s don't overlap", (left, right) => {
    expect(overlapsCompletely([left, right])).toBeFalsy();
});

it.each([
    ['1-2', '1-1'],
    ['1-1', '1-2'],
])('%s overlaps', (left, right) => {
    expect(overlapsCompletely([left, right])).toBeTruthy();
});

function countFullOverlaps(example: string[][]): number {
    return _.flow(
        _.filter(overlapsCompletely),
        _.size
    )(example);
}

it('example - part 1', () => {
    const example = [
        ['2-4','6-8'],
        ['2-3','4-5'],
        ['5-7','7-9'],
        ['2-8','3-7'], // fully overlaps
        ['6-6','4-6'], // fully overlaps
        ['2-6','4-8'],
    ]
    expect(countFullOverlaps(example)).toBe(2);
});

it('input - part 1', () => {
    expect(countFullOverlaps(input)).toBe(515);
});

const overlapsPartially = ([leftIds, rightIds]: string[]): boolean => {
    const left = new Section(leftIds)
    const right = new Section(rightIds)
    return left.overlaps(right);
};

it.each([
    ['1-1', '2-2'],
    ['2-2', '1-1'],
    ['1-2', '3-4'],
    ['5-6', '3-4'],
])("%s don't overlap partially", (left, right) => {
    expect(overlapsPartially([left, right])).toBeFalsy();
});


it.each([
    ['1-2', '1-1'],
    ['1-1', '1-2'],
    ['1-3', '3-4'],
    ['1-4', '3-4'],
    ['1-5', '3-4'],
    ['1-6', '3-4'],
    ['2-6', '3-4'],
    ['3-6', '3-4'],
    ['4-6', '3-4'],
])('%s overlaps partially', (left, right) => {
    expect(overlapsPartially([left, right])).toBeTruthy();
});

const countPartialOverlaps = (pairs: string[][]) => {
    return _.flow(
        _.filter(overlapsPartially),
        _.size
    )(pairs);
};

it('example - part 2', () => {
    const example = [
        ['2-4','6-8'],
        ['2-3','4-5'],
        ['5-7','7-9'], // partial overlap
        ['2-8','3-7'], // full overlap
        ['6-6','4-6'], // full overlap
        ['2-6','4-8'], // partial overlap
    ]
    expect(countPartialOverlaps(example)).toBe(4);
});

it('input - part 2', () => {
    expect(countPartialOverlaps(input)).toBe(883);
});

