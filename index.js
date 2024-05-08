import React, {createContext, useState} from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const login = userData => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <StoreContext.Provider value={{user, login, logout}}>
      {children}
    </StoreContext.Provider>
  );
};
