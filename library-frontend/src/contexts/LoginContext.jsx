/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react';

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload.token;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

const LoginContext = createContext();

export const LoginContextProvider = (props) => {
  const [login, loginDispatch] = useReducer(loginReducer, null);

  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export const useLoginContent = () => {
  const CND = useContext(LoginContext);
  return CND[0];
};

export const useLoginDispatch = () => {
  const CND = useContext(LoginContext);
  return CND[1];
};

export default LoginContext;
