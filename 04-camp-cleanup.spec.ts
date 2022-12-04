import _ from 'lodash/fp'

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

    overlaps(that: Section) {
        return this.start <= that.end && that.end <= this.end
    }
}

function overlaps([leftIds, rightIds]: string[]): boolean {
    const left = new Section(leftIds)
    const right = new Section(rightIds)
    return left.overlaps(right) || right.overlaps(left);
}

it.each([
    ['1-1', '2-2'],
    ['2-2', '1-1'],
])("%s don't overlap", (left, right) => {
    expect(overlaps([left, right])).toBeFalsy();
});

it.each([
    ['1-2', '1-1'],
    ['1-1', '1-2'],
])('%s overlaps', (left, right) => {
    expect(overlaps([left, right])).toBeTruthy();
});

function containsFully(example: string[][]): number {
    return 2;
}

it('example', () => {
    const example = [
        ['2-4','6-8'],
        ['2-3','4-5'],
        ['5-7','7-9'],
        ['2-8','3-7'],
        ['6-6','4-6'],
        ['2-6','4-8'],
    ]
    expect(containsFully(example)).toBe(2);
});