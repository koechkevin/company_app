import { Button, Filter } from '@aurora_app/ui-library';
import { Layout, List, Row, Typography } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import React, { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { JobsAction } from '../../ability';
import { Dispatch } from '../../models/dispatch';
import { Auth } from '../../models/user';
import { Pagination } from '../../utils/constants';
import { ListHeader, ListItem } from './components';

import styles from './Jobs.module.scss';
import { Jobs as JobsTyped } from './models/typed.d';

interface Props {
  query: any;
  auth: Auth;
  jobs: JobsTyped;
  loading: boolean;
  pagination: Pagination;
  resetJobs: () => void;
  fetchJobs: (actionCode: string) => void;
}

const { Text } = Typography;

export const Jobs: FC<Props> = (props: any) => {
  const { jobs, query, loading, fetchJobs, pagination, resetJobs, auth } = props;
  const { pageCount, currentPage } = pagination;
  const [queryParams, setQueryParams] = useState(query);
  const [stateJobs, setStateJobs] = useState<any[]>([]);
  const isAuthenticated = auth && auth.isAuthenticated;

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs(JobsAction.View, queryParams);
    }
  }, [fetchJobs, queryParams, isAuthenticated]);

  useEffect(() => resetJobs, [resetJobs]);

  useEffect(() => {
    const uniqueJobs: any[] = [];

    jobs.forEach((job: any) => {
      const jobInState = stateJobs.find((each) => each.jobId === job.jobId);

      if (!jobInState) {
        uniqueJobs.push(job);
      }
    });

    setStateJobs((s) => [...s, ...uniqueJobs]);
  }, [setStateJobs, jobs]);

  const handleSearch = (params?: object) => {
    setStateJobs([]);
    setQueryParams({
      ...queryParams,
      ...params,
    });
  };

  const next = (page: any) => {
    if (page <= pageCount && !loading) {
      setQueryParams({
        ...queryParams,
        page,
      });
    }
  };

  const more = () =>
    stateJobs.length && stateJobs.length <= 10 && pageCount > currentPage ? (
      <div className={styles.more}>
        <Button ghost onClick={() => next(currentPage + 1)}>
          Click to load more
        </Button>
      </div>
    ) : (
      <div className={styles.hideMore} />
    );

  return (
    <Layout className={styles.jobs}>
      <div className={styles.head}>
        <Filter
          query={query}
          filterOptions={[]}
          onSearch={debounce(handleSearch, 500)}
          onClear={() => setQueryParams({})}
        />
        <ListHeader />
      </div>
      <Row>
        <div className={styles.jobsList}>
          <InfiniteScroll
            threshold={300}
            initialLoad={false}
            pageStart={0}
            useWindow={false}
            hasMore={currentPage < pageCount}
            loadMore={debounce(() => next(currentPage + 1), 200)}
          >
            {stateJobs.length ? (
              <List
                loadMore={more()}
                dataSource={stateJobs}
                renderItem={(item, i) => <ListItem {...item} key={item.jobId} loading={false} />}
              >
                {loading &&
                  Array(7)
                    .fill({})
                    .map((each: any, index: any) => (
                      <ListItem key={index} {...each} jobId={index.toString()} loading={true} />
                    ))}
              </List>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Text strong> You don’t have any jobs yet </Text>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </Row>
    </Layout>
  );
};

const mapStateToProps = ({ global, jobs, loading }: any) => ({
  jobs: jobs.jobs,
  auth: global.auth,
  pagination: jobs.pagination,
  loading: loading.effects['jobs/fetchJobs'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchJobs(actionCode: string, params?: any) {
    dispatch({ type: 'jobs/fetchJobs', actionCode, payload: params });
  },
  resetJobs: () => dispatch({ type: 'jobs/loadJobs', payload: [] }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
