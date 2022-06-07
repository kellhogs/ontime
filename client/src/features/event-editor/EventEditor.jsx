import React from 'react';
import { Input } from '@chakra-ui/react';

import style from './EventEditor.module.scss';

export default function EventEditor() {
  return (
    <div className={style.eventEditor}>
      <div>
        <label>Title</label>
        <Input />
      </div>
      <div>
        <label>Subtitle</label>
        <Input />
      </div>
      <div>
        <label>Presenter</label>
        <Input />
      </div>
      <div>
        <label>Notes</label>
        <Input />
      </div>
    </div>
  );
}