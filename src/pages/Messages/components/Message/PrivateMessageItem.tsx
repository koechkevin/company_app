import { Avatar } from '@aurora_app/ui-library';
import { Button, Icon, List, Row } from 'antd';
import { format } from 'date-fns';
import { Link } from 'dva/router';
import React, { FC } from 'react';
import { getCurrentUser } from '../../../../utils/utils';

import { FormattedMessage } from '../../models/typed';

import styles from './PrivateMessageItem.module.scss';

const { Item } = List;
const logo = `${process.env.PUBLIC_URL}/images/icons/logo-mark.svg`;

interface PrivateMessageProps extends FormattedMessage {
  handleCall?: () => void;
  handleMessage?: () => void;
}

const PrivateMessageItem: FC<PrivateMessageProps> = (props) => {
  const { updatedAt, text, author, handleCall, handleMessage } = props;

  return (
    <Item className={styles.privateMessageItem}>
      <Row className={styles.private}>
        <Icon type="eye" /> Only visible to me
      </Row>
      <Item.Meta
        avatar={<Avatar src={logo} className={styles.logo} />}
        title={
          <Row>
            <Link to="/" className={styles.name}>
              {author && getCurrentUser(author)}
            </Link>
            <span className={styles.createdAt}>{updatedAt && format(new Date(updatedAt), 'hh:mm b')}</span>
          </Row>
        }
        description={text}
      />
      <Row className={styles.buttonGroup}>
        <Button type="ghost" shape="round" onClick={handleMessage}>
          Text Him
        </Button>
        <Button type="ghost" shape="round" style={{ marginLeft: 10 }} onClick={handleCall}>
          Give Him a Call
        </Button>
      </Row>
    </Item>
  );
};

export default PrivateMessageItem;
