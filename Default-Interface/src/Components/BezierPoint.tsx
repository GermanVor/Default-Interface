import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../Storage';
import {getPoint} from '../Storage/BezierStorage';
import {setPoint} from '../Storage/Actions/BezierActions';
import {PointersTypesInterface} from '../Interfaces/CommonInterface';

import '../Style/BezierPoint.css';

const mapState = (state: RootState, ownProps: ownProps) => {
  const {ind_1, ind_2, axisType} = ownProps;
  return {
    point: getPoint(state.BezierReducer, axisType, ind_1, ind_2),
  };
};

const mapDispatch = (dispatch: Function, ownProps: ownProps) => {
  const {axisType, ind_1, ind_2} = ownProps;

  return {
    setPoint: (first: number, second: number) => dispatch(setPoint(axisType, ind_1, ind_2, first, second)),
  };
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};

type ownProps = {
  parentRef: React.RefObject<HTMLDivElement>;
  ind_1: number;
  ind_2: number;
  axisType: PointersTypesInterface;
};

type Props = PropsFromRedux & ownProps;

class BezierClass extends Component<Props, State> {
  private pointRef: React.RefObject<HTMLDivElement>;
  private zIndex = '';

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.pointRef = React.createRef();
  }

  onMouseDown = (ev: MouseEvent) => {
    const {parentRef, setPoint} = this.props;
    const thisPoint = this.pointRef!.current;
    const parentRect = parentRef.current!.getBoundingClientRect();
    const thisRect = thisPoint!.getBoundingClientRect();

    const shiftX = ev.clientX - thisRect.left;
    const shiftY = ev.clientY - thisRect.top;

    thisPoint!.style.zIndex = `${+this.zIndex + 10}`;

    const setCoord = (ev: MouseEvent) => {
      const first = ev.clientX - parentRect.left - shiftX;
      const second = ev.clientY - parentRect.top - shiftY;

      thisPoint!.style.transform = `translate(${first}px, ${second}px)`;

      setPoint(first + thisRect.width / 2, second + thisRect.height / 2);
    };

    const eventFinish = () => {
      parentRef.current!.removeEventListener('mousemove', setCoord);
      thisPoint!.removeEventListener('mouseup', eventFinish);
      thisPoint!.style.zIndex = this.zIndex;
    };

    parentRef.current!.addEventListener('mousemove', setCoord);
    thisPoint!.addEventListener('mouseup', eventFinish);
  };

  componentDidMount() {
    const {point} = this.props;
    const thisPoint = this.pointRef!.current;
    const thisRect = thisPoint!.getBoundingClientRect();

    thisPoint!.style.transform = `translate(${point.x - thisRect.width / 2}px, ${point.y - thisRect.height / 2}px)`;
    this.zIndex = thisPoint!.style.zIndex;

    thisPoint!.addEventListener('mousedown', this.onMouseDown);
  }

  componentDidUpdate(prevProps: Props) {
    const {point} = this.props;

    if (prevProps.point !== point) {
      const thisPoint = this.pointRef!.current;
      const thisRect = thisPoint!.getBoundingClientRect();
      thisPoint!.style.transform = `translate(${point.x - thisRect.width / 2}px, ${point.y - thisRect.height / 2}px)`;
    }
  }

  render() {
    const {ind_1, ind_2} = this.props;

    return (
      <div className={'BezierPoint'} ref={this.pointRef}>
        <div className={'BezierPointName'}>
          {String.fromCharCode(65 + ind_2)}
          <sub>{`${ind_1},${ind_2}`}</sub>
        </div>
      </div>
    );
  }
}

export const BezierPointComponent = connector(BezierClass);
