import * as React from "react";
// import styles from "./ReactList.module.scss";
import type { IReactListProps } from "./IReactListProps";
// import { escape } from "@microsoft/sp-lodash-subset";
import { ThemeProvider } from "@fluentui/react";
//import Week from "../../test/Week";
import Event from "../../test/Event";



interface IState {
	author: string;
	title: string;
	content: string;
	
}

export default class ReactList extends React.Component<
	IReactListProps,
	IState
> {
	/**
	 *
	 */
	constructor(props: IReactListProps) {
		super(props);

		this.state = {
			
			author: "",
			title: "",
			content: ""
		};
	}

	

	// private _IncrementWeek = () => {
	// 	this.setState({
	// 		week: this.state.week + 1
	// 	})
	// }

	public render(): React.ReactElement<IReactListProps> {
		const eventList = [
			{
				author: "Kat",
				title: "Välrdskrig",
				content: "Det är hemskt"
			},
			{
				author: "Lucy",
				title: "Välrdskrig",
				content: "Det är hemskt"
			},
		]
		return (
			<ThemeProvider theme={this.props.theme}>
				{
					eventList.map(ev => <Event content={ev.content} author={ev.author} title={ev.title}></Event>)
				}
					
			</ThemeProvider>
		);
	}
}
