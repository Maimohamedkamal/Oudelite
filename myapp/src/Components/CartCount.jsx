import { createContext, useState } from "react";

export const CartCount = createContext();

export default function CartCountProvider({ children }) {
  let countnum=localStorage.getItem('count')
  const [Count, setCount] = useState(countnum);

  return (
    <CartCount.Provider value={{ Count, setCount }}>
      {children}
    </CartCount.Provider>
  );
}