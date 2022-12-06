import _ from 'lodash/fp';
import {input} from "./06-input";

function firstUniquePacket(stream: string, length: number) {
    for (let i = 0; i < stream.length - length; i++) {
        const mark = _.flow(
            _.drop(i),
            _.take(length)
        )(stream);
        if (mark.length === _.uniq(mark).length) return i + length
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
    expect(firstUniquePacket(stream, 4)).toBe(expectedMarker);
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
    expect(firstUniquePacket(stream, 14)).toBe(expectedMarker);
});
