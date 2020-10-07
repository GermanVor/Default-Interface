import React, {Component, Dispatch} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../Storage';
import {
  setPoint,
  setPotentialToConnectPoint,
  setDropConnection,
  dropPotentialToConnectPoint,
  removePoint,
} from '../Storage/Actions/CanvasActions';
import {PointersType, Point} from '../Interfaces/CanvasInterface';
import {setFlagConnection} from '../Storage/Actions/ServiceActions';
import '../Style/PointComponent.css';

const mapState = (state: RootState, ownProps: ownProps) => {
  return {
    potentialToConnectPoint: state.CanvasReducer.potentialToConnectPoint,
  };
};

const mapDispatch = {
  dropPotentialToConnectPoint,
  setPotentialToConnectPoint,
  setDropConnection,
  removePoint,
  setPoint,
  setFlagConnection,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {
  isOpenMenu: boolean;
};

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
    this.state = {
      isOpenMenu: false,
    };
    this.pointRef = React.createRef();
  }

  mouseUpToEndMove = (ev: MouseEvent) => {
    this.isMoving = false;
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
      this.setState({isOpenMenu: !this.state.isOpenMenu});
      ev.preventDefault();
    }
  };

  //событие завершение добавления связи
  mouseDownToEndConnection = (ev: MouseEvent) => {
    if (ev.button === 0) {
      const {setDropConnection, ind} = this.props;
      setDropConnection(ind);
    }
  };

  componentDidUpdate(prevProps: Props) {
    const {potentialToConnectPoint, coordinatesToMove, coordinates, setPoint, axesType, ind} = this.props;

    const {first, second} = this.props.coordinates;
    const elem = this.pointRef!.current;

    if (this.isMoving && prevProps.coordinatesToMove !== coordinatesToMove) {
      setPoint(coordinatesToMove, axesType, ind);
    } else if (prevProps.coordinates !== coordinates) {
      elem!.style.left = `${first}px`;
      elem!.style.top = `${second - elem!.clientHeight / 2}px`;
    }

    //событие завершения добавления связи второй точки
    if (potentialToConnectPoint !== undefined && ind !== potentialToConnectPoint) {
      elem!.addEventListener('mousedown', this.mouseDownToEndConnection);
    } else {
      elem!.removeEventListener('mousedown', this.mouseDownToEndConnection);
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

    // событие открытия меню
    elem!.addEventListener('contextmenu', this.mouseDownToStartConnection);
  }

  setPotentialTopToConnect = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const {dropPotentialToConnectPoint, setPotentialToConnectPoint, potentialToConnectPoint, ind} = this.props;

    if (ind !== potentialToConnectPoint) {
      setPotentialToConnectPoint(ind);
    } else {
      dropPotentialToConnectPoint();
    }
  };

  deletePoint = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const {ind, removePoint} = this.props;
    removePoint(ind);
  };

  wrapperOnClik = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  render() {
    const {potentialToConnectPoint, ind} = this.props;
    const {isOpenMenu} = this.state;

    return (
      <div
        className={
          'PointComponent ' +
          (potentialToConnectPoint !== undefined && potentialToConnectPoint !== ind ? 'isConnection' : '')
        }
        ref={this.pointRef}>
        <div className={'PointComponentMenu ' + (isOpenMenu ? '' : 'hidden')} onClick={this.wrapperOnClik}>
          <button className={'AddRemoveConnection'} onClick={this.setPotentialTopToConnect}>
            {'ду'}
          </button>
          <button className={'DeleteButton'} onClick={this.deletePoint}>
            {'Del'}
          </button>
        </div>
      </div>
    );
  }
}

export const PointComponent = connector(PointClass);
