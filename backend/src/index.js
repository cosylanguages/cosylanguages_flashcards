const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const decksRouter = require('./routes/decks');
const studyRouter = require('./routes/study');
const { router: authRouter, requireAuth } = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// initialize DB
const db = initDb();

// attach db to req
app.use((req, res, next) => { req.db = db; next(); });


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/decks', requireAuth, decksRouter);
app.use('/api/v1/study', requireAuth, studyRouter);

app.get('/', (req, res) => res.send('Cosy Flashcards backend is running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
