import { FC, ChangeEvent, FormEvent, createContext } from 'react';
import { useActor, useInterpret } from '@xstate/react';
import { todosMachine } from './todosMachine';
import Items from './components/Items';

export const GlobalStateContext = createContext<{ todosService?: any }>({});

const App: FC = () => {
  const todosService = useInterpret(todosMachine);
  const [
    {
      context: { items, input, persistState },
    },
    send,
  ] = useActor(todosService);

  const handleCheckboxChange = () => {
    send({ type: 'changePersistence', value: !persistState });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    send({ type: 'inputNewItem', value: e.target.value });
  };

  const handleAddFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    send({ type: 'addNewItem' });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen font-sans bg-gray-100">
      <div className="w-full p-6 m-4 bg-white rounded shadow-md lg:w-3/4 lg:max-w-2xl">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900">To Do List</h1>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                onChange={handleCheckboxChange}
                type="checkbox"
                value="persist"
                checked={persistState}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-500">
                Persist
              </span>
            </label>
          </div>
          <form onSubmit={handleAddFormSubmit} className="flex mt-4">
            <input
              value={input}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mr-3 text-gray-700 border rounded shadow appearance-none"
              placeholder="Add new todo"
            />
            <button
              type="submit"
              className="min-w-[80px] p-2 border-2 rounded shrink-0 border-gray-200 hover:text-gray-700 hover:bg-gray-200 active:bg-gray-300 active:border-gray-300"
            >
              Add
            </button>
          </form>
        </div>
        <GlobalStateContext.Provider value={{ todosService }}>
          <Items data={items.filter(i => i.isActive)} />
          <Items data={items.filter(i => !i.isActive)} />
        </GlobalStateContext.Provider>
      </div>
    </div>
  );
};

export default App;
