import { useNavigate } from 'react-router-dom';

const NavMenu = () => {
  const navigate = useNavigate();
  const login = localStorage.getItem('library-user-token');

  const doLogout = () => {
    localStorage.removeItem('library-user-token');
    navigate('login');
  };

  return (
    <div>
      <button onClick={() => navigate('/')}>authors</button>
      <button onClick={() => navigate('books')}>books</button>
      {login ? (
        <button onClick={() => navigate('add')}>add book</button>
      ) : (
        <></>
      )}
      {login ? (
        <button onClick={() => navigate('recommend')}>recommend</button>
      ) : (
        <></>
      )}
      {login ? (
        <button onClick={doLogout}>log out</button>
      ) : (
        <button onClick={() => navigate('login')}>log in</button>
      )}
    </div>
  );
};

export default NavMenu;
