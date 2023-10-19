import { useQuery } from '@apollo/client';
import { FIND_USER } from '../queries';
import BooksList from './BooksList';

const Recommendations = () => {
  const userResult = useQuery(FIND_USER);

  if (userResult.loading)
    return (
      <div>
        <h2>recommendations</h2>
        <div>loading...</div>
      </div>
    );

  console.log(userResult);
  const genre = userResult.data.me.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{genre}</strong>
      <BooksList genre={genre} />
    </div>
  );
};

export default Recommendations;
