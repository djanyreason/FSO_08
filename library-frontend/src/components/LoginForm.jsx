import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN, FIND_USER } from '../queries';
import { useLoginDispatch } from '../contexts/LoginContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useLoginDispatch();
  const navigate = useNavigate();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
      window.alert(error.graphQLErrors[0].message);
    },
    refetchQueries: [{ query: FIND_USER }]
    /*    update: (cache, response) => {
      let meObj = cache.readQuery({ query: FIND_USER });
      console.log(meObj);
      if (meObj) {
        cache.evict({ id: meObj.me.id });
        console.log(cache.readQuery({ query: FIND_USER }));
      }
    }*/
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      dispatch({ type: 'LOGIN', payload: { token } });
      localStorage.setItem('library-user-token', token);
      navigate('..');
    }
  }, [result.data]);

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
