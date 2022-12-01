import _ from 'lodash/fp'

type accumulator = { previous: string[][], current: string[] };

const groupByEmptyLine = _.flow(
  _.reduce((acc: accumulator, current: string) => {
    if (current)
      return {...acc, current: [...acc.current, current]};
    return {previous: [...acc.previous, acc.current], current: []};
  }, {previous: [], current: []}),
  (acc: accumulator) => [...acc.previous, acc.current],
);

const mostCalories = _.flow(
  groupByEmptyLine,
  _.map(_.map(parseInt)),
  _.map(_.sum),
  _.max,
);

it('no input', () => {
  expect(mostCalories([])).toEqual(0);
});

it('one calorie', () => {
  expect(mostCalories(['1000'])).toEqual(1000);
});

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