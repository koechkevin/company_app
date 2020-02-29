import React, { FC } from 'react';

import { WithModalConnect } from '../../../components';
import AddDirectMessage from './AddDirectMessage';
import ListDirectMessage from './ListDirectMessages';

const ModalContainer: FC<any> = (props) => {
  const { showAddDirectMessageModal, showListDirectMessageModal } = props;

  return (
    <div>
      {showAddDirectMessageModal && <AddDirectMessage />}
      {showListDirectMessageModal && <ListDirectMessage />}
    </div>
  );
};

export default WithModalConnect(ModalContainer);
