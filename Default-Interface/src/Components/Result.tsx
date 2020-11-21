import React from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {ScreenPoint} from '../Interfaces/PolygonPointsInterface';
import {RootState} from '../Storage';

import '../Style/ResultField.css';

const canvasStyle = {
	width: 650,
	height: 700,
};

const mapState = (state: RootState) => ({
	resultArr: state.ResultReducer.resultArr,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};
type Props = PropsFromRedux & {};

class ResultFieldClass extends React.Component<Props, State> {
	private backgroundCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
	private mainCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
	private divFieldRef: React.RefObject<HTMLDivElement> = React.createRef();

	constructor(props: Props) {
		super(props);
		this.state = {};
	}

	componentDidUpdate(prevProps: Props) {
		const {resultArr} = this.props;

		if (resultArr !== prevProps.resultArr) {
			const context = this.mainCanRef.current!.getContext('2d');
			context!.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

			resultArr.forEach((arr) => {
				this.drawlines(context!, [...arr, arr[0]]);
			});
		}
	}

	drawlines = (context: CanvasRenderingContext2D, pointsArr: Array<ScreenPoint>, isDefaultStyle = true) => {
		if (isDefaultStyle) {
			context.beginPath();
			context.strokeStyle = '#000000';
			context!.setLineDash([0]);
		}

		pointsArr.reduce((pointA, pointB) => {
			context.moveTo(pointA.x, pointA.y);
			context.lineTo(pointB.x, pointB.y);

			return pointB;
		});

		context.stroke();
	};

	componentDidMount() {
		const {resultArr} = this.props;
		this.drawB();

		const context = this.mainCanRef.current!.getContext('2d');
		context!.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

		resultArr.forEach((arr) => {
			this.drawlines(context!, [...arr, arr[0]]);
		});
	}

	drawB = () => {
		const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');
		if (!backgroundContext) return;

		backgroundContext!.strokeStyle = '#eeee';

		for (let x = 0.5; x < canvasStyle.width; x += 10) {
			backgroundContext.moveTo(x, 0);
			backgroundContext.lineTo(x, canvasStyle.height);
		}

		for (let z = 0.5; z < canvasStyle.height; z += 10) {
			backgroundContext.moveTo(0, z);
			backgroundContext.lineTo(canvasStyle.width, z);
		}

		backgroundContext.stroke();
	};

	render() {
		return (
			<div className={'ResultField'}>
				<canvas
					className={'BackgroundCanvas'}
					width={canvasStyle.width}
					height={canvasStyle.height}
					ref={this.backgroundCanRef}
				/>
				<div className={'Wrapper'} style={canvasStyle} ref={this.divFieldRef}>
					<canvas
						className={'MainCanvas'}
						width={canvasStyle.width}
						height={canvasStyle.height}
						ref={this.mainCanRef}
					/>
				</div>
			</div>
		);
	}
}

export const ResultField = connector(ResultFieldClass);
