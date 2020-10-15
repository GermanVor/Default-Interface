import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Canvas} from './Components/Canvas';
import {D3_Canvas} from './Components/D3_Canvas';
import {toggleMakeRecording} from './Storage/Actions/ServiceActions';
import {PointersTypes} from './Interfaces/CanvasInterface';
import {clearPoints, addPoint} from './Storage/Actions/CanvasActions';

import {RootState} from './Storage';
import './Style/Main.css';

const mapState = (state: RootState) => ({
  isRecording: state.ServiceReducer.isRecording,
  ARRAY: state.CanvasReducer.points,
});

const mapDispatch = {
  toggleMakeRecording,
  clearPoints,
  addPoint,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {
  isRecording: boolean;
};
type Props = PropsFromRedux & {};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isRecording: false,
    };
  }

  componentDidMount = () => {};

  Draw = () => {
    this.props.toggleMakeRecording();
  };

  Refresh = () => {
    this.props.clearPoints();
  };

  render() {
    const {isRecording} = this.props;

    return (
      <div className={'App ' + (isRecording ? 'active' : '')}>
        <div>
          <Canvas
            key={'XY_CANVAS'}
            axes={{
              verticalAxisName: 'y',
              horizontalAxisName: 'x',
              axesType: PointersTypes.XY_axis,
            }}
          />
          <Canvas
            key={'ZX_CANVAS'}
            axes={{
              verticalAxisName: 'x',
              horizontalAxisName: 'z',
              axesType: PointersTypes.ZX_axis,
            }}
          />
          <Canvas
            key={'YZ_CANVAS'}
            axes={{
              verticalAxisName: 'z',
              horizontalAxisName: 'y',
              axesType: PointersTypes.YZ_axis,
            }}
          />
        </div>
        <button onClick={this.Draw} className={'DrawButton'}>
          {'Draw'}
        </button>
        <button onClick={this.Refresh}>{'Refresh'}</button>
        <D3_Canvas
          axes={{
            firstAxisName: 'y',
            secondAxisName: 'x',
            thirdAxisName: 'z',
          }}
        />
      </div>
    );
  }
}

export default connector(App);
