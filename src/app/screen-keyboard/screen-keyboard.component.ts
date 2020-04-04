import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { CalcBtn } from './CalcBtn';
import { STD_KEYBOARD, EXTENDED_KEYBOARD, PROGRAMMER_KEYBOARD, DATETIME_KEYBOARD } from './keyboards';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-screen-keyboard',
  templateUrl: './screen-keyboard.component.html',
  styleUrls: ['./screen-keyboard.component.css']
})
export class ScreenKeyboardComponent {
  @Input() currInp: string;
  @Input() virtualPressColorInp: string;
  @Output() screenKeyClicked = new EventEmitter<string>();
  @ViewChild('mainDiv', { static: false }) myDiv: ElementRef<HTMLElement>;
  tiles: CalcBtn[];
  numCol: number = 5;

  constructor(private _translate: TranslateService) {
    this.tiles = STD_KEYBOARD;
  }

  setKeyboard(mode: string) {
    if (mode == 'standard') {
      this.tiles = STD_KEYBOARD;
      this.numCol = 5;
    } else if (mode == 'extended') {
      this.tiles = EXTENDED_KEYBOARD;
      this.numCol = 6;
    } else if (mode == 'programmer') {
      this.tiles = PROGRAMMER_KEYBOARD;
      this.numCol = 6;
    } else if (mode == 'date & time') {
      this.tiles = DATETIME_KEYBOARD;
      this.numCol = 5;
      // set timeunit translations
      this._translate.get('timeUnits').subscribe(x => {
        for (let t of this.tiles) {
          if (x[t.txt]) {
            t.txt = x[t.txt];
            t.fn = (s) => { return s + ' ' + x[t.txt] };
          }
        }
      });
    }
  }

  tileClicked(k: CalcBtn) {
    this.screenKeyClicked.emit(k.fn(this.currInp));
  }

  simulateKeyDown(key: string) {
    let t = this.findTileByKey(key);
    if (t) {
      t.isPressed = true;
    }
  }

  simulateKeyUp(key: string) {
    let t = this.findTileByKey(key);
    if (t) {
      t.isPressed = false;
    }
  }

  simulateKeyPress(isDown: boolean, key: string) {
    let t = this.findTileByKey(key);
    if (t) {
      t.isPressed = isDown;
    }
  }

  findTileByKey(key: string) {
    return this.tiles.find(x => x.ids.find(x => x == key));
  }
}
