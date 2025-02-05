import React from 'react';
import Add from './Add.tsx';
import Urgent from './Urgent.tsx';
import All from './All.tsx';
import Completed from '../completed.tsx';

interface TodoRightProps {
  active: string;
}

const TodoRight: React.FC<TodoRightProps> = ({ active }) => {
  if (active === 'add') {
    return <Add />;
  }
  if (active === 'urgent') {
    return <Urgent />;
  }
  if(active=='all'){
    return <All/>
  }
  if(active=='completed'){
    return <Completed/>
  }
  return null;
};

export default TodoRight;
