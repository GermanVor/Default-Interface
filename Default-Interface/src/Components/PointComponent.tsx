import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../Storage';
import {setPoint, setPotentialToConnectPoint, setConnection} from '../Storage/Actions/CanvasActions';
import {PointersType, Point} from '../Interfaces/CanvasInterface';
import {setFlagConnection} from '../Storage/Actions/ServiceActions';
import '../Style/PointComponent.css';
import {isUndefined} from 'util';

const mapState = (state: RootState, ownProps: ownProps) => {
  return {
    isConnection: state.ServiceReducer.isConnection,
    potentialToConnectPoint: state.CanvasReducer.potentialToConnectPoint,
  };
};

const mapDispatch = {
  setPotentialToConnectPoint,
  setConnection,
  setPoint,
  setFlagConnection,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};

type ownProps = {
  coordinates: Point;
  ind: number;
  axesType: PointersType;
  coordinatesToMove: Point;
};

type Props = PropsFromRedux & ownProps;

class PointClass extends Component<Props, State> {
  private pointRef: React.RefObject<HTMLDivElement>;
  private isMoving = false;

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.pointRef = React.createRef();
  }

  mouseUpToEndMove = () => {
    const elem = this.pointRef!.current;
    this.isMoving = false;
    elem!.removeEventListener('mouseup', this.mouseUpToEndMove);
  };

  mouseDownToMove = (ev: MouseEvent) => {
    if (ev.button === 0) {
      const elem = this.pointRef!.current;

      this.isMoving = true;
      elem!.addEventListener('mouseup', this.mouseUpToEndMove);
    }
  };

  mouseDownToStartConnection = (ev: MouseEvent) => {
    if (ev.button === 2) {
      const {setFlagConnection, setPotentialToConnectPoint, ind} = this.props;
      // setFlagConnection();
      setPotentialToConnectPoint(ind);

      ev.preventDefault();
    }
  };

  mouseDownToEndConnection = (ev: MouseEvent) => {
    if (ev.button === 0) {
      const elem = this.pointRef!.current;
      const {setConnection, ind} = this.props;
      setConnection(ind);
      elem!.removeEventListener('mousedown', this.mouseDownToEndConnection);
    }
  };

  componentDidUpdate(prevProps: Props) {
    const {potentialToConnectPoint, coordinatesToMove, isConnection, coordinates, setPoint, axesType, ind} = this.props;

    const {first, second} = this.props.coordinates;
    const elem = this.pointRef!.current;

    if (this.isMoving && prevProps.coordinatesToMove !== coordinatesToMove) {
      setPoint(coordinatesToMove, axesType, ind);
    } else if (prevProps.coordinates !== coordinates) {
      elem!.style.left = `${first}px`;
      elem!.style.top = `${second - elem!.clientHeight / 2}px`;
    }

    //событие завершения добавления связи
    if (potentialToConnectPoint !== undefined && ind !== potentialToConnectPoint) {
      elem!.addEventListener('mousedown', this.mouseDownToEndConnection);
    }

    return false;
  }

  componentDidMount() {
    const {first, second} = this.props.coordinates;
    const elem = this.pointRef!.current;

    elem!.ondragstart = () => false;

    elem!.style.left = `${first}px`;
    elem!.style.top = `${second - elem!.clientHeight / 2}px`;

    // событие начала перемещения
    elem!.addEventListener('mousedown', this.mouseDownToMove);
    // событие начала добавления связи
    elem!.addEventListener('contextmenu', this.mouseDownToStartConnection);
  }

  render() {
    const {isConnection, potentialToConnectPoint, ind} = this.props;

    return (
      <div
        className={
          'PointComponent ' +
          (potentialToConnectPoint !== undefined && potentialToConnectPoint !== ind ? 'isConnection' : '')
        }
        ref={this.pointRef}></div>
    );
  }
}

export const PointComponent = connector(PointClass);
