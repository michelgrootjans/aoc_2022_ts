import _ from 'lodash/fp';

function markerPosition(stream: string) {
    const characters = _.split('')(stream);
    for (let i = 0; i < characters.length - 4; i++) {
        const mark = _.flow(
            _.drop(i),
            _.take(4)
        )(characters);
        if (mark.length === _.uniq(mark).length) return i + 4
    }
    return -1;
}

test.each([
    ['abcde', 4],
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7],
])("'%s' => %d", (stream, expectedMarker) => {
    expect(markerPosition(stream)).toBe(expectedMarker);
});