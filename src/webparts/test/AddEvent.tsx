import * as React from "react";
import "./Events.css";

interface IAddEventProps {
	submitForm(title: string, content: string): Promise<void>;
}

export default class AddEvent extends React.Component<IAddEventProps> {

    private _titleInput: React.RefObject<HTMLInputElement>
    private _contentInput: React.RefObject<HTMLTextAreaElement>

    constructor(props: IAddEventProps) {
        super(props);
        this._titleInput = React.createRef();
        this._contentInput = React.createRef();
        
    }
    
    private _handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const title = this._titleInput.current?.value || "";
        const content = this._contentInput.current?.value || "";
        
        await this.props.submitForm(title, content);

		if (this._titleInput.current){
			this._titleInput.current.value = "";
		}
		if (this._contentInput.current){
			this._contentInput.current.value = "";
		}
    }

	public render(): React.ReactElement {
        return (
					<div>
						{
							<form onSubmit={this._handleSubmit}>
								<label>Title</label>
								<br />
								<input
									className="text-field add-event-text-field "
									type="text"
									ref={this._titleInput}
								/>
								<br />
								<br />
								<label>Content</label>
								<br />
								<textarea
									cols={300}
                                    rows={8}
									className="text-field add-event-text-field"
									ref={this._contentInput}
								/>
								<br />
								<br />
								<button className="save-button" type="submit">Save</button>
							</form>
						}
					</div>
				);
	}
}
