import { Routes, Route } from 'react-router-dom';
import { useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import NavMenu from './components/NavMenu';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recomendations';
import { BOOK_ADDED } from './queries';

const App = () => {
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
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
