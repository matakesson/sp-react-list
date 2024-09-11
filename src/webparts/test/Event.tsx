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
        switch (viewOption){
            case "flow":
            return (
                    <div className="card">
                        <div className="card-event-content">
                            <img src="https://www.justnameit.se/assets/images/page_background1.jpg" />
                            <h3>{this.props.title}</h3>
                            <p>{this.props.content}</p>
                            <p>{this.props.author}</p>
                            <div id={`edit-pane${this.props.itemId}`}>
                                {/* <p id="edit-pane-eventId"></p> */}
                            </div>
                        </div>
                        <button className="card-edit-button" onClick={this._handleEdit}>
                            <EditIcon />
                        </button>
                        <button className="card-delete-button" onClick={this._handleClick}>
                            <DeleteIcon />
                        </button>
                    </div>
                );
            case "hero":
                return (
                        <div className="hero-event-content">
                            
                            <h3 className="hero-title">{this.props.title}</h3>
                            <img
                                className="hero-img"
                                src="https://www.justnameit.se/assets/images/page_background1.jpg"
                            />
                            <p className="hero-content">{this.props.content}</p>
                            <p className="hero-author">{this.props.author}</p>
                           
                        </div>
                    );
            case "grid":
                return (
                        <div className="grid-event-content">
                            <img
                                className="grid-img"
                                src="https://www.justnameit.se/assets/images/page_background1.jpg"
                            />
                            <h3 className="grid-title">{this.props.title}</h3>
                            <p className="grid-content">{this.props.content}</p>
                            <p className="grid-author">{this.props.author}</p>
                        </div>
                        );
            case "carousel":
                return (
									<>
										<img src="https://www.justnameit.se/assets/images/page_background1.jpg" />
										<h3 className="">{this.props.title}</h3>
										<p className="">{this.props.content}</p>
										<p className="">{this.props.author}</p>
									</>
								);
            
            
        }
    }

    
	public render(): React.ReactElement {
		return (
			<div>
				{/* <div className="card">
					<div className="event-content">
						<h3>{this.props.title}</h3>
						<p>{this.props.content}</p>
						<p>{this.props.author}</p>
						<div id={`edit-pane${this.props.itemId}`}></div>
					</div>
					<button className="edit-button" onClick={this._handleEdit}>
						<EditIcon />
					</button>
					<button className="delete-button" onClick={this._handleClick}>
						<DeleteIcon />
					</button>
				</div> */}
                  {this._chooseView(this.props.viewOption)}
			</div>
		);
	}
}