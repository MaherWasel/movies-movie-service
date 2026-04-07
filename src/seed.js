const firestore = require('./services/firestore');
const logger = require('./logger');

const SEED_MOVIES = [
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: ['Drama'],
    director: 'Frank Darabont',
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'The Godfather',
    year: 1972,
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    plot: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    plot: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'Pulp Fiction',
    year: 1994,
    genre: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'Inception',
    year: 2010,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Christopher Nolan',
    plot: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'Interstellar',
    year: 2014,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    director: 'Christopher Nolan',
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'The Matrix',
    year: 1999,
    genre: ['Action', 'Sci-Fi'],
    director: 'Lana Wachowski, Lilly Wachowski',
    plot: 'A computer programmer discovers that reality as he knows it is a simulation created by machines.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDL._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'Parasite',
    year: 2019,
    genre: ['Comedy', 'Drama', 'Thriller'],
    director: 'Bong Joon Ho',
    plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'Fight Club',
    year: 1999,
    genre: ['Drama'],
    director: 'David Fincher',
    plot: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
  {
    title: 'Whiplash',
    year: 2014,
    genre: ['Drama', 'Music'],
    director: 'Damien Chazelle',
    plot: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRhLWIwOWMtYjI3M2I0OWFmNjE3XkEyXkFqcGc@._V1_.jpg',
    rating: 0,
    reviewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  },
];

async function seedMovies() {
  const collection = firestore.collection('movies');
  const snapshot = await collection.limit(1).get();

  if (!snapshot.empty) {
    logger.info('Movies collection already has data — skipping seed');
    return;
  }

  logger.info(`Seeding ${SEED_MOVIES.length} movies...`);
  const batch = firestore.batch();

  for (const movie of SEED_MOVIES) {
    const ref = collection.doc();
    batch.set(ref, {
      ...movie,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await batch.commit();
  logger.info('Seed complete');
}

// Allow running as standalone script or as import
if (require.main === module) {
  seedMovies()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error({ err }, 'Seed failed');
      process.exit(1);
    });
}

module.exports = { seedMovies };
