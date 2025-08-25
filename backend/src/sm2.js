/**
 * SM-2 implementation (server-side).
 * review: { repetition, interval_days, easiness }
 * quality: 0..5
 * returns updated review object with new interval_days, repetition, easiness, due_at, last_reviewed
 */
function sm2Step(review, quality) {
  if (!review) {
    review = { repetition: 0, interval_days: 0, easiness: 2.5 };
  }
  if (quality < 3) {
    review.repetition = 0;
    review.interval_days = 1;
  } else {
    review.repetition = (review.repetition || 0) + 1;
    if (review.repetition === 1) review.interval_days = 1;
    else if (review.repetition === 2) review.interval_days = 6;
    else review.interval_days = Math.round((review.interval_days || 1) * (review.easiness || 2.5));
  }
  // update easiness
  const newEase = (review.easiness || 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  review.easiness = newEase < 1.3 ? 1.3 : newEase;
  // due_at and last_reviewed ISO strings
  const now = new Date();
  const due = new Date(now);
  due.setDate(due.getDate() + (review.interval_days || 0));
  review.due_at = due.toISOString();
  review.last_reviewed = now.toISOString();
  return review;
}

module.exports = { sm2Step };
