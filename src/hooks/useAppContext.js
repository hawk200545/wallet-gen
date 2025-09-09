import { useContext, createContext } from "react";

export const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

export default useAppContext;
