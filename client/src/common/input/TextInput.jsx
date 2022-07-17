import React, { useCallback, useEffect, useState } from 'react';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';
import { EditableTextarea } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function TextInput(props) {
  const { isTextArea, size = 'sm', field, initialText = '', submitHandler } = props;
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (typeof initialText === 'undefined') {
      setText('');
    } else {
      setText(initialText);
    }
  }, [initialText]);

  /**
   * @description Handles Input value change
   * @param {string} newValue
   */
  const handleChange = useCallback(
    (newValue) => {
      if (newValue !== text) {
        setText(newValue);
      }
    },
    [text]
  );

  /**
   * @description Handles submit events
   * @param {string} valueToSubmit
   */
  const handleSubmit = useCallback(
    (valueToSubmit) => {
      // No need to update if it hasn't changed
      if (valueToSubmit === initialText) {
        return;
      }
      const cleanVal = valueToSubmit.trim();
      submitHandler(field, cleanVal);

      if (cleanVal !== valueToSubmit) {
        setText(cleanVal);
      }
    },
    [field, initialText, submitHandler]
  );

  return (
    <Editable
      size={size}
      defaultValue={text}
      onChange={(value) => handleChange(value)}
      onSubmit={(value) => handleSubmit(value)}
      data-testid='editable-wrapper'
    >
      <EditablePreview style={{ width: '100%' }} data-testid='editable-preview' />
      {isTextArea ? (
        <EditableTextarea data-testid='editable-textarea' />
      ) : (
        <EditableInput data-testid='editable-input' />
      )}
    </Editable>
  );
}

TextInput.propTypes = {
  isTextArea: PropTypes.bool,
  size: PropTypes.string,
  field: PropTypes.string.isRequired,
  initialText: PropTypes.string,
  submitHandler: PropTypes.func,
};
