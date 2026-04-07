const { Router } = require('express');
const firestore = require('../services/firestore');
const logger = require('../logger');

const router = Router();

// GET /movies — list all movies
router.get('/', async (req, res) => {
  try {
    const snapshot = await firestore.collection('movies').orderBy('title').get();
    const movies = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ movies });
  } catch (err) {
    logger.error({ err }, 'Failed to list movies');
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET /movies/:id — get a single movie
router.get('/:id', async (req, res) => {
  try {
    const doc = await firestore.collection('movies').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    logger.error({ err }, 'Failed to get movie');
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

module.exports = router;
