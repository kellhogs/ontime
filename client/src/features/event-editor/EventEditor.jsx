import React from 'react';
import { Button, IconButton } from '@chakra-ui/button';
import { Input } from '@chakra-ui/react';

import style from './EventEditor.module.scss';

export default function EventEditor() {
  return (
    <div className={style.eventEditorMenu}>
      <div>
        <div className={style.inline}>
          <label>Start Time</label>
          <IconButton size='sm' />
          <Input size='sm' />
        </div>
        <div className={style.inline}>
          <label>End time</label>
          <IconButton size='sm' />
          <Input size='sm' />
        </div>
        <div className={style.inline}>
          <label>Duration</label>
          <IconButton size='sm' />
          <Input size='sm' />
        </div>
        <div>
          <Button>Is Public</Button>
        </div>
      </div>
      <div>
        <div className={style.inline}>
          <label>Colour</label>
          <Input size='sm' type='color' />
          <label>Title</label>
          <Input size='sm' />
        </div>
        <div className={style.inline}>
          <label>Subtitle</label>
          <Input size='sm' />
        </div>
        <div className={style.inline}>
          <label>Presenter</label>
          <Input size='sm' />
        </div>
        <div className={style.inline}>
          <label>Notes</label>
          <Input size='sm' />
        </div>
        <div>OSC</div>
      </div>
    </div>
  );
}
