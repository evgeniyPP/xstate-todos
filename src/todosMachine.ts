import { createMachine } from 'xstate';
import { TodoDto } from './models';
import {
  getFromLocalStorage,
  LocalStorageKeys,
  removeFromLocalStorage,
  saveToLocalStorage,
} from './utils/localStorage';

interface Context {
  items: TodoDto[];
  input: string;
  nextId: number;
  persistState: boolean;
}

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FWwHQBtUEMIBLAOygGIMSwtSA3VAaxrQ2z0NKgXtQGN8yIqhIBtAAwBdRKAAOmIkJEyQAD0QAmcQHYs2gKwbtADgBspjQBYtAZmP6ANCACeibRqziv4gIy+d2jYaxsYAvqFOrJi0EDhg5KSyAK7IAHJgAO4AkshgALYq8rCKwiQq6gg24sZYNgCcdabGPoZmFpZOrgg+zVhGliHi+oFWxtbhkejRRLHxhBDp2bkFSCBFJcqrFYbifabiFnWWltqW4hqmnYg9Pn2ng8NBA+MRIFHYM3HkAE75qHRgHL5QoKJRlLaIQw2PZjYaWOrabT7YxXBAAWhqzRsA30PhaPgR4hsEzeUw+s3IfAAFvgyIDliDimDyogbD5oeI6nidA1LD5gi1URisFicXjcYTLCT3jEvtTaTAAApgb7FWDIWl8MCMjbg0AVGz7LA+Sw2NkaPwEvz2VEaLm1AymE0W-TNY7hV4kdBwFQyjjEMg65kQhDiVFG7y+KxnYLmDT6aVk2Xa1brYP6xDWXb84x2GwGbSNHodFyIexYfTeE2I4JnfOJthB0os9FWIXGXaiuqGDR2u11DQe0JAA */
  createMachine<Context>(
    {
      context: { items: [], input: '', nextId: 1, persistState: false },
      predictableActionArguments: true,
      id: 'todos',
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            src: 'getList',
            onDone: [
              {
                actions: 'saveInitialList',
                target: 'idle',
              },
            ],
          },
        },
        idle: {
          on: {
            inputNewItem: {
              actions: 'saveInput',
            },
            addNewItem: {
              actions: 'addItem',
            },
            removeItem: {
              actions: 'removeItem',
            },
            changeItem: {
              actions: 'changeItem',
            },
            changePersistence: {
              actions: 'changePersistence',
            },
          },
        },
      },
    },
    {
      actions: {
        saveInitialList: (context, event) => {
          context.items = event.data;
          context.nextId = context.items.length + 1;
          context.persistState =
            getFromLocalStorage(LocalStorageKeys.Persist) ?? false;
        },
        saveInput: (context, event) => {
          context.input = event.value;
        },
        addItem: context => {
          const value = context.input.trim();

          if (!value) {
            return;
          }

          context.items.push({
            id: context.nextId,
            value,
            isActive: true,
          });
          context.input = '';
          context.nextId++;

          if (context.persistState) {
            saveToLocalStorage(LocalStorageKeys.Todos, context.items);
          }
        },
        removeItem: (context, event) => {
          context.items = context.items.filter(i => i.id !== event.id);

          if (context.persistState) {
            saveToLocalStorage(LocalStorageKeys.Todos, context.items);
          }
        },
        changeItem: (context, event) => {
          const changedItem = context.items.find(i => i.id === event.id);

          if (!changedItem) {
            throw new Error('No item found: ', event.id);
          }

          changedItem.isActive = event.value;

          if (context.persistState) {
            saveToLocalStorage(LocalStorageKeys.Todos, context.items);
          }
        },
        changePersistence: (context, event) => {
          context.persistState = event.value;

          if (context.persistState) {
            saveToLocalStorage(LocalStorageKeys.Persist, context.persistState);
            saveToLocalStorage(LocalStorageKeys.Todos, context.items);
          } else {
            removeFromLocalStorage(LocalStorageKeys.Persist);
            removeFromLocalStorage(LocalStorageKeys.Todos);
          }
        },
      },
      services: {
        getList: () => () =>
          new Promise(resolve => {
            const savedList = getFromLocalStorage<TodoDto[]>(
              LocalStorageKeys.Todos
            );

            if (savedList) {
              resolve(savedList);
            }

            resolve([
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
            ]);
          }),
      },
    }
  );
