package com.flashcard.backend.service;

import com.flashcard.backend.model.Card;
import com.flashcard.backend.model.Category;
import com.flashcard.backend.model.Deck;
import com.flashcard.backend.model.User;
import com.flashcard.backend.repository.CardRepository;
import com.flashcard.backend.repository.CategoryRepository;
import com.flashcard.backend.repository.DeckRepository;
import com.flashcard.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MockDataSeeder implements CommandLineRunner {
    private static final String TARGET_CLIENT_SEED = "073b1b16-2aec-4d82-aea0-9090ed06a9c6";
    private static final String DEFAULT_CARD_STATUS = "new";
    private static final List<CategorySeed> SEED_DATA = buildSeedData();

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;

    public MockDataSeeder(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            DeckRepository deckRepository,
            CardRepository cardRepository
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
    }

    @Override
    public void run(String... args) {
        User user = userRepository.findByClientSeed(TARGET_CLIENT_SEED);
        if (user == null) {
            User newUser = new User();
            newUser.setClientSeed(TARGET_CLIENT_SEED);
            user = userRepository.save(newUser);
        }

        for (CategorySeed categorySeed : SEED_DATA) {
            Category category = findOrCreateCategory(user, categorySeed.name);
            for (DeckSeed deckSeed : categorySeed.decks) {
                Deck deck = findOrCreateDeck(user.getId(), category, deckSeed.name);
                ensureCardsForDeck(user.getId(), deck, deckSeed.cards);
            }
        }
    }

    private Category findOrCreateCategory(User user, String categoryName) {
        List<Category> categories = categoryRepository.getCategoriesByUser_Id(user.getId());
        for (Category category : categories) {
            if (categoryName.equals(category.getName())) {
                return category;
            }
        }

        Category category = new Category();
        category.setName(categoryName);
        category.setUser(user);
        return categoryRepository.save(category);
    }

    private Deck findOrCreateDeck(Long userId, Category category, String deckName) {
        List<Deck> decks = deckRepository.getAllByCategory_IdAndCategory_User_Id(category.getId(), userId);
        for (Deck deck : decks) {
            if (deckName.equals(deck.getName())) {
                return deck;
            }
        }

        Deck deck = new Deck();
        deck.setName(deckName);
        deck.setCategory(category);
        return deckRepository.save(deck);
    }

        private void ensureCardsForDeck(Long userId, Deck deck, List<CardSeed> cardSeeds) {
        List<Card> existingCards = cardRepository.getCardsByDeck_Category_User_IdAndDeck_Id(userId, deck.getId());
        Set<String> existingQuestions = existingCards.stream()
            .map(Card::getQuestion)
            .collect(Collectors.toSet());

        for (CardSeed cardSeed : cardSeeds) {
            if (existingQuestions.contains(cardSeed.question)) {
            continue;
            }
            Card card = new Card();
            card.setDeck(deck);
            card.setStatus(DEFAULT_CARD_STATUS);
            card.setQuestion(cardSeed.question);
            card.setAnswer(cardSeed.answer);
            cardRepository.save(card);
        }
    }

        private static List<CategorySeed> buildSeedData() {
        return List.of(
            new CategorySeed("English", List.of(
                new DeckSeed("Daily Conversation", List.of(
                    new CardSeed("How do you greet someone in the morning?", "Good morning."),
                    new CardSeed("How do you ask someone if they are okay?", "Are you okay?"),
                    new CardSeed("How do you respond to 'Thank you'?", "You are welcome."),
                    new CardSeed("How do you politely ask for repetition?", "Could you say that again?"),
                    new CardSeed("How do you ask for directions?", "Excuse me, where is ...?"),
                    new CardSeed("How do you ask the time?", "What time is it?"),
                    new CardSeed("How do you say goodbye casually?", "See you later."),
                    new CardSeed("How do you ask for help?", "Can you help me, please?"),
                    new CardSeed("How do you agree in conversation?", "I agree."),
                    new CardSeed("How do you disagree politely?", "I am not sure I agree.")
                )),
                new DeckSeed("Business Email", List.of(
                    new CardSeed("What is a formal email opening?", "Dear [Name],"),
                    new CardSeed("How do you state email purpose briefly?", "I am writing to..."),
                    new CardSeed("How do you request a meeting?", "Could we schedule a meeting?"),
                    new CardSeed("How do you attach a file politely?", "Please find the attachment."),
                    new CardSeed("How do you ask for confirmation?", "Please confirm receipt."),
                    new CardSeed("How do you follow up on pending work?", "I am following up on..."),
                    new CardSeed("How do you close an email professionally?", "Best regards,"),
                    new CardSeed("How do you mention a deadline?", "The deadline is [date]."),
                    new CardSeed("How do you apologize for delay?", "I apologize for the delay."),
                    new CardSeed("How do you thank a colleague in email?", "Thank you for your support.")
                )),
                new DeckSeed("Travel Phrases", List.of(
                    new CardSeed("How do you ask airport check-in counter location?", "Where is the check-in counter?"),
                    new CardSeed("How do you ask taxi fare estimate?", "How much is the fare?"),
                    new CardSeed("How do you ask for hotel check-in?", "I have a reservation under [name]."),
                    new CardSeed("How do you ask if card payment is accepted?", "Do you accept credit cards?"),
                    new CardSeed("How do you ask for local recommendation?", "What places do you recommend?"),
                    new CardSeed("How do you ask where the restroom is?", "Where is the restroom?"),
                    new CardSeed("How do you ask for menu recommendation?", "What do you recommend here?"),
                    new CardSeed("How do you ask for Wi-Fi password?", "What is the Wi-Fi password?"),
                    new CardSeed("How do you ask to split bill?", "Can we split the bill?"),
                    new CardSeed("How do you ask emergency help?", "Please call an ambulance.")
                ))
            )),
            new CategorySeed("Computer Science", List.of(
                new DeckSeed("Java Basics", List.of(
                    new CardSeed("What keyword creates a class in Java?", "class"),
                    new CardSeed("What method is the Java entry point?", "public static void main(String[] args)"),
                    new CardSeed("What keyword is used for inheritance?", "extends"),
                    new CardSeed("What keyword creates an object?", "new"),
                    new CardSeed("What is JVM short for?", "Java Virtual Machine"),
                    new CardSeed("Which collection stores unique values?", "Set"),
                    new CardSeed("What does final mean for a variable?", "Its value cannot be reassigned."),
                    new CardSeed("What does interface define?", "A contract of methods without implementation details."),
                    new CardSeed("What exception type is checked at compile time?", "Checked exception"),
                    new CardSeed("What does @Override indicate?", "A method overrides a parent method.")
                )),
                new DeckSeed("Database Essentials", List.of(
                    new CardSeed("SQL command to read data?", "SELECT"),
                    new CardSeed("SQL command to insert a row?", "INSERT"),
                    new CardSeed("What does WHERE clause do?", "Filters rows by condition."),
                    new CardSeed("What is a primary key?", "A unique identifier for each row."),
                    new CardSeed("What is a foreign key?", "A reference to a primary key in another table."),
                    new CardSeed("What does JOIN do?", "Combines rows from related tables."),
                    new CardSeed("What does index improve?", "Query performance."),
                    new CardSeed("What does transaction ACID guarantee?", "Reliable and consistent database operations."),
                    new CardSeed("Difference between DELETE and TRUNCATE?", "DELETE removes selected rows; TRUNCATE removes all rows quickly."),
                    new CardSeed("What is normalization?", "Organizing data to reduce redundancy.")
                )),
                new DeckSeed("Web API Concepts", List.of(
                    new CardSeed("HTTP method for reading data?", "GET"),
                    new CardSeed("HTTP method for creating resource?", "POST"),
                    new CardSeed("HTTP method for full update?", "PUT"),
                    new CardSeed("HTTP method for delete?", "DELETE"),
                    new CardSeed("What status code means success?", "200 OK"),
                    new CardSeed("What status code means created?", "201 Created"),
                    new CardSeed("What status code means not found?", "404 Not Found"),
                    new CardSeed("What status code means unauthorized?", "401 Unauthorized"),
                    new CardSeed("What is JSON used for in APIs?", "Data exchange format."),
                    new CardSeed("What is JWT used for?", "Stateless authentication token.")
                ))
            )),
            new CategorySeed("General Knowledge", List.of(
                new DeckSeed("World Capitals", List.of(
                    new CardSeed("Capital of Japan?", "Tokyo"),
                    new CardSeed("Capital of France?", "Paris"),
                    new CardSeed("Capital of Australia?", "Canberra"),
                    new CardSeed("Capital of Canada?", "Ottawa"),
                    new CardSeed("Capital of Germany?", "Berlin"),
                    new CardSeed("Capital of South Korea?", "Seoul"),
                    new CardSeed("Capital of Brazil?", "Brasilia"),
                    new CardSeed("Capital of Thailand?", "Bangkok"),
                    new CardSeed("Capital of Indonesia?", "Jakarta"),
                    new CardSeed("Capital of Vietnam?", "Hanoi")
                )),
                new DeckSeed("Human Body Basics", List.of(
                    new CardSeed("Which organ pumps blood?", "Heart"),
                    new CardSeed("Which organ helps us breathe?", "Lungs"),
                    new CardSeed("Largest human organ?", "Skin"),
                    new CardSeed("Bone that protects the brain?", "Skull"),
                    new CardSeed("What carries oxygen in blood?", "Red blood cells"),
                    new CardSeed("Where is food primarily digested?", "Small intestine"),
                    new CardSeed("What controls body movement and thought?", "Brain"),
                    new CardSeed("What is the normal body temperature in Celsius?", "Around 37 C"),
                    new CardSeed("What vitamin is produced from sunlight?", "Vitamin D"),
                    new CardSeed("What system fights infection?", "Immune system")
                )),
                new DeckSeed("Earth and Space", List.of(
                    new CardSeed("Planet known as the Red Planet?", "Mars"),
                    new CardSeed("Closest star to Earth?", "The Sun"),
                    new CardSeed("What causes day and night?", "Earth rotation"),
                    new CardSeed("What causes seasons?", "Earth tilt and orbit around the Sun"),
                    new CardSeed("Largest planet in our solar system?", "Jupiter"),
                    new CardSeed("Natural satellite of Earth?", "Moon"),
                    new CardSeed("What is the Milky Way?", "Our galaxy"),
                    new CardSeed("What protects Earth from harmful solar radiation?", "Magnetic field and atmosphere"),
                    new CardSeed("What is an eclipse?", "When one celestial body blocks another's light"),
                    new CardSeed("Approximate age of Earth?", "About 4.5 billion years")
                ))
            ))
        );
        }

        private static class CategorySeed {
        private final String name;
        private final List<DeckSeed> decks;

        private CategorySeed(String name, List<DeckSeed> decks) {
            this.name = name;
            this.decks = decks;
        }
        }

        private static class DeckSeed {
        private final String name;
        private final List<CardSeed> cards;

        private DeckSeed(String name, List<CardSeed> cards) {
            this.name = name;
            this.cards = cards;
        }
        }

        private static class CardSeed {
        private final String question;
        private final String answer;

        private CardSeed(String question, String answer) {
            this.question = question;
            this.answer = answer;
        }
        }
}
