import * as React from "react";
import "./Events.css";
import { Icon } from "@fluentui/react/lib/Icon";

const DeleteIcon = () => <Icon iconName="Delete" className="delete-icon"/>;
const EditIcon = () => <Icon iconName="Edit" className="edit-icon"/>;

interface IProps {
    itemId: number;
	title: string;
    content: string;
    author: string;
    getItemId(itemId: number): Promise<void>;
    getItemToEdit(itemId: number): Promise<void>;
}

export default class Event extends React.Component<IProps> {
	private _handleClick = () => {
		return this.props.getItemId(this.props.itemId);
	};

	private _handleEdit = () => {
        
		return this.props.getItemToEdit(this.props.itemId);
	};

	public render(): React.ReactElement {
		return (
			<div>
				<div className="card">
					<div className="event-content">
						<h3>{this.props.title}</h3>
						<p>{this.props.content}</p>
						<p>{this.props.author}</p>
                        <div id={`edit-pane${this.props.itemId}`}>
                            {/* <p id="edit-pane-eventId"></p> */}
                        </div>
						
					
					</div>
					<button className="edit-button" onClick={this._handleEdit}>
						<EditIcon />
					</button>
					<button className="delete-button" onClick={this._handleClick}>
						<DeleteIcon /> 
					</button>
					
				</div>
               
			</div>
		);
	}
}