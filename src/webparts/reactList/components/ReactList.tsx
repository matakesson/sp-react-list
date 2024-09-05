import * as React from "react";
// import styles from "./ReactList.module.scss";
import type { IReactListProps } from "./IReactListProps";
// import { escape } from "@microsoft/sp-lodash-subset";
import { ThemeProvider } from "@fluentui/react";
//import Week from "../../test/Week";
import Event from "../../test/Event";

import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import { getSP } from "../../pnpjsConfig";
// // import { getSP } from "../../pnpjsConfig";

// const sp = spfi().using(SPFx);

interface IState {
	author: string;
	title: string;
	content: string;
	events: any[];
}

export default class ReactList extends React.Component<
	IReactListProps,
	IState
> {
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
			events: [],
		};
		this._sp = spfi().using(SPFx(this.props.context));
	}

	// private _IncrementWeek = () => {
	// 	this.setState({
	// 		week: this.state.week + 1
	// 	})
	// }

	public async componentDidMount() {
		const events = await this.getEvents();
		this.setState({
			events,
		});
	}

	private getEvents = async () => {
		const events: any[] = await this._sp.web.lists
			.getById("%7B97e77082-d184-4049-afb2-ec1ca8741349%7D")
			.items.expand("Author")
			.select("Title", "Content", "Author/Title")();
        console.log(events);
		return events;
	};

	public render(): React.ReactElement<IReactListProps> {
		// const eventList = [
		// 	{
		// 		author: "Kat",
		// 		title: "Välrdskrig",
		// 		content: "Det är hemskt",
		// 	},
		// 	{
		// 		author: "Lucy",
		// 		title: "Välrdskrig",
		// 		content: "Det är hemskt",
		// 	},
		// ];

		const { events } = this.state;
		return (
			<ThemeProvider theme={this.props.theme}>
				{/* {eventList.map((ev) => (
					<Event
						content={ev.content}
						author={ev.author}
						title={ev.title} 
					/>
				))} */}
				{events.map((ev) => (
                    
					<Event title={ev.Title} content={ev.Content} author={ev.Author.Title}/>
				))}
			</ThemeProvider>
		);
	}
}
