import React, { createContext, useCallback, useState } from 'react';

export const EventEditorContext = createContext({
  isOpen: false,
  toggleOpen: () => undefined,
});

export const EventEditorProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  /**
   * @description Sets open state of event editor element
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
    <EventEditorContext.Provider
      value={{
        isOpen,
        toggleOpen,
      }}
    >
      {children}
    </EventEditorContext.Provider>
  );
};
