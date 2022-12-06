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

function messagePosition(stream: string) {
    const characters = _.split('')(stream);
    for (let i = 0; i < characters.length - 14; i++) {
        const mark = _.flow(
            _.drop(i),
            _.take(14)
        )(characters);
        if (mark.length === _.uniq(mark).length) return i + 14
    }
    return -1;
}

test.each([
    ['abcde', 4],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7],
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
    [input, 1042],
])("'%s' packet starts at %d", (stream, expectedMarker) => {
    expect(markerPosition(stream)).toBe(expectedMarker);
});

test.each([
    ['abcdefghijklmnopqrstuvwxyz', 14],
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
    [input, 2980],
])("'%s' message starts at %d", (stream, expectedMarker) => {
    expect(messagePosition(stream)).toBe(expectedMarker);
});
