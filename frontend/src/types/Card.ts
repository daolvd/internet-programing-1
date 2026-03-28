export interface Card {
    id: number;
    question: string;
    answer: string;
    deckId: number; // Assuming you want to link it to a deck
    status: string; // Optional status field for tracking learning progress
}