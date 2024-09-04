import * as React from "react";

interface IProps {
	onClick(): void;
}

export default class IncrementWeek extends React.Component<IProps> {
	public render(): React.ReactElement {
		return <button onClick={this.props.onClick}>{">"}</button>;
	}
}
