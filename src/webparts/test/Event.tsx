import * as React from "react";

interface IProps {
	title: string;
    content: string;
    author: string;
}



export default class Event extends React.Component<IProps> {
	public render(): React.ReactElement {
		return <div> 
            <h3>{this.props.title}</h3>
            <p>{this.props.content}</p>
            <p>{this.props.author}</p></div>;
	}
}