import React from 'react';
import { Box } from '@chakra-ui/layout';
import { FiX } from '@react-icons/all-files/fi/FiX';

import ErrorBoundary from '../../common/components/errorBoundary/ErrorBoundary';
import { handleLinks } from '../../common/utils/linkUtils';

import EventEditor from './EventEditor';

import style from '../editors/Editor.module.scss';

export default function InfoExport() {
  return (
    <Box className={style.eventEditor}>
      <h1>Event Editor</h1>
      <FiX className={style.corner} onClick={(event) => handleLinks(event, 'info')} />
      <div className={style.content}>
        <ErrorBoundary>
          <EventEditor />
        </ErrorBoundary>
      </div>
    </Box>
  );
}
