import { Routes, Route } from 'react-router-dom';
import { useSubscription, useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import NavMenu from './components/NavMenu';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recomendations';
import { BOOK_ADDED, ALL_BOOKS, BOOKS_BY_GENRE } from './queries';

const updateBookCache = (cache, query, addedBook) => {
  const uniqByTitle = (books) => {
    let seen = new Set();
    return books.filter((book) => {
      let name = book.title;
      return seen.has(name) ? false : seen.add(name);
    });
  };

  cache.updateQuery(query, (props) => {
    if (props?.allBooks) {
      return {
        allBooks: uniqByTitle(props.allBooks.concat(addedBook))
      };
    } else return undefined;
  });
};

export const doBookCacheUpdates = (cache, addedBook) => {
  updateBookCache(cache, { query: ALL_BOOKS }, addedBook);
  addedBook.genres.map((genre) =>
    updateBookCache(
      cache,
      { query: BOOKS_BY_GENRE, variables: { genre } },
      addedBook
    )
  );
};

const App = () => {
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;

      doBookCacheUpdates(client.cache, addedBook);
    }
  });

  return (
    <div>
      <NavMenu />
      <Routes>
        <Route path='/recommend' element={<Recommendations />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/add' element={<NewBook />} />
        <Route path='/books' element={<Books />} />
        <Route path='/' element={<Authors />} />
      </Routes>
    </div>
  );
};

export default App;
