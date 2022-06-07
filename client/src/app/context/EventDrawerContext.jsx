import React, { createContext, useCallback, useState } from 'react';

export const EventDrawerContext = createContext({
  isOpen: false,
  toggleOpen: () => undefined,
});

export const EventDrawerProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  /**
   * @description Sets open state of event drawer element
   * @param {boolean | undefined} newValue
   */
  const toggleOpen = useCallback((newValue) => {
    if (typeof newValue === 'undefined') {
      setOpen((prev) => !prev);
    } else {
      setOpen(newValue);
    }
  }, []);

  return (
    <EventDrawerContext.Provider
      value={{
        isOpen,
        toggleOpen,
      }}
    >
      {children}
    </EventDrawerContext.Provider>
  );
};
