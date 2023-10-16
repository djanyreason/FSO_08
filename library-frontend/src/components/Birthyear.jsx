import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_BIRTH, ALL_AUTHORS } from '../queries';

const Birthyear = () => {
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  const [updateBirth, result] = useMutation(UPDATE_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      window.alert(messages);
    }
  });

  const submit = async (event) => {
    event.preventDefault();

    const variables = { name: author, setBornTo: parseInt(year) };

    updateBirth({ variables });
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      window.alert(`Author ${author} not found`);
    } else if (!result.loading && !result.error) {
      setAuthor('');
      setYear('');
    }
  }, [result.data, result.loading, result.error]);

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={author}
            onChange={({ target }) => {
              setAuthor(target.value);
            }}
          />
        </div>
        <div>
          born
          <input
            type='number'
            value={year}
            onChange={({ target }) => {
              setYear(target.value);
            }}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  );
};

export default Birthyear;
