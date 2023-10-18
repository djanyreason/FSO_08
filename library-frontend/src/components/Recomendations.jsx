import { useQuery } from '@apollo/client';
import { ALL_BOOKS, FIND_USER } from '../queries';
import BooksList from './BooksList';

const Recommendations = () => {
  const booksResult = useQuery(ALL_BOOKS);
  const userResult = useQuery(FIND_USER);

  if (booksResult.loading || userResult.loading)
    return (
      <div>
        <h2>recommendations</h2>
        <div>loading...</div>
      </div>
    );

  console.log(userResult);
  const genre = userResult.data.me.favoriteGenre;
  const books = booksResult.data.allBooks.filter(
    (b) => b.genres.indexOf(genre) >= 0
  );

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{genre}</strong>
      <BooksList books={books} />
    </div>
  );
};

export default Recommendations;
