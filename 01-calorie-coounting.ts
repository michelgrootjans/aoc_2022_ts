import _ from 'lodash/fp'
import {readFileSync} from "fs";

type accumulator = { previous: string[][], current: string[] };

const caloriesByElves = _.flow(
  _.reduce((acc: accumulator, current: string) => {
    if (current)
      return {...acc, current: [...acc.current, current]};
    return {previous: [...acc.previous, acc.current], current: []};
  }, {previous: [], current: []}),
  (acc: accumulator) => [...acc.previous, acc.current],
  _.map(_.map(parseInt)),
  _.map(_.sum),
);

const fromHighToLow = _.flow(
    _.sortBy(_.identity),
    _.reverse,
);

export const mostCalories = _.flow(
  caloriesByElves,
  _.max,
);

export const topThree = _.flow(
  caloriesByElves,
  fromHighToLow,
  _.take(3),
  _.sum,
);