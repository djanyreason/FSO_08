import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_BOOKS } from '../queries';

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState('all genres');

  if (result.loading)
    return (
      <div>
        <h2>books</h2>
        <div>loading...</div>
      </div>
    );
  const books = result.data.allBooks;

  const genres = [
    ...new Set(books.reduce((joined, book) => joined.concat(book.genres), [])),
    'all genres'
  ];

  return (
    <div>
      <h2>books</h2>
      in {genre === 'all genres' ? '' : 'genre'} <strong>{genre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter(
              (b) => genre === 'all genres' || b.genres.indexOf(genre) >= 0
            )
            .map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
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
