import { createContext, useContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Create the provider component
const AppContextProvider = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [token, setToken] = useState("");

  const updateSignedIn = (sign) => setSignedIn(sign);
  const updateEmail = (email) => setEmail(email);
  const updateMnemonic = (mnemonic) => setMnemonic(mnemonic);
  const updateToken = (token) => setToken(token);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Optional: Create a custom hook
const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext};
