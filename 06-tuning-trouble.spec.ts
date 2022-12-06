import _ from 'lodash/fp';
import {input} from "./06-input";

const isUniq = <T>(packet: T[]) => packet.length === _.uniq(packet).length;

function firstUniqPacket(stream: string, packetLength: number) {
    for (let packetPosition = 0; packetPosition < stream.length - packetLength; packetPosition++) {
        const packet = _.flow(
            _.drop(packetPosition),
            _.take(packetLength)
        )(stream);
        if (isUniq(packet)) return packetPosition + packetLength
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
    expect(firstUniqPacket(stream, 4)).toBe(expectedMarker);
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
    expect(firstUniqPacket(stream, 14)).toBe(expectedMarker);
});
