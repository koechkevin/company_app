import { Row } from 'antd';
import { Link } from 'dva/router';
import React from 'react';
import styles from './Exception.module.scss';

import HelpAndSupport from './components/HelpAndSupport';

const Error404: React.FC<any> = () => {
  return (
    <Row className={styles.container}>
      <Row type="flex" align="middle" justify="center" className={styles.content}>
        <h1>404</h1>
        <p>Oops. The page you were looking for doesn’t exist.</p>
        <Link to="/dashboard/home">Take me back to the dashboard</Link>
      </Row>
      <HelpAndSupport />
    </Row>
  );
};

export default Error404;
