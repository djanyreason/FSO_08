import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN, FIND_USER } from '../queries';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
      window.alert(error.graphQLErrors[0].message);
    },
    update: (cache, response) => {
      const meCache = cache.readQuery({ query: FIND_USER });

      if (meCache) {
        const result = cache.evict({ id: `User:${meCache.me.id}` });
      }
    }
  });

  useEffect(() => {
    //    console.log('Effect', result);
    if (result.data) {
      const token = result.data.login.value;
      localStorage.setItem('library-user-token', token);
      navigate('..');
    }
  }, [result.data, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    await login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
