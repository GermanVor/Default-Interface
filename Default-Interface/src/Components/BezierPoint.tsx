import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../Storage';
import {getPoint} from '../Storage/BezierStorage';
import {setPoint} from '../Storage/Actions/BezierActions';
import '../Style/BezierPoint.css';

const mapState = (state: RootState, ownProps: ownProps) => {
  return {
    point: getPoint(state.BezierReducer, ownProps.ind),
  };
};

const mapDispatch = {
  setPoint,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};

type ownProps = {
  parentRef: React.RefObject<HTMLDivElement>;
  ind: number;
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
    const {parentRef, setPoint, ind} = this.props;
    const thisPoint = this.pointRef!.current;
    const parentRect = parentRef.current!.getBoundingClientRect();
    const thisRect = thisPoint!.getBoundingClientRect();

    const shiftX = ev.clientX - thisRect.left;
    const shiftY = ev.clientY - thisRect.top;

    thisPoint!.style.zIndex = `${+this.zIndex + 10}`;

    const setCoord = (ev: MouseEvent) => {
      const x = ev.clientX - parentRect.left - shiftX;
      const y = ev.clientY - parentRect.top - shiftY;

      thisPoint!.style.transform = `translate(${x}px, ${y}px)`;

      setPoint(
        {
          x: x + thisRect.width / 2,
          y: y + thisRect.height / 2,
        },
        ind,
      );
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

  render() {
    const {ind} = this.props;

    return (
      <div className={'BezierPoint'} ref={this.pointRef}>
        <div className={'BezierPointName'}>{String.fromCharCode(65 + ind)}</div>
      </div>
    );
  }
}

export const BezierPointComponent = connector(BezierClass);
