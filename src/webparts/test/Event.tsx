import * as React from "react";

interface IProps {
    itemId: number;
	title: string;
    content: string;
    author: string;
    getItemId(itemId: number): Promise<void>;
}

export default class Event extends React.Component<IProps> {

	private _handleClick = () =>  {
		return this.props.getItemId(this.props.itemId);
	}

	public render(): React.ReactElement {
		return (
			<div>
				<h3>{this.props.title}</h3>
				<p>{this.props.content}</p>
				<p>{this.props.author}</p>
                <p>{this.props.itemId}</p>
				<button onClick={this._handleClick}>Click me</button> 
                <p>----------------------------------------------------------</p>
			</div>
		);
	}
}