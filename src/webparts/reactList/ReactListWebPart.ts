import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
	type IPropertyPaneConfiguration,
	PropertyPaneDropdown,
	PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "ReactListWebPartStrings";
import ReactList from "./components/ReactList";
import { IReactListProps } from "./components/IReactListProps";
import {
	PropertyFieldColorPicker,
	PropertyFieldColorPickerStyle,
} from "@pnp/spfx-property-controls/lib/PropertyFieldColorPicker";
import { ThemeManager } from "./util/ThemeManager";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import {
	PropertyPaneButton,
	PropertyPaneCheckbox,
} from "@microsoft/sp-property-pane";
import { getSP } from "../pnpjsConfig";

import { initializeIcons } from "@fluentui/font-icons-mdl2";
initializeIcons();

export interface IReactListWebPartProps {
	description: string;
	color: string;
	backgroundColor: string;
	primaryColor: string;
	siteUrl: string;
	listName: string;
	autoUpdate: boolean;
	nameProp: string;
	valueProp: string;
    viewOption: string;
}

export default class ReactListWebPart extends BaseClientSideWebPart<IReactListWebPartProps> {
	private _isDarkTheme: boolean = false;
	private _environmentMessage: string = "";
	private themeManager: ThemeManager;
	private isAppearanceGroupCollapsed: boolean = false;

	public render(): void {
		const element: React.ReactElement<IReactListProps> = React.createElement(
			ReactList,
			{
				description: this.properties.description,
				isDarkTheme: this._isDarkTheme,
				environmentMessage: this._environmentMessage,
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
				userDisplayName: this.context.pageContext.user.displayName,
				theme: this.themeManager.getTheme(),
				context: this.context,
				viewOption: this.properties.viewOption || "hero",
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected onInit(): Promise<void> {
		//@ts-expect-error non-typed global
		this.properties.primaryColor = this.properties.primaryColor ?? __themeState__.theme.themePrimary;
		//@ts-expect-error non-typed global
		this.properties.backgroundColor = this.properties.backgroundColor ?? __themeState__.theme.primaryBackground;
		//@ts-expect-error non-typed global
		this.properties.color = this.properties.color ?? __themeState__.theme.primaryText;
		this.themeManager = new ThemeManager(
			this.properties.primaryColor,
			this.properties.color,
			this.properties.backgroundColor
		);
		getSP(this.context);
		return super.onInit().then((_) => {
			if (this.properties.autoUpdate) {
				this.fetchConfigsFromList();
			}
			return this._getEnvironmentMessage().then((message) => {
				this._environmentMessage = message;
			});
		});
	}

	private _getEnvironmentMessage(): Promise<string> {
		if (!!this.context.sdks.microsoftTeams) {
			// running in Teams, office.com or Outlook
			return this.context.sdks.microsoftTeams.teamsJs.app
				.getContext()
				.then((context) => {
					let environmentMessage: string = "";
					switch (context.app.host.name) {
						case "Office": // running in Office
							environmentMessage = this.context.isServedFromLocalhost
								? strings.AppLocalEnvironmentOffice
								: strings.AppOfficeEnvironment;
							break;
						case "Outlook": // running in Outlook
							environmentMessage = this.context.isServedFromLocalhost
								? strings.AppLocalEnvironmentOutlook
								: strings.AppOutlookEnvironment;
							break;
						case "Teams": // running in Teams
						case "TeamsModern":
							environmentMessage = this.context.isServedFromLocalhost
								? strings.AppLocalEnvironmentTeams
								: strings.AppTeamsTabEnvironment;
							break;
						default:
							environmentMessage = strings.UnknownEnvironment;
					}

					return environmentMessage;
				});
		}

		return Promise.resolve(
			this.context.isServedFromLocalhost
				? strings.AppLocalEnvironmentSharePoint
				: strings.AppSharePointEnvironment
		);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse("1.0");
	}

	private fetchConfigsFromList(): void {
		const { siteUrl, listName, valueProp, nameProp } = this.properties;

		if (!siteUrl || !listName || !valueProp || !nameProp) {
			alert("Invalid config list properties");
			return;
		}

		const sp = spfi(siteUrl).using(SPFx(this.context));

		Web([sp.web, siteUrl])
			.lists.getByTitle(listName)
			.items.select(this.properties.valueProp, this.properties.nameProp)()
			.then((items) => {
				this.setConfigsFromList(items);
			})
			.catch((error) => {
				console.error("Error fetching list items:", error);
				alert(
					"Error fetching list items. Please check the Site URL and List Name."
				);
			});
	}

	private setConfigsFromList(items: any[]): void {
		items.forEach((item) => {
			//@ts-expect-error PropertyName is not a valid property of item
			this.properties[item[this.properties.nameProp] as string] =
				item[this.properties.valueProp];
		});

		this.context.propertyPane.refresh();
		this.render();
	}
	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription,
					},
					displayGroupsAsAccordion: true,
					groups: [
						{
							groupName: "List Configuration",
							groupFields: [
								PropertyPaneTextField("siteUrl", {
									label: "Site URL",
									value: this.properties.siteUrl,
								}),
								PropertyPaneTextField("listName", {
									label: "List Name",
									value: this.properties.listName,
								}),
								PropertyPaneTextField("nameProp", {
									label: "PropertyName Column",
									value: this.properties.nameProp,
								}),
								PropertyPaneTextField("valueProp", {
									label: "PropertyValue Column",
									value: this.properties.valueProp,
								}),
								PropertyPaneButton("fetchList", {
									text: "Fetch List",
									onClick: this.fetchConfigsFromList.bind(this),
								}),
								PropertyPaneCheckbox("autoUpdate", {
									text: "Auto update paneproperty values",
									checked: this.properties.autoUpdate,
								}),
							],
						},
						{
							groupName: "Appearance",
							isCollapsed: this.isAppearanceGroupCollapsed,
							groupFields: [
								PropertyFieldColorPicker("color", {
									label: "Select text color",
									selectedColor: this.properties.color,
									onPropertyChange: (
										propertyPath: string,
										oldValue: any,
										newValue: any
									) => {
										this.onPropertyPaneFieldChanged(
											propertyPath,
											oldValue,
											newValue
										);
										if (propertyPath === "color") {
											this.themeManager._onTextColorPickerChange(newValue);
										}
									},
									properties: this.properties,
									disabled: false,
									debounce: 1000,
									style: PropertyFieldColorPickerStyle.Inline,
									iconName: "FontColor",
									key: "colorFieldId",
								}),
								PropertyFieldColorPicker("backgroundColor", {
									label: "Select background color",
									selectedColor: this.properties.backgroundColor,
									onPropertyChange: (
										propertyPath: string,
										oldValue: any,
										newValue: any
									) => {
										this.onPropertyPaneFieldChanged(
											propertyPath,
											oldValue,
											newValue
										);
										if (propertyPath === "backgroundColor") {
											this.themeManager._onBkgColorPickerChange(newValue);
										}
									},
									properties: this.properties,
									disabled: false,
									debounce: 1000,
									style: PropertyFieldColorPickerStyle.Inline,
									iconName: "BackgroundColor",
									key: "backgroundColorFieldId",
								}),
								PropertyFieldColorPicker("primaryColor", {
									label: "Select primary color",
									selectedColor: this.properties.primaryColor,
									onPropertyChange: (
										propertyPath: string,
										oldValue: any,
										newValue: any
									) => {
										this.onPropertyPaneFieldChanged(
											propertyPath,
											oldValue,
											newValue
										);
										if (propertyPath === "primaryColor") {
											this.themeManager._onPrimaryColorPickerChange(newValue);
										}
									},
									properties: this.properties,
									disabled: false,
									debounce: 1000,
									style: PropertyFieldColorPickerStyle.Inline,
									iconName: "Color",
									key: "primaryColorFieldId",
								}),
								PropertyPaneDropdown("viewOption", {
									label: "Change view",
									options: [
										{ key: "flow", text: "Flow" },
										{ key: "grid", text: "Grid" },
										{ key: "carousel", text: "Carousel" },
										{ key: "hero", text: "Hero" },
									],
                                    selectedKey: this.properties.viewOption || "hero"
								}),
							],
						},
					],
				},
			],
		};
	}
}
