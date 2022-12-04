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
}

function containsFully([leftIds, rightIds]: string[]): boolean {
    const left = new Section(leftIds)
    const right = new Section(rightIds)
    const a = left.containsFully(right);
    const b = right.containsFully(left);
    return a || b;
}

it.each([
    ['1-1', '2-2'],
    ['2-2', '1-1'],
])("%s don't overlap", (left, right) => {
    expect(containsFully([left, right])).toBeFalsy();
});

it.each([
    ['1-2', '1-1'],
    ['1-1', '1-2'],
])('%s overlaps', (left, right) => {
    expect(containsFully([left, right])).toBeTruthy();
});

function countOverlaps(example: string[][]): number {
    return _.flow(
        _.filter(containsFully),
        _.size
    )(example);
}

it('example - part 1', () => {
    const example = [
        ['2-4','6-8'],
        ['2-3','4-5'],
        ['5-7','7-9'],
        ['2-8','3-7'],
        ['6-6','4-6'],
        ['2-6','4-8'],
    ]
    expect(countOverlaps(example)).toBe(2);
});

it('input - part 1', () => {
    expect(countOverlaps(input)).toBe(515);
});