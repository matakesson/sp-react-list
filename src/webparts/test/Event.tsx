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
	viewOption: string;
	getItemId(itemId: number): Promise<void>;
	getItemToEdit(itemId: number): Promise<void>;
	saveItem(itemId: number, updatedData: any): Promise<void>;
}

interface IEventState{
    isEditing: boolean;
    editTitle: string;
    editContent: string;
}

export default class Event extends React.Component<IProps, IEventState> {

    /**
     *
     */
    constructor(props: IProps) {
        super(props);
        this._handleEdit = this._handleEdit.bind(this);
        this.state = {
            isEditing: false,
            editTitle: "",
            editContent: ""
        };
         
    }

	private _handleClick = () => {
		return this.props.getItemId(this.props.itemId);
        

	};

	private _handleEdit = async () => {
        console.log(this.props)
		await this.props.getItemToEdit(this.props.itemId);
        this.setState((prevState) => ({
					isEditing: !prevState.isEditing,
					editTitle: this.props.title,
					editContent: this.props.content,
				}));
        
    };

    private _handleSave = async () => {
        const {itemId, title, content} = this.props;
        const updatedData = {
            Title: this.state.editTitle || title,
            Content: this.state.editContent || content
        }

        await this.props.saveItem(itemId, updatedData);
        this.setState({
					isEditing: false,
					editTitle: this.state.editTitle, // Update local state
					editContent: this.state.editContent,
				});
    }

    private _chooseView = (viewOption: string) =>{
        const {isEditing} = this.state;
        
        // const img = "https://unsplash.it/1920/1080?random";
        switch (viewOption) {
					case "flow":
                        if(isEditing){
                            return (
                                <div id="card">
                                    <div className="card-event-content">
                                        <img
                                            className="card-img"
                                            src={`https://unsplash.it/1920/1080?random=${this.props.itemId}`}
                                        />
                                        <h3>
                                            <input
                                                className="text-field card-text-field"
                                                type="text"
                                                value={this.state.editTitle}
                                                onChange={(e) =>
                                                    this.setState({
                                                        editTitle: e.target.value,
                                                    })
                                                }
                                            ></input>
                                        </h3>
                                        <p className="card-content">
                                            <textarea
                                                cols={70}
                                                rows={8}
                                                className="text-field card-text-field"
                                                value={this.state.editContent}
                                                onChange={(e) =>
                                                    this.setState({
                                                        editContent: e.target.value,
                                                    })
                                                }
                                            />
                                        </p>
                                        <p>{this.props.author}</p>
                                        <button
                                            className="save-button"
                                            onClick={this._handleSave}
                                        >
                                            Save
                                        </button>
                                        {/* <div id={`edit-pane${this.props.itemId}`}>
<p id="edit-pane-eventId"></p>
</div> */}
                                    </div>
                                    <button
                                        className="card-edit-button"
                                        onClick={this._handleEdit}
                                    >
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
                        }
                        else{
                            return (
                                <div id="card">
                                    <div className="card-event-content">
                                        <img
                                            className="card-img"
                                            src={`https://unsplash.it/1920/1080?random=${this.props.itemId}`}
                                        />
                                        <h3>{this.props.title}</h3>
                                        <p className="card-content">
                                            {this.props.content}
                                        </p>
                                        <p>{this.props.author}</p>
                                        <div id={`edit-pane${this.props.itemId}`}>
                                            {/* <p id="edit-pane-eventId"></p> */}
                                        </div>
                                    </div>
                                    <button
                                        className="card-edit-button"
                                        onClick={this._handleEdit}
                                    >
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
                        }
						
					case "hero":
                        if(isEditing){
                            return (
                                <div className="hero-event-content">
                                    <h3 className="hero-title">
                                        <input
                                            className="text-field"
                                            type="text"
                                            value={this.state.editTitle}
                                            onChange={(e) =>
                                                this.setState({
                                                    editTitle: e.target.value,
                                                })
                                            }
                                        ></input>
                                    </h3>
                                    <img
                                        className="hero-img"
                                        src={`https://unsplash.it/1920/1080?random=${this.props.itemId}`}
                                    />
                                    <p className="hero-content">
                                        <textarea
                                            cols={70}
                                            rows={8}
                                            className="hero-text-field"
                                            value={this.state.editContent}
                                            onChange={(e) =>
                                                this.setState({
                                                    editContent: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p className="hero-author">
                                        {this.props.author}
                                    </p>
                                    <button
                                        className="save-button hero-save-button"
                                        onClick={this._handleSave}
                                    >
                                        Save
                                    </button>
                                    <div
                                        id={`edit-pane${this.props.itemId}`}
                                        className="hero-edit-pane"
                                    ></div>
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
                        }
                        else{
                            return (
                                <div className="hero-event-content">
                                    <h3 className="hero-title">
                                        {this.props.title}
                                    </h3>
                                    <img
                                        className="hero-img"
                                        src={`https://unsplash.it/1920/1080?random=${this.props.itemId}`}
                                    />
                                    <p className="hero-content">
                                        {this.props.content}
                                    </p>
                                    <p className="hero-author">
                                        {this.props.author}
                                    </p>
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
                        }

					case "grid":
                        if(isEditing){
                            return (
                                <div className="grid-event-content">
                                    <img
                                        className="grid-img grid-edit-img"
                                        src={`https://unsplash.it/1920/1080?random=${this.props.itemId}`}
                                    />
                                    <h3 className="grid-title">
                                        <input
                                            className="text-field grid-text-input"
                                            type="text"
                                            value={this.state.editTitle}
                                            onChange={(e) =>
                                                this.setState({
                                                    editTitle: e.target.value,
                                                })
                                            }
                                        ></input>
                                    </h3>
                                    <p className="grid-content">
                                        <textarea
                                            cols={30}
                                            rows={5}
                                            className="text-field grid-text-field"
                                            value={this.state.editContent}
                                            onChange={(e) =>
                                                this.setState({
                                                    editContent: e.target.value,
                                                })
                                            }
                                        />
                                    </p>
                                    <p className="grid-author">
                                        {this.props.author}
                                    </p>
                                    <button
                                        className="save-button grid-save-button"
                                        onClick={this._handleSave}
                                    >
                                        Save
                                    </button>
                                    <div
                                        id={`edit-pane${this.props.itemId}`}
                                        className="grid-edit-pane"
                                    ></div>
                                    <button
                                        className="grid-edit-button"
                                        onClick={this._handleEdit}
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        className="grid-delete-button"
                                        onClick={this._handleClick}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            );
                        }
                        else{
                            return (
                                <div className="grid-event-content">
                                    <img
                                        className="grid-img"
                                        src={`https://unsplash.it/1920/1080?random=${this.props.itemId}`}
                                    />
                                    <h3 className="grid-title">
                                        {this.props.title}
                                    </h3>
                                    <p className="grid-content">
                                        {this.props.content}
                                    </p>
                                    <p className="grid-author">
                                        {this.props.author}
                                    </p>
                                    <div
                                        id={`edit-pane${this.props.itemId}`}
                                        className="grid-edit-pane"
                                    ></div>
                                    <button
                                        className="grid-edit-button"
                                        onClick={this._handleEdit}
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        className="grid-delete-button"
                                        onClick={this._handleClick}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            );
                        }

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
		return <div>{this._chooseView(this.props.viewOption)}</div>;
	}
}