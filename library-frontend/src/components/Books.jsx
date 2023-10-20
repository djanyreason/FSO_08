import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_GENRES } from '../queries';
import BooksList from './BooksList';

const Books = () => {
  const result = useQuery(ALL_GENRES, { fetchPolicy: 'no-cache' });
  const [genre, setGenre] = useState('all genres');

  if (result.loading)
    return (
      <div>
        <h2>books</h2>
        <div>loading...</div>
      </div>
    );

  const genres = [
    ...new Set(
      result.data.allBooks.reduce(
        (joined, book) => joined.concat(book.genres),
        []
      )
    ),
    'all genres'
  ];

  return (
    <div>
      <h2>books</h2>
      in {genre === 'all genres' ? '' : 'genre'} <strong>{genre}</strong>
      <BooksList genre={genre} />
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)} autoFocus>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
