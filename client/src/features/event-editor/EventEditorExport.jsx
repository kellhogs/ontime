import React, { useContext } from 'react';
import { IconButton } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { FiX } from '@react-icons/all-files/fi/FiX';

import { EventEditorContext } from '../../app/context/EventEditorContext';
import ErrorBoundary from '../../common/components/errorBoundary/ErrorBoundary';

import EventEditor from './EventEditor';

import style from '../editors/Editor.module.scss';

/* Styling for action buttons */
const closeBtnStyle = {
  size: 'md',
  variant: 'ghost',
  colorScheme: 'white',
  _hover: { bg: '#ebedf0', color: '#333' },
};

export default function InfoExport() {
  const { setOpenId } = useContext(EventEditorContext);

  return (
    <Box className={style.eventEditor}>
      <ErrorBoundary>
        <div className={style.header}>
          <h1>Event Editor</h1>
          <IconButton
            aria-label='Close Menu'
            icon={<FiX />}
            onClick={() => setOpenId(null)}
            {...closeBtnStyle}
          />
        </div>
        <div className={style.content}>
          <EventEditor />
        </div>
      </ErrorBoundary>
    </Box>
  );
}
