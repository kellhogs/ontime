import React, { useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { HStack } from '@chakra-ui/react';
import { FiCheck } from '@react-icons/all-files/fi/FiCheck';
import { IoRemove } from '@react-icons/all-files/io5/IoRemove';
import { IoReorderTwo } from '@react-icons/all-files/io5/IoReorderTwo';
import DelayInput from 'common/input/DelayInput';
import { millisToMinutes } from 'common/utils/dateConfig';
import PropTypes from 'prop-types';

import { useEventAction } from '../../../app/hooks/useEventAction';
import ActionButtons from '../../../common/components/buttons/ActionButtons';
import TooltipActionBtn from '../../../common/components/buttons/TooltipActionBtn';
import TooltipLoadingActionBtn from '../../../common/components/buttons/TooltipLoadingActionBtn';

import style from './DelayBlock.module.scss';

export default function DelayBlock(props) {
  const { data, index, actionHandler } = props;
  const { applyDelay, deleteEvent, updateEvent } = useEventAction();

  const applyDelayHandler = useCallback(() => {
    applyDelay(data.id)
  }, [data.id, applyDelay]);

  const deleteHandler = useCallback(() => {
    deleteEvent(data.id)
  }, [data.id, deleteEvent]);

  const delaySubmitHandler = useCallback((value) => {
    const newEvent = {
      id: data.id,
      duration: value * 60000
    }

    updateEvent(newEvent)
  }, [data.id, updateEvent]);


  const delayValue = data.duration != null ? millisToMinutes(data.duration) : undefined;

  return (
    <Draggable key={data.id} draggableId={data.id} index={index}>
      {(provided) => (
        <div className={style.delay} {...provided.draggableProps} ref={provided.innerRef}>
          <span className={style.drag} {...provided.dragHandleProps}>
            <IoReorderTwo />
          </span>
          <DelayInput className={style.input} value={delayValue} submitHandler={delaySubmitHandler} />
          <HStack spacing='4px' className={style.actionOverlay}>
            <TooltipActionBtn
              clickHandler={applyDelayHandler}
              icon={<FiCheck />}
              colorScheme='orange'
              tooltip='Apply delays'
              _hover={{ bg: 'orange.400' }}
            />
            <TooltipLoadingActionBtn
              clickHandler={deleteHandler}
              icon={<IoRemove />}
              colorScheme='red'
              tooltip='Delete'
              _hover={{ bg: 'red.400' }}
            />
            <ActionButtons showAdd actionHandler={actionHandler} />
          </HStack>
        </div>
      )}
    </Draggable>
  );
}

DelayBlock.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  actionHandler: PropTypes.func.isRequired,
};
