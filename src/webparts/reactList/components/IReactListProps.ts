import { Theme } from "@fluentui/react";

export interface IReactListProps {
	description: string;
	isDarkTheme: boolean;
	environmentMessage: string;
	hasTeamsContext: boolean;
	userDisplayName: string;
	theme: Theme; // Add this line to include the theme
	context: any;
    viewOption: string;
}
