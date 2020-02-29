import { ChannelMenu as DefaultChannelMenu } from '@aurora_app/ui-library';
import { ChannelItem as ChannelItemTyped } from '@aurora_app/ui-library/lib/Menu';
import { faHashtag } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'dva';
import { find } from 'lodash';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../models/dispatch.d';
import { Auth } from '../../../models/user';
import { Job, Jobs } from '../../Jobs/models/typed';
import { Room } from '../models/typed';

interface Props {
  auth: Auth;
  jobs: Jobs;
  channels: Room[];
  fetchJobs: (ids: string[]) => void;
}

const ChannelMenu: FC<Props> = (props) => {
  const { channels, jobs, fetchJobs } = props;
  const jobIds = channels.map((ch: any) => ch.jobId).join(',');
  const list = channels
    ? channels.map((channel) => ({
        ...channel,
        icon: faHashtag,
        iconWidth: 11,
        iconHeight: 11,
        lock: false,
        path: `/app/channel/${channel.id}`,
        name: find(jobs, (job: Job) => job.jobId === channel.jobId)?.jobTitle,
      }))
    : [];

  const remove = (item: ChannelItemTyped) => null;

  useEffect(() => {
    if (jobIds.length) {
      fetchJobs(jobIds.split(','));
    }
  }, [fetchJobs, jobIds]);

  return <DefaultChannelMenu removable title="Jobs" onRemove={remove} list={list} />;
};

const mapStateToProps = ({ global, room, jobs }: any) => ({
  auth: global.auth,
  jobs: jobs.jobs,
  channels: room.rooms.filter((room: Room) => room.type === 'job-channel'),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchJobs(ids: string[] = []) {
    dispatch({ type: 'jobs/fetchJobByIds', payload: { ids } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelMenu);
