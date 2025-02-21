export interface SentimentResult {
  text: string;
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  prediction: number[];
}