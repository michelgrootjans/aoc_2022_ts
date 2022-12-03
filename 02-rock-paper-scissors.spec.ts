import _ from 'lodash/fp'
import {input} from "./02-input";

function score(left: string, right: string): number {
    const moveScore = {X: 1, Y: 2, Z: 3}[right] || 0;
    const winScore = {
        AY: 6, BZ: 6, CX: 6,
        AX: 3, BY: 3, CZ: 3,
        AZ: 0, BX: 0, CY: 0,
    }[left + right] || 0;
    return moveScore + winScore;
}

function totalScore(hands: string[][]): number {
    return _.flow(
        _.map((hand: string[]) => score(hand[0], hand[1])),
        _.sum,
    )(hands);
}

it('AX', () => expect(score('A', 'X')).toEqual(1 + 3));
it('AY', () => expect(score('A', 'Y')).toEqual(2 + 6));
it('AZ', () => expect(score('A', 'Z')).toEqual(3 + 0));
it('BX', () => expect(score('B', 'X')).toEqual(1 + 0));
it('BY', () => expect(score('B', 'Y')).toEqual(2 + 3));
it('BZ', () => expect(score('B', 'Z')).toEqual(3 + 6));
it('CX', () => expect(score('C', 'X')).toEqual(1 + 6));
it('CY', () => expect(score('C', 'Y')).toEqual(2 + 0));
it('CZ', () => expect(score('C', 'Z')).toEqual(3 + 3));

it('example', () => expect(totalScore([['A', 'Y'], ['B', 'X'], ['C', 'Z']])).toEqual(8 + 1 + 6));
it('input', () => expect(totalScore(input)).toEqual(11386));

