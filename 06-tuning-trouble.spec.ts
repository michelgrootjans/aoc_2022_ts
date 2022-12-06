import _ from 'lodash/fp';
import {input} from "./06-input";

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
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
    [input, 1042],
])("'%s' => %d", (stream, expectedMarker) => {
    expect(markerPosition(stream)).toBe(expectedMarker);
});
