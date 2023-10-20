import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FIND_USER } from '../queries';
import BooksList from './BooksList';

const Recommendations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('library-user-token')) navigate('/');
  }, [navigate]);

  const userResult = useQuery(FIND_USER);

  if (userResult.loading || !userResult?.data?.me)
    return (
      <div>
        <h2>recommendations</h2>
        <div>loading...</div>
      </div>
    );

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
