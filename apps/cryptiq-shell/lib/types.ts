export default interface CryptoData {
    from_symbol: string;
    to_symbol: string;
    price: number;
    mktcap: number;
    total_volume_24hr: number,
    image_url: string
}

export default interface TradeRequestBody {
    userId: string;
    coinSymbol: string;
    amount: number;
    tradeType: string;
  }