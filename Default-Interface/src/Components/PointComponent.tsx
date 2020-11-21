import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../Storage';
import {PolygonPoint, ScreenPoint} from '../Interfaces/PolygonPointsInterface';

import '../Style/PointComponent.css';
import {setPolygonPointType} from '../Storage/PolygonReducer/Actions/PolygonActionsInterface';
import {setScreenPointType} from '../Storage/ScreenReducer/Action/ScreenActionsInterface';

const mapState = (state: RootState, ownProps: ownProps) => ({});

const mapDispatch = (dispatch: Function, ownProps: ownProps) => {
	const {ind, ownSetPoint} = ownProps;

	return {
		setPoint: (point: ScreenPoint) => dispatch(ownSetPoint(ind, point)),
	};
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};

type ownProps = {
	parentRef: React.RefObject<HTMLDivElement>;
	ind: number;
	ownSetPoint: setPolygonPointType | setScreenPointType;
	point: PolygonPoint | ScreenPoint;
};

type Props = PropsFromRedux & ownProps;

class PointComponentClass extends Component<Props, State> {
	private pointRef: React.RefObject<HTMLDivElement>;

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

		const setCoord = (ev: MouseEvent) => {
			const first = ev.clientX - parentRect.left - shiftX;
			const second = ev.clientY - parentRect.top - shiftY;

			thisPoint!.style.transform = `translate(${first}px, ${second}px)`;

			setPoint({
				x: first + thisRect.width / 2,
				y: second + thisRect.height / 2,
			});
		};

		const eventFinish = () => {
			parentRef.current!.removeEventListener('mousemove', setCoord);
			thisPoint!.removeEventListener('mouseup', eventFinish);
		};

		parentRef.current!.addEventListener('mousemove', setCoord);
		thisPoint!.addEventListener('mouseup', eventFinish);
	};

	componentDidMount() {
		const {point} = this.props;
		const thisPoint = this.pointRef!.current;
		const thisRect = thisPoint!.getBoundingClientRect();

		thisPoint!.style.transform = `translate(${point.x - thisRect.width / 2}px, ${point.y - thisRect.height / 2}px)`;

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
		const {ind} = this.props;

		return (
			<div className={'Point'} ref={this.pointRef}>
				<div className={'PointName'}>{String.fromCharCode(65 + ind)}</div>
			</div>
		);
	}
}

export const PointComponent = connector(PointComponentClass);
