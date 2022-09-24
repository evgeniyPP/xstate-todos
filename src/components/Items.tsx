import { FC } from 'react';
import { TodoDto } from '../models';
import Item from './Item';

interface Props {
  data: TodoDto[];
}

const Items: FC<Props> = ({ data }) => {
  return (
    <>
      {data.map(i => (
        <Item key={i.id} {...i} />
      ))}
    </>
  );
};

export default Items;
