import React, { createContext, useCallback, useState } from 'react';

export const EventEditorContext = createContext({
  isOpen: false,
  toggleOpen: () => undefined,
});

export const EventEditorProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [openId, _setOpenId] = useState(null);

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

  const setOpenId = useCallback(
    (newValue) => {
      if (newValue === openId) {
        _setOpenId(null);
        setOpen(false);
      } else {
        _setOpenId(newValue);
        setOpen(newValue !== null);
      }
    },
    [openId]
  );

  return (
    <EventEditorContext.Provider
      value={{
        isOpen,
        toggleOpen,
        openId,
        setOpenId,
      }}
    >
      {children}
    </EventEditorContext.Provider>
  );
};
