import { Loading } from '@aurora_app/ui-library';
import * as React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';
import { ChannelMenu, DirectMessageMenu, DraftMenu, ModalContainer, ReplyMessageList } from './containers';
import { DraftModel, MessageModel, RoomModel } from './models';

const Channel = Loadable.Map({
  loader: {
    Channel: () => import('./Channel'),
    fileUpload: () => import('../../models/fileUpload'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Channel = loaded.Channel.default;
    const fileUpload = loaded.fileUpload.default;

    registerModel(props.app, fileUpload);

    return <Channel {...props} app={props.app} />;
  },
});

export {
  Channel,
  ChannelMenu,
  DirectMessageMenu,
  DraftMenu,
  ModalContainer,
  DraftModel,
  MessageModel,
  ReplyMessageList,
  RoomModel,
};
