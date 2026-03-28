export interface Deck {
  id: number;
  name: string;
  cards: number;
  status: string;
  categoryId: number; // Assuming you want to link it to a category
  lastActive : number; // Timestamp for tracking last active time
}
