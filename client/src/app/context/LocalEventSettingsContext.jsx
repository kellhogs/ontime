import React, { createContext } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';

export const LocalEventSettingsContext = createContext({
  showQuickEntry: false,
  starTimeIsLastEnd: true,
  defaultPublic: true,

  setShowQuickEntry: () => undefined,
  setStarTimeIsLastEnd: () => undefined,
  setDefaultPublic: () => undefined,
});

export const LocalEventSettingsProvider = ({ children }) => {
  const [showQuickEntry, setShowQuickEntry] = useLocalStorage('settings-showQuickEntry', false);
  const [starTimeIsLastEnd, setStarTimeIsLastEnd] = useLocalStorage('settings-startTimeIsLastEnd', true);
  const [defaultPublic, setDefaultPublic] = useLocalStorage('settings-defaultPublic', false);

  return (
    <LocalEventSettingsContext.Provider
      value={{
        showQuickEntry,
        setShowQuickEntry,
        starTimeIsLastEnd,
        setStarTimeIsLastEnd,
        defaultPublic,
        setDefaultPublic,
      }}
    >
      {children}
    </LocalEventSettingsContext.Provider>
  );
};
