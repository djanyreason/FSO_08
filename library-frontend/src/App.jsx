import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import NavMenu from './components/NavMenu';

const App = () => {
  const [page, setPage] = useState('authors');

  return (
    <div>
      <NavMenu />
      <Routes>
        <Route path='/add' element={<NewBook />} />
        <Route path='/books' element={<Books />} />
        <Route path='/' element={<Authors />} />
      </Routes>
    </div>
  );
};

export default App;
