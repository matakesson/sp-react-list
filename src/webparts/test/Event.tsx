/* eslint-disable react/self-closing-comp */
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
    viewOption: string;
}

export default class Event extends React.Component<IProps> {
	private _handleClick = () => {
		return this.props.getItemId(this.props.itemId);
	};

	private _handleEdit = () => {
        
		return this.props.getItemToEdit(this.props.itemId);
	};

    private _chooseView = (viewOption: string) =>{

        
        const img = "https://unsplash.it/1920/1080?random";
        switch (viewOption) {
					case "flow":
						return (
							<div id="card">
								<div className="card-event-content">
									<img className="card-img" src={img} />
									<h3>{this.props.title}</h3>
									<p className="card-content">{this.props.content}</p>
									<p>{this.props.author}</p>
									<div id={`edit-pane${this.props.itemId}`}>
										{/* <p id="edit-pane-eventId"></p> */}
									</div>
								</div>
								<button className="card-edit-button" onClick={this._handleEdit}>
									<EditIcon />
								</button>
								<button
									className="card-delete-button"
									onClick={this._handleClick}
								>
									<DeleteIcon />
								</button>
							</div>
						);
					case "hero":
						return (
							
								<div className="hero-event-content">
									<h3 className="hero-title">{this.props.title}</h3>
									<img className="hero-img" src={img} />
									<p className="hero-content">{this.props.content}</p>
									<p className="hero-author">{this.props.author}</p>
									<div id={`edit-pane${this.props.itemId}`}className="hero-edit-pane"></div>
									<button
										className="hero-edit-button"
										onClick={this._handleEdit}
									>
										<EditIcon />
									</button>
									<button
										className="hero-delete-button"
										onClick={this._handleClick}
									>
										<DeleteIcon />
									</button>
								</div>
							
						);
					case "grid":
						return (
							<div className="grid-event-content">
								<img className="grid-img" src={img} />
								<h3 className="grid-title">{this.props.title}</h3>
								<p className="grid-content">{this.props.content}</p>
								<p className="grid-author">{this.props.author}</p>
								<div id={`edit-pane${this.props.itemId}`} className="grid-edit-pane"></div>
                                <button className="grid-edit-button" onClick={this._handleEdit}>
									<EditIcon />
								</button>
								<button
									className="grid-delete-button"
									onClick={this._handleClick}
								>
									<DeleteIcon />
								</button></div>
                           
						);
					case "carousel":
						return (
							<div>
								<h3 className="carousel-title">{this.props.title}</h3>
								<p className="carousel-content">{this.props.content}</p>
								<p className="carousel-author">{this.props.author}</p>
							</div>
						);
				}
    }

    
	public render(): React.ReactElement {
		return (
			<div>
                {this._chooseView(this.props.viewOption)}
			</div>
		);
	}
}