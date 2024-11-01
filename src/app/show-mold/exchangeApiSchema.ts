// schemas.ts
import { z } from 'zod';

const RateSchema = z.object({
  CNY: z.number(),
});

// 定义一个exchangeRateResult模式
export const ExchangeRateResultSchema = z.object({
  result: z.string(),
  conversion_rates: RateSchema,
});
