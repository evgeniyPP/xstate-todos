import { FC } from 'react';
import Item from './components/Item';
import { TodoDto } from './models';

const initialData: TodoDto[] = [
  {
    id: 1,
    value: 'Make a todo list app using XState',
    isActive: true,
  },
  {
    id: 2,
    value: 'Learn the XState basic workflow',
    isActive: false,
  },
];

const App: FC = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen font-sans bg-gray-100">
      <div className="w-full p-6 m-4 bg-white rounded shadow-md lg:w-3/4 lg:max-w-2xl">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-900">To Do List</h1>
          <div className="flex mt-4">
            <input
              className="w-full px-3 py-2 mr-3 text-gray-700 border rounded shadow appearance-none"
              placeholder="Add new todo"
            />
            <button className="min-w-[80px] p-2 border-2 rounded shrink-0 border-gray-200 hover:text-gray-700 hover:bg-gray-200 active:bg-gray-300 active:border-gray-300">
              Add
            </button>
          </div>
        </div>
        {initialData.map(i => (
          <Item key={i.id} value={i.value} isActive={i.isActive} />
        ))}
      </div>
    </div>
  );
};

export default App;
