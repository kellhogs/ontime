import React from 'react';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import style from './EventDrawer.module.scss';

const drawerProps = {
  placement: 'bottom',
  size: 'md',
  blockScrollOnMount: false,
  trapFocus: false
};

export default function EventDrawer(props) {
  const { isOpen, onClose } = props;
  return (
    <Drawer onClose={onClose} isOpen={isOpen} className={style.eventDrawer} {...drawerProps}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
        <DrawerBody>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

EventDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
