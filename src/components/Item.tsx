import { FC, useContext } from 'react';
import cn from 'classnames';
import { GlobalStateContext } from '../App';
import { TodoDto } from '../models';

const Item: FC<TodoDto> = ({ id, value, isActive }) => {
  const {
    todosService: { send },
  } = useContext(GlobalStateContext);

  const handleRemoveClick = () => {
    send({ type: 'removeItem', id });
  };

  const handleStatusClick = () => {
    send({ type: 'changeItem', id, value: !isActive });
  };

  return (
    <div className="flex items-center mb-4">
      <p
        className={cn('w-full text-gray-900', {
          'line-through	text-green-600': !isActive,
        })}
      >
        {value}
      </p>
      <button
        onClick={handleStatusClick}
        className={cn(
          'p-2 ml-3 mr-2 border-2 min-w-[90px] rounded shrink-0 hover:text-white',
          {
            'text-green-600 border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700':
              isActive,
            'text-gray-500 border-gray-400 hover:bg-gray-400 active:border-gray-500 active:bg-gray-500':
              !isActive,
          }
        )}
      >
        {isActive ? 'Done' : 'Not Done'}
      </button>
      <button
        onClick={handleRemoveClick}
        className="min-w-[80px] p-2 ml-1 text-red-500 border-2 border-red-500 rounded shrink-0 hover:text-white hover:bg-red-500 active:border-red-600 active:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
};

export default Item;
