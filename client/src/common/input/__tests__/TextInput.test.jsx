import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextInput from '../TextInput';

describe('TextInput component', () => {
  describe('when given props', () => {
    it('renders correctly', () => {
      const testField = 'test';
      const testText = 'Test 123';
      render(<TextInput field={testField} initialText={testText} />);
      expect(screen.getByTestId('editable-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('editable-preview')).toBeInTheDocument();
      expect(screen.getByText(testText)).toBeInTheDocument();

      const input = screen.getByTestId('editable-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(testText);
    });

    it('Handles renders as textarea', () => {
      const testField = 'test';
      render(<TextInput field={testField} isTextArea />);
      expect(screen.getByTestId('editable-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('editable-preview')).toBeInTheDocument();

      const input = screen.getByTestId('editable-textarea');
      expect(input).toBeInTheDocument();
    });
  });

  describe('on status change', () => {
    it('calls submitHandler on new value', async () => {
      const testField = 'test';
      const testText = 'Test 123';
      const myTypedString = '456';
      const expectedString = testText + myTypedString;
      const submitHandler = jest.fn();
      render(<TextInput field={testField} initialText={testText} submitHandler={submitHandler} />);

      const input = screen.getByTestId('editable-input');

      // submit without changing value
      await userEvent.type(input, '{enter}');
      expect(submitHandler).not.toHaveBeenCalled();

      // on new value we can submit
      await userEvent.type(input, myTypedString);
      expect(input).toHaveValue(expectedString);
      await userEvent.type(input, '{enter}');
      expect(submitHandler).toHaveBeenCalledWith(testField, expectedString);
    });

    it('cleans value before submitting', async () => {
      const testField = 'test';
      const myTypedString = '                456          ';
      const expectedString = '456';
      const submitHandler = jest.fn();
      render(<TextInput field={testField} submitHandler={submitHandler} />);

      const input = screen.getByTestId('editable-input');

      // on new value we can submit
      await userEvent.type(input, myTypedString);
      expect(input).toHaveValue(myTypedString);
      await userEvent.type(input, '{enter}');
      expect(submitHandler).toHaveBeenCalledWith(testField, expectedString);
    });
  });

  describe('handles edge cases', () => {
    it('handles number values', () => {
      const testField = 'test';
      const testText = 123;
      render(<TextInput field={testField} initialText={testText} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(`${testText}`);
    });
    it('handles null value', () => {
      const testField = 'test';
      const testText = null;
      const expected = '';
      render(<TextInput field={testField} initialText={testText} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(expected);
    });
    it('handles undefined value', () => {
      const testField = 'test';
      const expected = '';
      render(<TextInput field={testField} />);
      const input = screen.getByTestId('editable-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(expected);
    });
  });
});