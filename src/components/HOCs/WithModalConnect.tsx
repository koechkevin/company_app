import { connect } from 'dva';
import React from 'react';
import { Dispatch } from '../../models/dispatch';

export default <P extends object>(Component: React.ComponentType<P>) => {
  class HOC extends React.Component<P> {
    public render = () => <Component {...this.props} />;
  }

  const mapStateToProps = ({ common }: any) => common;

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    showModal(modal: string) {
      dispatch({
        type: 'common/showOrHideModal',
        modal,
        payload: true,
      });
    },

    hideModal(modal: string) {
      dispatch({
        type: 'common/showOrHideModal',
        modal,
        payload: false,
      });
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};
