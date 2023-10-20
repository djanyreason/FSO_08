import { useQuery } from '@apollo/client';
import { BOOKS_BY_GENRE, ALL_BOOKS } from '../queries';

const BooksList = ({ genre }) => {
  const query = genre === 'all genres' ? ALL_BOOKS : BOOKS_BY_GENRE;
  const variables = genre === 'all genres' ? {} : { variables: { genre } };
  const result = useQuery(query, variables);

  if (result.loading)
    return (
      <div>
        <h2>books</h2>
        <div>loading...</div>
      </div>
    );

  const books = result.data.allBooks;

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BooksList;
