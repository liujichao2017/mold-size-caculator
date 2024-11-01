import { validators } from "@/types";

interface ExchangeRateInput {
  originCurrency: string;
  targetCurrency: string;
}

const getExchangeRate = async (input: ExchangeRateInput): Promise<number> => {
  try {
    const exchangeRateUrl = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${input.originCurrency}`;
    const response = await fetch(exchangeRateUrl, {
      next: {
        revalidate: 24 * 60 * 60 // 24小时刷新一次
      }
    });
    const data = (await response.json()) as unknown;
    const validData = validators.validateExchangeRate(data);
    return validData.conversion_rates[
      input.targetCurrency as keyof typeof validData.conversion_rates
    ];
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export { getExchangeRate };