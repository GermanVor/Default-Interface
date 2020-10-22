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
  parentRef: React.RefObject<HTMLDivElement>;
};

type Props = PropsFromRedux & ownProps;

class PointClass extends Component<Props, State> {
  private pointRef: React.RefObject<HTMLDivElement> = React.createRef();
  private isMoving = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenMenu: false,
    };
  }

  mouseDownToMove = (ev: MouseEvent) => {
    console.log('Down');
    this.isMoving = true;

    const {parentRef, setPoint, ind, axesType} = this.props;

    const thisPoint = this.pointRef!.current;
    const parentRectCurrent = parentRef!.current;
    const ClientRect = thisPoint!.getBoundingClientRect();

    thisPoint!.style.zIndex = '1000';

    const parentRect = parentRectCurrent!.getBoundingClientRect();

    const shiftX = ev.clientX - ClientRect!.left;
    const shiftY = ev.clientY - ClientRect!.top;

    const setCoord = (ev: MouseEvent) => {
      const x = ev.clientX - parentRect.left - shiftX;
      const y = ev.clientY - parentRect.top - shiftY;

      thisPoint!.style.transform = `translate(${x}px, ${y}px)`;

      setPoint(
        {
          //TODO разобраться наконец то с этой сранью, сделать человеческие margin
          first: x - 5 + ClientRect.width / 2,
          second: 215 - y - ClientRect.height / 2,
        },
        axesType,
        ind,
      );
    };

    const eventFinish = () => {
      console.log('Finish');
      this.isMoving = false;

      parentRectCurrent!.removeEventListener('mousemove', setCoord);
      thisPoint!.removeEventListener('mouseup', eventFinish);
      parentRectCurrent!.removeEventListener('mouseleave', eventFinish);
    };

    parentRectCurrent!.addEventListener('mousemove', setCoord);

    thisPoint!.addEventListener('mouseup', eventFinish);
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
    const {potentialToConnectPoint, coordinates, ind} = this.props;

    const {first, second} = this.props.coordinates;
    const elem = this.pointRef!.current;
    const ClientRect = elem!.getBoundingClientRect();

    if (!this.isMoving && prevProps.coordinates !== coordinates) {
      elem!.style.transform = `translate(${first - ClientRect!.width / 2}px, ${second - ClientRect!.height / 2}px)`;
    }

    //событие завершения добавления связи второй точки
    if (potentialToConnectPoint !== undefined && ind !== potentialToConnectPoint) {
      elem!.addEventListener('mousedown', this.mouseDownToEndConnection);
    } else {
      elem!.removeEventListener('mousedown', this.mouseDownToEndConnection);
    }
  }

  componentDidMount() {
    const {first, second} = this.props.coordinates;
    const elem = this.pointRef!.current;
    const ClientRect = elem!.getBoundingClientRect();

    elem!.ondragstart = () => false;

    elem!.style.transform = `translate(${first - ClientRect!.width / 2}px, ${second - ClientRect!.height / 2}px)`;

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

    ev.stopPropagation();
    ev.nativeEvent.stopPropagation();
    ev.nativeEvent.stopImmediatePropagation();
  };

  wrapperOnClik = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({isOpenMenu: false});
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
