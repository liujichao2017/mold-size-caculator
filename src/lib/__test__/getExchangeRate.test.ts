import { getExchangeRate } from "../getExchangeRate";

const test = async () => {
  const test = await getExchangeRate({ originCurrency: "USD", targetCurrency: "CNY" });
  console.log(test);
};

void test();
// bun run src/lib/__test__/getExchangeRate.test.ts