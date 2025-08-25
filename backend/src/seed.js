const { initDb } = require('./db');
const { v4: uuidv4 } = require('uuid');
const db = initDb();

function seed() {
  const deckId = uuidv4();
  db.prepare('INSERT INTO decks (id,title,description,language_from,language_to,is_public) VALUES (?,?,?,?,?,?)')
    .run(deckId, 'Starter English-French', 'Sample deck', 'en', 'fr', 1);

  const cards = [
    { front: 'Hello', back: 'Bonjour' },
    { front: 'Thank you', back: 'Merci' },
    { front: 'Goodbye', back: 'Au revoir' }
  ];
  const insert = db.prepare('INSERT INTO cards (id,deck_id,front,back) VALUES (?,?,?,?)');
  for (const c of cards) {
    insert.run(uuidv4(), deckId, c.front, c.back);
  }
  console.log('Seeded sample deck:', deckId);
}

seed();
