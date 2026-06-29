export type ProductQuantityOptionsMap = Record<number, string[]>;

export type ProductSuggestion = {
  id: number;
  name: string;
  caption: string | null;
  tags: string | null;
};
