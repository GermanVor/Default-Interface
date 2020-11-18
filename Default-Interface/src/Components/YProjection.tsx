import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {BezierPointComponent} from './BezierPoint';
import {Point} from '../Interfaces/BezierActionsInterface';
import {RootState} from '../Storage';
import {getBezierGrid} from '../CommonFunctions/BezierFunctions';
import {PointersTypes} from '../Interfaces/CommonInterface';
import {AxisOption} from '../Interfaces/CommonInterface';

const WIDTH = 430;
const HEIGHT = 430;

const OFFSET = 10;

const mapState = (state: RootState) => ({
  points: state.BezierReducer.points,
  step: state.BezierReducer.step,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const axisOptions: Array<AxisOption> = [
  {name: 'X', type: PointersTypes.XY_axis},
  {name: 'Z', type: PointersTypes.ZY_axis},
];

type State = {
  axis: AxisOption;
  ind: number;
};

type Props = PropsFromRedux & {};

class YProjectionClass extends React.Component<Props, State> {
  private backgroundCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private mainCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private divFieldRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      axis: {...axisOptions[0]},
      ind: 0,
    };
  }

  getCoord = (point: Point): {x: number; y: number} => {
    const {axis} = this.state;
    const res = {
      y: point.y,
      x: 0,
    };

    if (axis.type === PointersTypes.XY_axis) {
      res.x = point.x;
    } else if (axis.type === PointersTypes.ZY_axis) {
      res.x = point.z;
    }

    return res;
  };

  getPointsArr = () => {
    const {axis, ind} = this.state;
    const {points} = this.props;

    if (axis.type === PointersTypes.XY_axis) {
      return points[ind];
    } else if (axis.type === PointersTypes.ZY_axis) {
      return points.map((pointsArr) => {
        return pointsArr[ind];
      });
    } else {
      throw Error('');
    }
  };

  drawB = () => {
    const secondAxis = this.state.axis;
    const context = this.backgroundCanRef!.current!.getContext('2d');

    for (let x = 0.5; x < WIDTH; x += 10) {
      context!.moveTo(x, 0);
      context!.lineTo(x, HEIGHT);
    }

    for (let z = 0.5; z < HEIGHT; z += 10) {
      context!.moveTo(0, z);
      context!.lineTo(WIDTH, z);
    }

    context!.strokeStyle = '#eee';
    context!.stroke();

    context!.beginPath();
    context!.strokeStyle = '#000000';

    context!.moveTo(OFFSET, OFFSET);
    context!.lineTo(WIDTH - OFFSET, OFFSET);
    context!.font = 'bold 14px sans-serif';
    context!.textAlign = 'right';
    context!.textBaseline = 'top';
    context!.fillText(secondAxis.name, WIDTH - OFFSET, OFFSET + 5);

    context!.moveTo(OFFSET, OFFSET);
    context!.lineTo(OFFSET, HEIGHT - OFFSET);
    context!.textAlign = 'left';
    context!.textBaseline = 'bottom';
    context!.fillText('Y', OFFSET + 5, HEIGHT - OFFSET);

    context!.stroke();
  };

  drawPointsLine = () => {
    const context = this.mainCanRef.current!.getContext('2d');
    if (context === null) return;

    const {ind} = this.state;
    const {step} = this.props;

    context.clearRect(0, 0, WIDTH, HEIGHT);
    const points = this.getPointsArr();

    context.beginPath();
    context.strokeStyle = '#e83737';

    points.map(this.getCoord).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    context.stroke();

    if (points.length === ind + 1 || 0 === ind) {
      context.beginPath();
      context.strokeStyle = '#000000';

      const arrayPointsToDraw = getBezierGrid([points], step, step);

      arrayPointsToDraw[0].map(this.getCoord).reduce((pointA, pointB) => {
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);

        return pointB;
      });

      context.stroke();
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {points, step} = this.props;
    const {axis, ind} = this.state;

    if (step !== prevProps.step || points !== prevProps.points || axis !== prevState.axis || ind !== prevState.ind) {
      this.drawPointsLine();
    }

    if (axis !== prevState.axis) {
      const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');
      backgroundContext!.clearRect(0, 0, WIDTH, HEIGHT);
      this.drawB();
    }
  }

  componentDidMount() {
    this.drawB();
    this.drawPointsLine();
  }

  changeAxis = (axis: AxisOption) => {
    this.setState({axis});
  };

  renderPoints = () => {
    const {axis, ind} = this.state;

    if (axis.type === PointersTypes.XY_axis) {
      return this.getPointsArr().map((point, ind_2) => {
        return (
          <BezierPointComponent
            parentRef={this.divFieldRef}
            ind_1={ind}
            ind_2={ind_2}
            axisType={axis.type}
            key={`Y_Projection-BezierPointComponent-${ind}-${ind_2}`}
          />
        );
      });
    } else if (axis.type === PointersTypes.ZY_axis) {
      return this.getPointsArr().map((points2, ind_1) => {
        return (
          <BezierPointComponent
            parentRef={this.divFieldRef}
            ind_1={ind_1}
            ind_2={ind}
            axisType={axis.type}
            key={`Y_Projection-BezierPointComponent-${ind_1}-${ind}`}
          />
        );
      });
    }
  };

  render() {
    const {points} = this.props;

    return (
      <div className={'Bezier'}>
        <canvas className={'BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
        <div
          className={'Wrapper'}
          style={{
            width: WIDTH - 2 * OFFSET,
            height: HEIGHT - 2 * OFFSET,
            margin: OFFSET,
          }}
          ref={this.divFieldRef}>
          <canvas
            className={'MainCanvas'}
            width={WIDTH - 2 * OFFSET}
            height={HEIGHT - 2 * OFFSET}
            ref={this.mainCanRef}
          />
          {this.renderPoints()}
        </div>
        <div className={'Menu'}>
          {points.map((point, ind) => {
            return (
              <button onClick={() => this.setState({ind: ind})} key={`eqwfwafs-${ind}`}>
                {ind}
              </button>
            );
          })}
          <br />
          {axisOptions.map((el) => {
            return (
              <button onClick={() => this.changeAxis({...el})} key={el.name}>
                {`${el.name}`}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

export const YProjection = connector(YProjectionClass);
