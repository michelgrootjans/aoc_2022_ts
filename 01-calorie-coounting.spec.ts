import {readFileSync} from "fs";
import {mostCalories, topThree} from "./01-calorie-coounting";

it('one calorie', () => {
  expect(mostCalories(['1000'])).toEqual(1000);
});

it('two calories', () => {
  expect(mostCalories(['1000', '1000'])).toEqual(2000);
});

it('one calorie and empty', () => {
  expect(mostCalories(['1000', ''])).toEqual(1000);
});

it('two elves', () => {
  expect(mostCalories(['1000', '', '2000'])).toEqual(2000);
});

it('two elves with multiple calories', () => {
  expect(mostCalories(['1000', '1000', '', '2000', '2000'])).toEqual(4000);
});

it('the example', () => {
  const example = [
    '1000',
    '2000',
    '3000', // 6000
    '',
    '4000', // 4000
    '',
    '5000',
    '6000', // 11000
    '',
    '7000',
    '8000',
    '9000', // 24000
    '',
    '10000', // 10000
  ];
  expect(mostCalories(example)).toEqual(24000);
  expect(topThree(example)).toEqual(45000);
});

it('my exercise', () => {
  const input = readFileSync('./01-input.txt', 'utf-8').split(/\r?\n/);
  expect(mostCalories(input)).toEqual(70698);
  expect(topThree(input)).toEqual(206643);
});