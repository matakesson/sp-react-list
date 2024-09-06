import * as React from "react";

interface IAddEventProps {
	submitForm(title: string, content: string): Promise<void>;
}

export default class AddEvent extends React.Component<IAddEventProps> {
	// private _handleClick = () => {
	// 	return this.props.getItemId(this.props.itemId);
	// };

    private _titleInput: React.RefObject<HTMLInputElement>
    private _contentInput: React.RefObject<HTMLTextAreaElement>

    constructor(props: IAddEventProps) {
        super(props);
        this._titleInput = React.createRef();
        this._contentInput = React.createRef();
        
    }
    
    private _handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const title = this._titleInput.current?.value || "";
        const content = this._contentInput.current?.value || "";
        
        return this.props.submitForm(title, content);
    }

	public render(): React.ReactElement {
        return (
					<div>
						{
							<form onSubmit={this._handleSubmit}>
								<label>Title</label>
								<input type="text" ref={this._titleInput} />

								<label>Content</label>
								<textarea ref={this._contentInput} />

								<button type="submit">Save</button>
							</form>
						}
					</div>
				);
	}
}
