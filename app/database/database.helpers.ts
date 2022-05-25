import { ZSetType } from "../../src/redux/Types/Item";

export const parseZSet = (input: string[]): ZSetType => {
  const result: { value: string; score: string }[] = [];

  input.forEach((item, index) => {
    if (index % 2 === 1) return;

    result.push({
      value: item,
      score: input[index + 1],
    });
  });

  return result;
};
