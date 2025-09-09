import { useState, useEffect } from "react";
import { AppContext } from "../hooks/useAppContext";

// Create the provider component
export const AppContextProvider = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      setSignedIn(true);
      localStorage.setItem('token', token);
    } else {
      setSignedIn(false);
      localStorage.removeItem('token');
    }
  }, [token]);

  const updateSignedIn = (sign) => setSignedIn(sign);
  const updateEmail = (email) => setEmail(email);
  const updateMnemonic = (mnemonic) => setMnemonic(mnemonic);
  const updateToken = (newToken) => setToken(newToken);

  const logoutHandle = () => {
    setToken('');
    setMnemonic('');
    setEmail('');
    setSignedIn(false);
    localStorage.removeItem('token');
    // Use navigate to redirect to the root path
    window.location.href = '/'; // Direct assignment for full page reload
  };

  

  return (
    <AppContext.Provider
      value={{
        signedIn,
        updateSignedIn,
        email,
        updateEmail,
        mnemonic,
        updateMnemonic,
        token,
        updateToken,
        logoutHandle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
