import { Injectable } from '@angular/core';

export interface UserSetting {
  mode: string;
  lang: string;
  selectedFloatingPointPrecision: number;
  numDigit4Results: number;
  isIgnoreComma: boolean;
  floatingPointMarker: string;
  path2CssTheme: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {
  private settings: UserSetting = {
    mode: 'extended', floatingPointMarker: '.', isIgnoreComma: true, lang: 'tr',
    numDigit4Results: 10, selectedFloatingPointPrecision: 2, path2CssTheme: 'assets/prebuilt-themes/indigo-pink.css'
  };

  constructor() {
    if (!('localStorage' in window)) {
      console.log('localStorage does not exists! User settings will not be persistent');
      return;
    }
  }

  setSetting(name: string, val: any) {
    localStorage.setItem(name, val);
  }

  getSetting(name: string): any {
    let i = localStorage.getItem(name);
    if (i == null || i == undefined || i.length < 1) {
      return this.settings[name];
    }
    if (name == 'mode' || name == 'floatingPointMarker' || name == 'path2CssTheme' || name == 'lang') {
      return i;
    }
    if (name == 'selectedFloatingPointPrecision' || name == 'numDigit4Results') {
      return Number(i);
    }
    return i === 'true';
  }

  getAllUserSettings(): UserSetting {
    for (let name in this.settings) {
      this.settings[name] = this.getSetting(name);
    }
    return this.settings;
  }
}
