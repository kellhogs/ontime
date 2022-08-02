import React, { lazy, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box } from '@chakra-ui/layout';
import ErrorBoundary from 'common/components/errorBoundary/ErrorBoundary';
import ModalManager from 'features/modals/ModalManager';
import { useAtom } from 'jotai';

import { editorEventId } from '../../app/atoms/eventStore';
import { LocalEventSettingsProvider } from '../../app/context/LocalEventSettingsContext';
import { LoggingProvider } from '../../app/context/LoggingContext';
import MenuBar from '../menu/MenuBar';

import styles from './Editor.module.scss';

const EventList = lazy(() => import('features/editors/list/EventListExport'));
const TimerControl = lazy(() => import('features/control/playback/TimerControlExport'));
const MessageControl = lazy(() => import('features/control/message/MessageControlExport'));
const Info = lazy(() => import('features/info/InfoExport'));
const EventEditor = lazy(() => import('features/event-editor/EventEditorExport'));

export default function Editor() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openId] = useAtom(editorEventId);

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
        </div>
        {openId && <EventEditor />}
      </LocalEventSettingsProvider>
    </LoggingProvider>
  );
}
