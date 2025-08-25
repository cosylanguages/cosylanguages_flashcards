const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { sm2Step } = require('../sm2');
const router = express.Router();

// GET /study/queue?deckId=:deckId
router.get('/queue', (req, res) => {
  const db = req.db;
  const deckId = req.query.deckId;
  if (!deckId) return res.status(400).json({ error: 'deckId required' });
  const now = new Date().toISOString();
  // get due cards: join cards with reviews (left)
  const rows = db.prepare(`
    SELECT c.*, r.id as review_id, r.interval_days, r.repetition, r.easiness, r.due_at
    FROM cards c
    LEFT JOIN reviews r ON r.card_id = c.id
    WHERE c.deck_id = ?
  `).all(deckId);

  // determine due (if no review row, treat as due)
  const due = rows.filter(r => !r.due_at || r.due_at <= now).map(r => ({
    id: r.id,
    front: r.front,
    back: r.back,
    review_id: r.review_id,
    repetition: r.repetition,
    interval_days: r.interval_days,
    easiness: r.easiness
  }));
  res.json(due);
});

// POST /study/review
// body: { cardId, quality }
router.post('/review', async (req, res) => {
  const prisma = req.db;
  const { cardId, quality } = req.body;
  if (!cardId || typeof quality !== 'number') return res.status(400).json({ error: 'cardId and quality required' });
  try {
    let review = await prisma.review.findUnique({ where: { cardId } });
    const current = review ? {
      repetition: review.repetition,
      interval_days: review.intervalDays,
      easiness: review.easiness
    } : null;
    const newReview = sm2Step(current, quality);
    if (review) {
      review = await prisma.review.update({
        where: { cardId },
        data: {
          repetition: newReview.repetition,
          intervalDays: newReview.interval_days,
          easiness: newReview.easiness,
          dueAt: newReview.due_at,
          lastReviewed: newReview.last_reviewed
        }
      });
      res.json(Object.assign({ id: review.id, cardId }, newReview));
    } else {
      review = await prisma.review.create({
        data: {
          cardId,
          repetition: newReview.repetition,
          intervalDays: newReview.interval_days,
          easiness: newReview.easiness,
          dueAt: newReview.due_at,
          lastReviewed: newReview.last_reviewed
        }
      });
      res.json(Object.assign({ id: review.id, cardId }, newReview));
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to review card', details: e.message });
  }
});

module.exports = router;
