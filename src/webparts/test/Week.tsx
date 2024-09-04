import * as React from "react";

interface IProps {
	week: number;
}

export default class Week extends React.Component<IProps> {
	public render(): React.ReactElement {
		return <div> <h3>Week</h3><h5>{this.props.week}</h5></div>;
	}
}
