import * as React from "react";

interface IProps {
	title: string;
    content: string;
    author: string;
    // onClick : (id: string) => void;
}

export default class Event extends React.Component<IProps> {

//     handleClick = () =>{
// const eventTitle = this.props.title;
// // this.props.onClick(eventTitle);
//     }

	public render(): React.ReactElement {
        
		return (
			<div>
				<h3>{this.props.title}</h3>
				<p>{this.props.content}</p>
				<p>{this.props.author}</p>
				{/* <button onClick={this.handleClick}>Click me</button> */}
			</div>
		);
	}
}