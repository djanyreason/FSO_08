import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  CREATE_BOOK,
  ALL_AUTHORS,
  ALL_BOOKS,
  ALL_GENRES,
  BOOKS_BY_GENRE
} from '../queries';

const NewBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook, result] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS },
      { query: ALL_GENRES }
    ],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      window.alert(messages);
    },
    update: (cache, response) => {
      console.log(cache, response);
    }
  });

  const submit = async (event) => {
    event.preventDefault();

    const variables = {
      title,
      author,
      genres,
      published: parseInt(published)
    };

    addBook({
      variables
    });
  };

  useEffect(() => {
    if (!result.loading && !result.error) {
      setTitle('');
      setPublished('');
      setAuthor('');
      setGenres([]);
      setGenre('');
    }
  }, [result.loading, result.error]);

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  );
};

export default NewBook;
