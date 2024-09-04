// ThemeManager.ts
import { BaseSlots, createTheme, getColorFromString, IColor, isDark, IThemeRules, Theme, ThemeGenerator, themeRulesStandardCreator } from '@fluentui/react';

export class ThemeManager {
    private theme: Theme;
    private themeRules: IThemeRules;
    private fontFamily = "var(--fontFamilyCustomFont100, var(--fontFamilyBase))"


    constructor(primaryColor: string,  textColor:string, backgroundColor: string) {
        this.theme = createTheme();
        const {theme, rules} = this._buildInitialState(primaryColor, textColor, backgroundColor);
        this.theme = theme;
        this.themeRules = rules;
    }

    public getTheme(): Theme {
        return this.theme;
    }

    private makeNewTheme() {
        if (this.themeRules) {
            const themeAsJson: {
              [key: string]: string;
            } = ThemeGenerator.getThemeAsJson(this.themeRules);
      
            const finalTheme = createTheme({
              ...{ palette: themeAsJson },
              defaultFontStyle: { fontFamily: this.fontFamily },
              isInverted: isDark(this.themeRules[BaseSlots[BaseSlots.backgroundColor]].color!),
            });
            this.theme = finalTheme;
            return finalTheme;
          }
    }

    private _onColorChange = (baseSlot: BaseSlots, newColor: IColor | undefined) => {
        if (newColor) {
            if(this.themeRules){
                const currentIsDark = isDark(this.themeRules[BaseSlots[BaseSlots.backgroundColor]].color!);
                ThemeGenerator.setSlot(this.themeRules[BaseSlots[baseSlot]], newColor, currentIsDark, true, true);
                if (currentIsDark !== isDark(this.themeRules[BaseSlots[BaseSlots.backgroundColor]].color!)) {
                    // isInverted got swapped, so need to refresh slots with new shading rules
                    ThemeGenerator.insureSlots(this.themeRules, currentIsDark);
                }
            }
            return this.makeNewTheme();
        }
      };

      public _onPrimaryColorPickerChange = (newColor: IColor | undefined) => {
        return this._onColorChange(BaseSlots.primaryColor, newColor);
      };
    
      public _onTextColorPickerChange = (newColor: IColor | undefined) => {
        return this._onColorChange(BaseSlots.foregroundColor, newColor);
      };
    
      public _onBkgColorPickerChange = (newColor: IColor | undefined) => {
        return this._onColorChange(BaseSlots.backgroundColor, newColor);
      };

    private _buildInitialState = (primaryColor:string, textColor: string, backgroundColor: string): {theme:Theme, rules: IThemeRules} => {
        const themeRules = themeRulesStandardCreator();
        const colors = {
          primaryColor: getColorFromString(primaryColor)!,
          textColor: getColorFromString(textColor)!,
          backgroundColor: getColorFromString(backgroundColor)!,
        };
        ThemeGenerator.insureSlots(themeRules, isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!));
        ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.primaryColor]], colors.primaryColor, undefined, true, true);
        ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.foregroundColor]], colors.textColor, undefined, true, true);
        ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.backgroundColor]], colors.backgroundColor, undefined, true, true);
    
        const themeAsJson: {
          [key: string]: string;
        } = ThemeGenerator.getThemeAsJson(themeRules);
    
        const finalTheme = createTheme({
          ...{ palette: themeAsJson },
          defaultFontStyle: { fontFamily: this.fontFamily },
          isInverted: isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!),
        });
    
        const state = {
          ...colors,
          theme: finalTheme,
          rules: themeRules,
        };
    
        return state;
      };
}