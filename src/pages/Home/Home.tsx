import { Typography } from 'antd';
import React, { FC } from 'react';

import { RouteConfig } from '../../routes/config';

const { Title } = Typography;

interface Props {
  routes: RouteConfig[];
}

export const Home: FC<Props> = (props) => {
  return (
    <>
      <Title level={4} style={{ textAlign: 'center' }}>
        Home
      </Title>
    </>
  );
};

export default Home;
