import axios from 'axios';

interface CurrencyExchangeProvider {
  readonly exchange: (
    amount: number,
    currencyFrom: string,
    currencyTo: string,
    apiLink?: string
  ) => Promise<object>;
}

class OpenExchangeRateProvider implements CurrencyExchangeProvider {
  async exchange(amount: number, currencyFrom: string, currencyTo: string) {
    const res = await axios.get(
      `https://api.exchangerate.host/convert?from=${currencyFrom}&to=${currencyTo}&amount=${amount}`
    );

    return Promise.resolve(res);
  }
}

class F1ExchangeRateProvider implements CurrencyExchangeProvider {
  async exchange(
    amount: number,
    currencyFrom: string,
    currencyTo: string,
    apiLink: string
  ) {
    const res = await axios.get(`https://api.m3o.com/v1/currency/Convert`, {
      params: { from: currencyFrom, to: currencyTo, amount: amount },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiLink}`,
      },
    });
    return Promise.resolve(res);
  }
}

class ExchangeRateProviderFactory {
  static create(provider: string) {
    switch (provider) {
      case 'open_exchange_rate':
        return new OpenExchangeRateProvider();

      case 'f1_exchange_rate':
        return new F1ExchangeRateProvider();

      default:
        throw new Error('Invalid exchange provider');
    }
  }
}

(async () => {
  const apiLink = 'OTIxZDdlZjMtODZhNi00NzRmLTlhYzMtYjQzZDQyNTgxNzlk';
  const result = ExchangeRateProviderFactory.create('f1_exchange_rate');
  const res = await result.exchange(100, 'USD', 'JPY', apiLink);
  console.log(res.data);
})();
