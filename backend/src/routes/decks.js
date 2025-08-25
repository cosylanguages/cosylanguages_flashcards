const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create deck
router.post('/', async (req, res) => {
  const prisma = req.db;
  const { name, description } = req.body;
  try {
    const deck = await prisma.deck.create({
      data: {
        name: name || 'Untitled',
        description: description || '',
        ownerId: req.userId
      }
    });
    res.json(deck);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create deck', details: e.message });
  }
});

// List decks
router.get('/', async (req, res) => {
  const prisma = req.db;
  try {
    const decks = await prisma.deck.findMany({ where: { ownerId: req.userId } });
    res.json(decks);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list decks', details: e.message });
  }
});

// Get deck with cards (and media)
router.get('/:id', async (req, res) => {
  const prisma = req.db;
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: Number(req.params.id), ownerId: req.userId },
      include: { cards: { include: { media: true } } }
    });
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json(deck);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get deck', details: e.message });
  }
});

// Add card
router.post('/:id/cards', async (req, res) => {
  const prisma = req.db;
  const deckId = Number(req.params.id);
  const { front, back, mediaUrl } = req.body;
  try {
    let media = null;
    if (mediaUrl) {
      media = await prisma.media.create({ data: { url: mediaUrl, type: 'external', uploadedById: req.userId } });
    }
    const card = await prisma.card.create({
      data: {
        front,
        back,
        deckId,
        mediaId: media ? media.id : undefined
      }
    });
    res.json(card);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add card', details: e.message });
  }
});

module.exports = router;
