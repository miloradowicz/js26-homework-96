import { Rating } from '../types';

export const getRatingSummary = (ratings: Rating[]) => {
  const result = ratings.reduce(
    (a, x) => ({ sum: a.sum + x.rating, count: a.count + 1 }),
    {
      sum: 0,
      count: 0,
    },
  );

  return { avg: result.sum / result.count, count: result.count };
};
