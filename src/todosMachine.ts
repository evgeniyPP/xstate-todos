import { createMachine } from 'xstate';
import { TodoDto } from './models';

interface Context {
  items: TodoDto[];
  input: string;
  nextId: number;
}

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FWwHQBtUEMIBLAOygGIMSwtSA3VAaxrQ2z0NKgXtQGN8yIqhIBtAAwBdRKAAOmIkJEyQAD0QAmcQHYs2gKwbtADgBspjQBYtAZmP6ANCACeibRqziv4gIy+d2jYaxsYAvqFOrJi0EDhg5KSyAK7IAHJgAO4AkshgALYq8rCKwiQq6gg24sZYNgCcdabGPoZmFpZOrgg+zVhGliHi+oFWxtbhkejRRLHxhBDp2bkFSCBFJcqrFYbifabiFnWWltqW4hqmnYg9Pn2ng8NBA+MRIFHYM3HkAE75qHRgHL5QoKJRlLaIQw2PZjYaWOrabT7YxXBAAWhqzRsA30PhaPgR4hsEzeUw+s3IfAAFvgyIDliDimDyogbD5oeI6nidA1LD5gi1URisFicXjcYTLOFXiR0HAVO9cARiGRGRtwaAKuJUftPN5+cdzm0NPoSYrPmA1cyIQhrLt+cY7DYDNpGj0Oi5EPYsPp9Sd3GMidozWSraUWeirELjLtRXVDBoNHUk8npaEgA */
  createMachine<Context>(
    {
      context: { items: [], input: '', nextId: 1 },
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
          },
        },
      },
    },
    {
      actions: {
        saveInitialList: (context, event) => {
          context.items = event.data;
          context.nextId = context.items.length + 1;
        },
        saveInput: (context, event) => {
          context.input = event.input;
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
        },
        removeItem: (context, event) => {
          context.items = context.items.filter(i => i.id !== event.id);
        },
        changeItem: (context, event) => {
          const changedItem = context.items.find(i => i.id === event.id);

          if (!changedItem) {
            throw new Error('No item found: ', event.id);
          }

          changedItem.isActive = event.isActive;
        },
      },
      services: {
        getList: () => () =>
          new Promise(resolve => {
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
