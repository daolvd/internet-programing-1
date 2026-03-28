import type { Card } from "../types/Card";
import type { Category } from "../types/Category";
import type { Deck } from "../types/Deck";

export const allDecks: Deck[] = [
    { id: 1, name: "Japanese N5", cards: 1, status: "Ready to review", categoryId: 1, lastActive: Date.now() },
    { id: 2, name: "Spanish Verbs", cards: 2, status: "Review in 2 hours", categoryId: 2, lastActive: Date.now() },
    { id: 3, name: "French Cuisine", cards: 1, status: "New material added", categoryId: 3, lastActive: Date.now() },
    ];
export const allCategories :Category[] = [
     { id: 0, name: "General", decks: 1, cards: 1, active: true , proficiency: 65},
    { id: 1, name: "Languages", decks: 12, cards: 450, active: true , proficiency: 65},
    { id: 2, name: "Science", decks: 8, cards: 320, active: false, proficiency: 40 },
    { id: 3, name: "History", decks: 5, cards: 180, active: false, proficiency: 30 },
    ];
export const allCards :Card[] = [
    { id: 1, question: "How do you say 'Good Morning' in Japanese?", answer: "Ohayou gozaimasu", deckId: 1  , status :"Don't know"},
    { id: 2, question: "How do you say 'Thank you' in Japanese?", answer: "Arigatou", deckId: 1 , status :"Don't know"},
    { id: 3, question: "How do you say 'Good night' in Japanese?", answer: "Oyasumi", deckId: 1 , status :"Don't know"},
    { id: 4, question: "What does 'konnichiwa' mean?", answer: "Hello", deckId: 1 , status :"Don't know"},
    { id: 5, question: "How do you say 'Water' in Japanese?", answer: "Mizu", deckId: 1 , status :"Don't know"},
    { id: 6, question: "How do you say 'Book' in Japanese?", answer: "Hon", deckId: 1 , status :"Don't know"},
    { id: 7, question: "How do you say 'Teacher' in Japanese?", answer: "Sensei", deckId: 1 , status :"Don't know"},
    { id: 8, question: "What is 'inu' in English?", answer: "Dog", deckId: 1 , status :"Don't know"},
    { id: 9, question: "What is 'neko' in English?", answer: "Cat", deckId: 1 , status :"Don't know"},
    { id: 10, question: "How do you say 'Friend' in Japanese?", answer: "Tomodachi", deckId: 1 , status :"Don't know"},
    { id: 11, question: "How do you say 'School' in Japanese?", answer: "Gakkou", deckId: 1 , status :"Don't know"},
    { id: 12, question: "How do you say 'Food' in Japanese?", answer: "Tabemono", deckId: 1 , status :"Don't know"},
    { id: 13, question: "How do you say 'I understand' in Japanese?", answer: "Wakarimasu", deckId: 1 , status :"Don't know"},
    { id: 14, question: "What does 'sumimasen' mean?", answer: "Excuse me / sorry", deckId: 1 , status :"Don't know"},
    { id: 15, question: "How do you say 'Yes' in Japanese?", answer: "Hai", deckId: 1 , status :"Don't know"},
    { id: 16, question: "What is the powerhouse of the cell?", answer: "Mitochondria", deckId: 2 , status :"Don't know"},
    { id: 17, question: "What part of the cell contains DNA?", answer: "Nucleus", deckId: 2 , status :"Don't know"},
    { id: 18, question: "What gas do plants absorb from the air?", answer: "Carbon dioxide", deckId: 2 , status :"Don't know"},
    { id: 19, question: "What is H2O commonly known as?", answer: "Water", deckId: 2 , status :"Don't know"},
    { id: 20, question: "What force pulls objects toward Earth?", answer: "Gravity", deckId: 2 , status :"Don't know"},
    { id: 21, question: "What planet is known as the Red Planet?", answer: "Mars", deckId: 2 , status :"Don't know"},
    { id: 22, question: "What is the chemical symbol for gold?", answer: "Au", deckId: 2 , status :"Don't know"},
    { id: 23, question: "What is the speed of light rounded in km/s?", answer: "300000 km/s", deckId: 2 , status :"Don't know"},
    { id: 24, question: "What organ pumps blood in the human body?", answer: "Heart", deckId: 2 , status :"Don't know"},
    { id: 25, question: "What is the largest organ of the human body?", answer: "Skin", deckId: 2 , status :"Don't know"},
    { id: 26, question: "What do bees primarily collect from flowers?", answer: "Nectar", deckId: 2 , status :"Don't know"},
    { id: 27, question: "What is the boiling point of water in Celsius?", answer: "100", deckId: 2 , status :"Don't know"},
    { id: 28, question: "What is the freezing point of water in Celsius?", answer: "0", deckId: 2 , status :"Don't know"},
    { id: 29, question: "Which blood cells help fight infection?", answer: "White blood cells", deckId: 2 , status :"Don't know"},
    { id: 30, question: "What is the nearest star to Earth?", answer: "The Sun", deckId: 2 , status :"Don't know"},
    { id: 31, question: "When did the French Revolution start?", answer: "1789", deckId: 3 , status :"Don't know"},
    { id: 32, question: "Who was the first President of the United States?", answer: "George Washington", deckId: 3 , status :"Don't know"},
    { id: 33, question: "In which year did World War II end?", answer: "1945", deckId: 3 , status :"Don't know"},
    { id: 34, question: "Which wall fell in 1989?", answer: "Berlin Wall", deckId: 3 , status :"Don't know"},
    { id: 35, question: "Who discovered America in 1492?", answer: "Christopher Columbus", deckId: 3 , status :"Don't know"},
    { id: 36, question: "What was the ancient Egyptian writing system called?", answer: "Hieroglyphics", deckId: 3 , status :"Don't know"},
    { id: 37, question: "Who was known as the Maid of Orleans?", answer: "Joan of Arc", deckId: 3 , status :"Don't know"},
    { id: 38, question: "Which empire built the Colosseum?", answer: "Roman Empire", deckId: 3 , status :"Don't know"},
    { id: 39, question: "What year did the Titanic sink?", answer: "1912", deckId: 3 , status :"Don't know"},
    { id: 40, question: "Who wrote the Communist Manifesto with Engels?", answer: "Karl Marx", deckId: 3 , status :"Don't know"},
    { id: 41, question: "Which country gifted the Statue of Liberty to the US?", answer: "France", deckId: 3 , status :"Don't know"},
    { id: 42, question: "What was the first civilization in Mesopotamia?", answer: "Sumerians", deckId: 3 , status :"Don't know"},
    { id: 43, question: "Who was the leader of Nazi Germany?", answer: "Adolf Hitler", deckId: 3 , status :"Don't know"},
    { id: 44, question: "In which year did World War I begin?", answer: "1914", deckId: 3 , status :"Don't know"},
    { id: 45, question: "What was the name of the trade route linking East and West?", answer: "Silk Road", deckId: 3 , status :"Don't know"},
    { id: 46, question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", deckId: 3 , status :"Don't know"},
    { id: 47, question: "Which civilization built Machu Picchu?", answer: "Inca", deckId: 3 , status :"Don't know"},
    { id: 48, question: "Who was the first man on the moon?", answer: "Neil Armstrong", deckId: 3 , status :"Don't know"},
    { id: 49, question: "In which year did the Soviet Union collapse?", answer: "1991", deckId: 3 , status :"Don't know"},
    { id: 50, question: "What document was signed in 1215 in England?", answer: "Magna Carta", deckId: 3 , status :"Don't know"},
    ];    
//todo : get decks from category id
export function getDecksByCategory(categoryId: number): Deck[] {  

        return allDecks.filter((deck) => deck.categoryId === categoryId);
     }
//todo : get cards from deck id
export function getCardsByDeck(deckId: number): Card[] {
    return allCards.filter((card) => card.deckId === deckId);
}
//todo : get category from category id
export function getCategoryById(categoryId: number): Category | undefined {
    return allCategories.find((cat) => cat.id === categoryId);
}
//todo : get category from deck id
export function getCategoryFromDeck(deckId: number): Category | string {
    const deck = allDecks.find((d) => d.id === deckId);
    if (!deck) return "Unknown Category";
    return getCategoryById(deck.categoryId) || "Unknown Category";
}
export function getCategoryNameFromDeck(deckId: number): string {
    const category = getCategoryFromDeck(deckId);
    if (typeof category === "string") return category;
    return category.name;
}
export function createDeck(deck: Deck): Deck {

    allDecks.push(deck);
    return deck;
}
export function deleteDeck(deckId: number): void {
    const index = allDecks.findIndex((d) => d.id === deckId);
    if (index !== -1) {
        allDecks.splice(index, 1);
    }
}
export function createCategory(name: string): Category {
    const newCategory = { id: Date.now(), name, decks: 0, cards: 0, active: false, proficiency: 0 };
    allCategories.push(newCategory);
    return newCategory;
}
export function deleteCategory(categoryId: number): void {
    const index = allCategories.findIndex((c) => c.id === categoryId);
    if (index !== -1) {
        allCategories.splice(index, 1);
    }
}
export function createCard(card: Card): Card {
    allCards.push(card);
    return card;
}
export function updateCardStatus(cardId: number, status: string): void {
    const index = allCards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
        allCards[index] = { ...allCards[index], status };
    }
}
export function deleteCard(cardId: number): void {
    const index = allCards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
        allCards.splice(index, 1);
    }
}
export function pushADeck(cards : Card[], deck: Deck): void {   
    const newDeck = createDeck(deck);
    cards.forEach((card) => {
        createCard({ ...card, deckId: newDeck.id });
    });
}
export function getNameOfDeck(deckId: number): string {
    const deck = allDecks.find((d) => d.id === deckId);
    return deck ? deck.name : "";
}
export function getCategoryName(deckId: number): string {
    const deck = allDecks.find((d) => d.id === deckId);
    if (!deck) return "Unknown Category";
    const category = getCategoryById(deck.categoryId);
    return category ? category.name : "Unknown Category";
}

export function updateDeckLastActive(deckId: number): void {
    const index = allDecks.findIndex((deck) => deck.id === deckId);
    if (index !== -1) {
        allDecks[index] = { ...allDecks[index], lastActive: Date.now() };
    }
}

export function getRecentDecks(limit = 8): Deck[] {
    return [...allDecks]
        .sort((a, b) => b.lastActive - a.lastActive)
        .slice(0, limit);
}