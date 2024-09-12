import * as React from "react";
import type { IReactListProps } from "./IReactListProps";
import { ThemeProvider } from "@fluentui/react";
import Event from "../../test/Event";
import AddEvent from "../../test/AddEvent";
import { Web } from "@pnp/sp/webs";

import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "../../test/Events.css"
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface IState {
	author: string;
	title: string;
	content: string;
    itemId: number;
	events: any[];
    viewOption: string
}

export default class ReactList extends React.Component<IReactListProps, IState> {
	/**
	 *
	 */
	public _sp: SPFI;
	constructor(props: IReactListProps) {
		super(props);

		this.state = {
			author: "",
			title: "",
			content: "",
			itemId: 0,
            events: [],
            viewOption: "",
		};
		this._sp = spfi().using(SPFx(this.props.context));
	}

	public async componentDidMount() {
		const events = await this.getEvents();
		this.setState({
			events,
		});
	}

	private getEvents = async () => {
		const web = Web([
			this._sp.web,
			"https://justnameitab.sharepoint.com/sites/Demo-Emmanuel/",
		]);
		const events: any[] = await web.lists
			.getByTitle("Events")
			.items.expand("Author")
			.select("Title", "Content", "Author/Title", "ID")();
		console.log(events);
        
		return events;
	};

	private _deleteEvent = async (itemId: number) => {
		const web = Web([
			this._sp.web,
			"https://justnameitab.sharepoint.com/sites/Demo-Emmanuel/",
		]);
		const events = await web.lists.getByTitle("Events");
		await events.items.getById(itemId).delete();
		const newList = this.state.events.filter((ev) => ev.ID !== itemId);
		this.setState({
			events: newList,
		});
	};

	private _saveEvent = async (title: string, content: string) => {
		const web = Web([
			this._sp.web,
			"https://justnameitab.sharepoint.com/sites/Demo-Emmanuel/",
		]);
		const newItem = await web.lists.getByTitle("Events").items.add({
			Title: title,
			Content: content,
		});

		const completeItem = await web.lists
			.getByTitle("Events")
			.items.getById(newItem.ID)
			.expand("Author")
			.select("Title", "Content", "Author/Title", "ID")();

		const newList = this.state.events.concat(completeItem);

		this.setState({
			events: newList,
		});
	};


    private _saveEditedEvent= async ( itemId: number, title: string, content: string) => {
		const web = Web([
			this._sp.web,
			"https://justnameitab.sharepoint.com/sites/Demo-Emmanuel/",
		]);
        await web.lists.getByTitle("Events").items.getById(itemId).update({
            Title: title,
            Content: content,});
		
		const updatedItem = await web.lists
			.getByTitle("Events")
			.items.getById(itemId)
			.expand("Author")
			.select("Title", "Content", "Author/Title", "ID")();

		this.setState(prevState => ({
			events: prevState.events.map(event => event.ID === itemId? updatedItem: event),
		}));
	};

	private _editEvent = async (itemId: number) =>  {
		const eventId = document.getElementById(`edit-pane${itemId}`);
        const editPaneEventId = document.getElementById("edit-pane-eventId")
        
		if (eventId?.style.display === "none") {
			eventId?.style.setProperty("display", "block");

			const web = Web([
				this._sp.web,
				"https://justnameitab.sharepoint.com/sites/Demo-Emmanuel/",
			]);
			const eventToEdit = await web.lists
				.getByTitle("Events")
				.items.getById(itemId)
				.expand("Author")
				.select("Title", "Content", "Author/Title", "ID")();

			const editForm = document.createElement("form");

			editForm.innerHTML = `<label>Title</label>
            <br />
            <input id="edit-title" className="text-field" type="text" value="${eventToEdit.Title}" />
            <br />
            <br />
            <label>Content</label>
            <br />
            <input id="edit-content" type="text" cols="30" rows="3" className="text-field" value="${eventToEdit.Content}" />
            <br />
            <br />
            <button className={save-button" type="submit">
                Save
            </button>`;

			editForm.addEventListener("submit", async (e) => {
							e.preventDefault();
							const newTitle = (
								document.getElementById("edit-title") as HTMLInputElement
							)?.value;
							const newContent = (
								document.getElementById("edit-content") as HTMLTextAreaElement
							)?.value;
							await this._saveEditedEvent(itemId, newTitle, newContent);
						});
                        

			eventId.innerHTML = "";
			eventId?.appendChild(editForm);
			if (editPaneEventId) {
				editPaneEventId.textContent = itemId.toString();
			}
		} else {
			eventId?.style.setProperty("display", "none");			
           
            if(editPaneEventId){
				editPaneEventId.textContent = " ";
			}

		}

		console.log(itemId);
	};

    private _checkViewOption = () => {
        const { events } = this.state;
        switch (this.props.viewOption) {
					case "grid":
                        return (
							<div className="grid-container">
								{events
									.slice()
									.reverse()
									.map((ev, i) => (
										<Event
											key={i}
											// key={ev["odata.id]"]}
											title={ev.Title}
											content={ev.Content}
											author={ev.Author.Title}
											itemId={ev.ID}
											getItemId={this._deleteEvent}
											getItemToEdit={this._editEvent}
											viewOption={this.props.viewOption}
										>
											{this._editEvent}
										</Event>
									))}
							</div>
						);
					case "hero":
						return (
							<div>
								<div className="hero">
									{events.slice(-1).map((ev, i) => (
										<Event
											key={i}
											title={ev.Title}
											content={ev.Content}
											author={ev.Author.Title}
											itemId={ev.ID}
											getItemId={this._deleteEvent}
											getItemToEdit={this._editEvent}
											viewOption={this.props.viewOption}
										>
											{this._editEvent}
										</Event>
									))}
								</div>
								<div className="grid-container">
									{events
										.slice(0, -1)
										.reverse()
										.map((ev, i) => (
											<Event
												key={i}
												title={ev.Title}
												content={ev.Content}
												author={ev.Author.Title}
												itemId={ev.ID}
												getItemId={this._deleteEvent}
												getItemToEdit={this._editEvent}
												viewOption={"grid"}
											>
												{this._editEvent}
											</Event>
										))}
								</div>
							</div>
						);
					case "flow":
						return (
							<div>
								{events
									.slice()
									.reverse()
									.map((ev, i) => (
										<Event
											key={i}
											title={ev.Title}
											content={ev.Content}
											author={ev.Author.Title}
											itemId={ev.ID}
											getItemId={this._deleteEvent}
											getItemToEdit={this._editEvent}
											viewOption={this.props.viewOption}
										>
											{this._editEvent}
										</Event>
									))}
							</div>
						);
                    case "carousel":
                        return (
                                <Carousel fade={true} className="carousel-outer-container" interval={null}>
                                    {events
                                        .slice()
                                        .reverse()
                                        .map((ev, i) => (
                                            <Carousel.Item key={ev.ID} className="carousel-container">
                                                <img src="https://unsplash.it/1920/1080?random" className="carousel-img" />
                                                <Carousel.Caption className="carousel-subcontainer">
                                                <Event
                                                    key={i}
                                                    title={ev.Title}
                                                    content={ev.Content}
                                                    author={ev.Author.Title}
                                                    itemId={ev.ID}
                                                    getItemId={this._deleteEvent}
                                                    getItemToEdit={this._editEvent}
                                                    viewOption={this.props.viewOption}
                                                >
                                                    {this._editEvent}
                                                </Event>
                                                </Carousel.Caption>                                                
                                            </Carousel.Item>
                                        ))}
                                </Carousel>
                                );
				}
    };

  

	public render(): React.ReactElement<IReactListProps> {
		return (
			<ThemeProvider theme={this.props.theme}>
				{this._checkViewOption()}
				<br />
				<hr />
				<br />
				<AddEvent submitForm={this._saveEvent} />				
			</ThemeProvider>
		);
	}
}
