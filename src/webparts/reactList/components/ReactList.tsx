import * as React from "react";
// import styles from "./ReactList.module.scss";
import type { IReactListProps } from "./IReactListProps";
// import { escape } from "@microsoft/sp-lodash-subset";
import { ThemeProvider } from "@fluentui/react";
import Event from "../../test/Event";
import { Web } from "@pnp/sp/webs";

import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";


interface IState {
	author: string;
	title: string;
	content: string;
    itemId: number;
	events: any[];
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

	//     private _deleteEvent = async( title: string) =>{
	//         const web = Web([
	// 					this._sp.web,
	// 					"https://justnameitab.sharepoint.com/sites/Demo-Emmanuel/",
	// 				]);
	// const event = await web.lists.getByTitle("Events").items.filter(`Title eq '${title}'`).top(1);

	// this.setState({events: this.state.events.filter((ev) => ev.Title !== title)});
	//     }

	public render(): React.ReactElement<IReactListProps> {
		
		const { events } = this.state;
		return (
			<ThemeProvider theme={this.props.theme}>
				{events.map((ev) => (
					<Event
						key={ev["odata.id]"]}
						title={ev.Title}
						content={ev.Content}
						author={ev.Author.Title}
                        itemId={ev.ID}
					/>
				))}
			</ThemeProvider>
		);
	}
}
