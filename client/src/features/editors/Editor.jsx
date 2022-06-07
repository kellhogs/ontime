import React, { lazy, useContext, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box } from '@chakra-ui/layout';
import ErrorBoundary from 'common/components/errorBoundary/ErrorBoundary';
import ModalManager from 'features/modals/ModalManager';

import { EventDrawerContext } from '../../app/context/EventDrawerContext';
import { LocalEventSettingsProvider } from '../../app/context/LocalEventSettingsContext';
import { LoggingProvider } from '../../app/context/LoggingContext';
import EventDrawer from '../eventDrawer/EventDrawer';
import MenuBar from '../menu/MenuBar';

import styles from './Editor.module.scss';

const EventList = lazy(() => import('features/editors/list/EventListExport'));
const TimerControl = lazy(() => import('features/control/playback/TimerControlExport'));
const MessageControl = lazy(() => import('features/control/message/MessageControlExport'));
const Info = lazy(() => import('features/info/InfoExport'));

export default function Editor() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEventDrawerOpen, toggleOpen: setEventDrawerOpen } = useContext(EventDrawerContext);

  // Set window title
  useEffect(() => {
    document.title = 'ontime - Editor';
  }, []);

  return (
    <LoggingProvider>
      <LocalEventSettingsProvider>
        <ErrorBoundary>
          <ModalManager isOpen={isOpen} onClose={onClose} />
        </ErrorBoundary>
        <div className={styles.mainContainer}>
          <Box id='settings' className={styles.settings}>
            <ErrorBoundary>
              <MenuBar onOpen={onOpen} isOpen={isOpen} onClose={onClose} />
            </ErrorBoundary>
          </Box>
          <EventList />
          <MessageControl />
          <TimerControl />
          <Info />
          <EventDrawer isOpen={isEventDrawerOpen} onClose={() => setEventDrawerOpen(false)} />
        </div>
      </LocalEventSettingsProvider>
    </LoggingProvider>
  );
}
