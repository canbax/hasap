import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { evaluate, format } from 'mathjs'
import { ClipboardService } from 'ngx-clipboard'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScreenKeyboardComponent } from './screen-keyboard/screen-keyboard.component';
import { TrigonometricFnArg, DateTimeChip, TIME_UNITS, getPrettyTime, TIME_UNIT_STR } from './meta-types';
import { STD_KEYBOARD, EXTENDED_KEYBOARD, PROGRAMMER_KEYBOARD } from './screen-keyboard/keyboards';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MathFnGroup, _filter, fnGroups, fnGroupExpo } from './math-fn';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserSettingService, UserSetting } from './user-setting.service';
import { TranslateService } from '@ngx-translate/core';
import flatpickr from 'flatpickr';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
        // animate('1s')

      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 }))
        // animate('1s')
      ])
    ]
    )
  ],
})
export class AppComponent implements OnInit {

  fnListForm: FormGroup = this._formBuilder.group({
    fnGroup: '',
  });
  fnGroupOptions: Observable<MathFnGroup[]>;

  // results for 4 bases
  results: any[] = ['', '', '', ''];
  settings: UserSetting;
  degreeUnit: string = 'deg';
  degreeUnits: string[] = ['deg', 'rad', 'grad'];
  bases: string[] = [];
  base: string = 'DEC';
  isTrigonometric: boolean = false;
  modes: string[];
  inp: string = '';
  inpParsed: string = '';
  private modelChanged: Subject<string> = new Subject<string>();
  private keyPressed: Subject<string> = new Subject<string>();
  isOpen: boolean;

  @ViewChild(ScreenKeyboardComponent, { static: false })
  private _screenKeyboard: ScreenKeyboardComponent;
  @ViewChild('userInp', { static: false })
  private _userInp: ElementRef;
  @ViewChild('userDateInp2', { static: false })
  private _usrDateInp: ElementRef;
  private hex2dec = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
  };
  private keyboardOps: string[] = [];
  private readonly KEY_UP_DEBOUNCE = 510;
  private readonly INP_CHANGE_DEBOUNCE = 300;
  private readonly PUSH_HISTORY_MS = 1000;
  private readonly HISTORY_STACK_SIZE = 33;
  suggestions = [];
  fnExpo = '';
  link2fn = '';
  isShowHistory = false;
  computeHistory: string[] = [];
  cssThemes = [
    { path: 'assets/prebuilt-themes/deeppurple-amber.css', txt: 'deep purple-amber (light)' },
    { path: 'assets/prebuilt-themes/indigo-pink.css', txt: 'indigo pink (light)' },
    { path: 'assets/prebuilt-themes/pink-bluegrey.css', txt: 'pink blue-grey (dark)' },
    { path: 'assets/prebuilt-themes/purple-green.css', txt: 'purple green (dark)' }];
  langs = { 'tr': 'Türkçe', 'en': 'English' };
  dateChips: DateTimeChip[] = [];
  readonly separatorKeysCodes: number[] = [ENTER];
  isTimeUnitAutoCompleteOpen = false;
  opChips4DateTime = ['+', '-', '*', '/', '÷', '(', ')', '^'];
  dateUnits = [];
  isDateSelected = false;
  currBtnPressColor: string = '';
  cssTheme2BtnPressColor: string[] = ['#E0E0E0', '#E0E0E0', '#5C5C5C', '#5C5C5C'];
  @ViewChild(MatRipple) ripple: MatRipple;
  usrHint = '';
  isAnimateTitle = true;

  constructor(private _clipboardService: ClipboardService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder,
    private _usrSetting: UserSettingService, public translate: TranslateService) {
    this.modes = ['standard', 'extended', 'programmer', 'date & time'];
    this.settings = this._usrSetting.getAllUserSettings();
    let fn = this.debounce(this.compute.bind(this), this.INP_CHANGE_DEBOUNCE);
    this.modelChanged.pipe(
      distinctUntilChanged())
      .subscribe(x => {
        if (this.settings.mode == 'date & time') {
          if (x) {
            this._usrDateInp.nativeElement.value = x;
          }
        }
        this.inp = x;
        this.handleOpSingleParanthesis();
        fn();
      });

    // to prevent the glitch when you press continously, debounceTime should be greater than 500ms 
    // some keyup events are NOT catched, for example (^). Subscribe to call keyup for every keydown
    this.keyPressed.subscribe(x => setTimeout(() => {
      if (this._screenKeyboard) {
        this._screenKeyboard.simulateKeyPress(false, x)
      }
    }, this.KEY_UP_DEBOUNCE));
    this.isOpen = false;
    this.onCssThemeChange();
    translate.addLangs(['en', 'tr']);
    translate.setDefaultLang(this.settings.lang);
    this.dateUnits = Object.values(TIME_UNIT_STR[this.settings.lang]);
  }

  ngOnInit() {
    setTimeout(() => this.onModeChange(), 0);
    this.keyboardOps = STD_KEYBOARD.filter(x => x.isOp).map(x => x.fn(''));
    this.keyboardOps.push(...EXTENDED_KEYBOARD.filter(x => x.isOp).map(x => x.fn('')));
    this.keyboardOps.push(...PROGRAMMER_KEYBOARD.filter(x => x.isOp).map(x => x.fn('')));
    this.keyboardOps = this.keyboardOps.map(x => x.substring(0, x.length - 1));

    this.suggestions = STD_KEYBOARD.map(x => x.fn(''));
    this.suggestions.push(...EXTENDED_KEYBOARD.map(x => x.fn('')));
    this.suggestions.push(...PROGRAMMER_KEYBOARD.map(x => x.fn('')));

    this.fnGroupOptions = this.fnListForm.get('fnGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
    setInterval(this.keepHistory.bind(this), this.PUSH_HISTORY_MS);

    this.initFlatPickr();

    this.setHtmlTitle();
    setTimeout(() => { this.isAnimateTitle = false }, 3000);
  }

  syncInp() {
    this.inp = this._usrDateInp.nativeElement.value;
    if (this.inp == undefined) {
      this.inp = '';
    }
  }

  switchLang() {
    this.translate.use(this.settings.lang).subscribe(() => {
      this._usrSetting.setSetting('lang', this.settings.lang);
      this.dateUnits = Object.values(TIME_UNIT_STR[this.settings.lang]);
      if (this._screenKeyboard) {
        this._screenKeyboard.setKeyboard(this.settings.mode);
      }
      this.refreshSideNav();
    });
    this.setHtmlTitle();
  }

  fnSelected(e: MatAutocompleteSelectedEvent) {
    let s = e.option.value as string;
    this.link2fn = 'https://mathjs.org/docs/reference/functions/' + s.substr(0, s.indexOf('(')) + '.html'
    s = s.substr(0, s.indexOf('(') + 1);
    this.inp = this.inp + s + ')';
    this.setCursor2SecondLast();
    this._userInp.nativeElement.focus();
    let group = e.option.group.label;
    let val = e.option.value;

    let idx = fnGroups.find(x => x.title == group).fnList.findIndex(x => x == val);
    this.fnExpo = fnGroupExpo.find(x => x.title == group).fnList[idx];
    this.refreshSideNav();
  }

  onModeChange() {
    if (this._screenKeyboard) {
      this._screenKeyboard.setKeyboard(this.settings.mode);
    }
    this.calculateResultsOnOtherBases();
    if (this.settings.mode == 'programmer') {
      this.bases = ['HEX', 'DEC', 'OCT', 'BIN'];
      this.settings.isIgnoreComma = false;
      this.settings.floatingPointMarker = '.';
    } else {
      this.bases = [];
    }
    this._usrSetting.setSetting('mode', this.settings.mode);
    if (this.settings.mode == 'date & time') {
      this.initFlatPickr();
    }
    this.refreshSideNav();
  }

  changed(text: string) {
    this.modelChanged.next(text);
  }

  compute() {
    try {
      this.usrHint = '';
      let str = this.inp;
      if (this.settings.mode == 'date & time') {
        str = this.compute4dateTime();
      }
      str = this.convertBrackets(str);
      str = this.convert4AngleUnit(str);
      if (this.settings.mode != 'programmer') {
        if (this.settings.floatingPointMarker == ',') {
          str = str.replace(/,/g, '.');
        } else if (this.settings.isIgnoreComma) {
          str = str.replace(/,/g, '');
        }
      }
      str = this.convertBase2Dec(str);
      this.results[1] = evaluate(str);
      const t = typeof this.results[1];
      if (t == 'function' || t == 'undefined') {
        this.results[1] = '';
      }
      if (t == 'number' && !Number.isInteger(this.results[1])) {
        this.results[1] = this.results[1].toFixed(this.settings.selectedFloatingPointPrecision);
      }

      this.results[1] = format(this.results[1],
        {
          notation: 'auto', upperExp: this.settings.numDigit4Results,
          lowerExp: -this.settings.numDigit4Results
        });
      this.results[1] = this.results[1].replace(new RegExp('"|\'', 'g'), '')
      // this.results[1] = (this.results[1]+ '').substr(0, this.settings.numDigit4Results);
      if (this.settings.mode == 'date & time') {
        this.results[1] = this.getResult4DateTime(this.results[1]);
      }
      this.calculateResultsOnOtherBases();
      this.launchRipple();
    } catch (e) {
      this.translate.get('mathParseError').subscribe(x => {
        this.usrHint = x;
      })
      this.results = ['', '', '', ''];
      console.log('e: ', e);
    }
  }

  copy(txt: string) {
    this._clipboardService.copyFromContent(txt);
    this.showSnackbar(`'${txt}' copied!`);
  }

  onScreenKeyClicked(txt: string) {
    this.modelChanged.next(txt);
    if (this.settings.mode != 'date & time') {
      this._userInp.nativeElement.focus();
    } else {
      this._usrDateInp.nativeElement.focus();
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey || e.altKey || e.key == 'Control') {
      return;
    }
    this.keyPressed.next(e.key);
    if (this._screenKeyboard) {
      this._screenKeyboard.simulateKeyPress(true, e.key);
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (e.ctrlKey || e.altKey || e.key == 'Control') {
      return;
    }
    if (this._screenKeyboard) {
      this._screenKeyboard.simulateKeyPress(false, e.key);
    }
  }

  loadFromHistory(o: string) {
    this.inp = o;
    this.compute();
  }

  keepHistory() {
    const s = this.computeHistory.length;
    if (this.computeHistory.findIndex(x => x == this.inp) > -1) {
      return;
    }
    if (this.results[1].length > 0) {
      this.computeHistory.push(this.inp);
    }
    if (s > this.HISTORY_STACK_SIZE) {
      this.computeHistory.pop();
    }
  }

  deleteFromHistory(i: number) {
    this.computeHistory.splice(i, 1);
  }

  floatingPrecisionChanged() {
    this._usrSetting.setSetting('selectedFloatingPointPrecision', this.settings.selectedFloatingPointPrecision);
    this.compute();
  }

  numDigit4ResultChanged() {
    this._usrSetting.setSetting('numDigit4Results', this.settings.numDigit4Results);
    this.compute();
  }

  isIgnoreCommaChanged() {
    this.settings.isIgnoreComma = !this.settings.isIgnoreComma;
    this._usrSetting.setSetting('isIgnoreComma', this.settings.isIgnoreComma);
    this.compute();
  }

  floatMarkerChanged() {
    this._usrSetting.setSetting('floatingPointMarker', this.settings.floatingPointMarker);
    this.compute();
  }

  onCssThemeChange() {
    // assets/prebuilt-themes/
    document.getElementById('theme-asset')['href'] = this.settings.path2CssTheme;
    this._usrSetting.setSetting('path2CssTheme', this.settings.path2CssTheme);
    let i = this.cssThemes.findIndex(x => x.path == this.settings.path2CssTheme);
    this.currBtnPressColor = this.cssTheme2BtnPressColor[i];
  }

  addChip(event: MatChipInputEvent): void {
    let value = event.value.trim();
    this.processInp4chips();
    if (value.length > 0) {
      this.dateChips.push({ val: Number(value), str: value, isHumanDate: false });
    }
    this.compute();
  }

  removeChip(index: number): void {
    this.dateChips.splice(index, 1);
    this.compute();
  }

  timeUnitSelected(e) {
    let s = this._usrDateInp.nativeElement.value.trim();
    let unit = e.option.viewValue;
    this.processInp4chips();
    if (s.length < 1) {
      s = '1';
    }
    this.dateChips.push({ isHumanDate: false, str: s + unit, val: Number(s) });
    this.compute();
  }

  private initFlatPickr() {
    if (this.settings.mode != 'date & time') {
      return;
    }
    setTimeout(() => {
      let dateElem = document.querySelector('#date-inp');
      if (dateElem && dateElem['_flatpickr']) {
        return;
      }
      flatpickr('#date-inp', {
        defaultDate: new Date(), enableTime: true, enableSeconds: true, time_24hr: true,
        onClose: () => {
          if (this.isDateSelected) {
            let d1 = document.querySelector('#date-inp')['_flatpickr'].selectedDates[0] as Date;
            this.processInp4chips();
            this.dateChips.push({ isHumanDate: true, str: d1.toLocaleString(), val: d1.getTime() });
            this.isDateSelected = false;
            this.compute();
          }
        }, onChange: () => { this.isDateSelected = true; }
      });
    }, 1000);
  }

  private setHtmlTitle() {
    let e = document.getElementsByTagName('title')[0];
    this.translate.get('appTitle').subscribe(x => {
      e.text = x;
    });
  }

  private handleOpSingleParanthesis() {
    if (!this._screenKeyboard) {
      return;
    }
    let currOps = this._screenKeyboard.tiles.filter(x => x.isOp);
    for (let i = 0; i < currOps.length; i++) {
      if (this.inp.trim().endsWith(currOps[i].fn(''))) {
        this.inp += ')';
        this.setCursor2SecondLast();
      }
    }
  }

  private setCursor2SecondLast() {
    setTimeout(() => {
      this._userInp.nativeElement.selectionStart = this.inp.length - 1;
      this._userInp.nativeElement.selectionEnd = this.inp.length - 1;
    }, 0);
  }

  private launchRipple() {
    const rippleRef = this.ripple.launch({
      persistent: true,
      centered: true
    });

    // Fade out the ripple later.
    rippleRef.fadeOut();
  }

  private processInp4chips() {
    let s = this._usrDateInp.nativeElement.value.trim();
    if (this.opChips4DateTime.includes(s)) {
      this.dateChips.push({ isHumanDate: false, str: s, val: 0 });
    }
    this._usrDateInp.nativeElement.value = '';
    this.inp = '';
  }

  private compute4dateTime(): string {
    let s = '';
    for (let i = 0; i < this.dateChips.length; i++) {
      let c = this.dateChips[i];
      if (c.isHumanDate) {
        s += c.val;
      } else {
        if (i > 0 && !this.dateChips[i - 1].isHumanDate && !this.isContainDateOp(c.str) && !this.isContainDateOp(this.dateChips[i - 1].str)) {
          s += '+' + c.str;
        } else {
          s += c.str;
        }
      }
    }
    for (let u in TIME_UNIT_STR[this.settings.lang]) {
      s = s.replace(new RegExp(TIME_UNIT_STR[this.settings.lang][u], 'g'), '*' + TIME_UNITS[u]);
    }
    console.log('compute4dateTime:', s);
    return s;
  }

  private isContainDateOp(s: string) {
    for (let i = 0; i < this.opChips4DateTime.length; i++) {
      if (s.includes(this.opChips4DateTime[i])) {
        return true;
      }
    }
    return false;
  }

  private getResult4DateTime(result: string): string {
    let hasHumanDate = false;
    for (let c of this.dateChips) {
      if (c.isHumanDate) {
        hasHumanDate = true;
      }
    }
    if (hasHumanDate) {
      return new Date(Number(result)).toLocaleString();
    } else {
      return getPrettyTime(Number(result), this.settings.lang);
    }
  }

  private refreshSideNav() {
    let state = this.isOpen;
    setTimeout(() => this.isOpen = !state, 0);
    setTimeout(() => this.isOpen = state, 1);
  }

  private _filterGroup(value: string): MathFnGroup[] {
    if (value) {
      return fnGroups
        .map(group => ({ title: group.title, fnList: _filter(group.fnList, value) }))
        .filter(group => group.fnList.length > 0);
    }
    return fnGroups;
  }

  private calculateResultsOnOtherBases() {
    if (this.settings.mode != 'programmer') {
      return;
    }
    if (this.results[1] == undefined || this.results[1].length < 1) {
      this.results = ['', '', '', ''];
      return;
    }
    let n = Number(this.results[1]);
    this.results[0] = n.toString(16).substr(0, this.settings.numDigit4Results);
    this.results[2] = n.toString(8).substr(0, this.settings.numDigit4Results);
    this.results[3] = n.toString(2).substr(0, this.settings.numDigit4Results);
  }

  private showSnackbar(txt: string) {
    this._snackBar.open(txt, 'OK', {
      duration: 2000
    });
  }

  private convert4AngleUnit(r: string) {
    this.isTrigonometric = false;
    let items = this.getTrigonometricFnArgs(r);
    this.isTrigonometric = items.length > 0;
    let orderedItems = this.sortTopological(items);
    for (let i = orderedItems.length - 1; i > -1; i--) {
      let txtOrder = orderedItems[i].txtOrder;
      let arg = r.slice(items[txtOrder].start + 1, items[txtOrder].end);
      let s0 = r.slice(0, items[txtOrder].start + 1);
      let s2 = r.slice(items[txtOrder].end, r.length);
      r = s0 + '(' + arg + ') ' + this.degreeUnit + s2;
      items = this.getTrigonometricFnArgs(r);
    }
    return r;
  }

  private getTrigonometricFnArgs(str: string) {
    let regexp = new RegExp('sin|cos|tan', 'g');
    let match: RegExpExecArray, matches = [];
    while ((match = regexp.exec(str)) != null) {
      matches.push(match.index + 3);
    }

    let items: TrigonometricFnArg[] = [];
    for (let i = 0; i < matches.length; i++) {
      let [s, e] = this.getExprIdxs(str, matches[i]);
      items.push({ start: s, end: e, isMarked: false, txtOrder: i, topologicalOrder: -1 });
    }
    return items;
  }

  private convertBrackets(str): string {
    str = str.replace(/{/g, '(');
    str = str.replace(/}/g, ')');
    str = str.replace(/\[/g, '(');
    str = str.replace(/\]/g, ')');
    return str;
  }

  private getExprIdxs(str: string, idx: number): number[] {
    let stack = [];
    let r = [0, 0];
    while (str[idx] != '(' && idx < str.length) {
      idx++;
    }
    r[0] = idx;
    stack.push(str[idx]);

    while (stack.length > 0 && idx < str.length) {
      idx++;
      let ch = str[idx];
      if (ch == '(') {
        stack.push(ch);
      } else if (ch == ')') {
        stack.pop();
      }
    }
    r[1] = idx;

    return r;
  }

  private sortTopological(items: TrigonometricFnArg[]): TrigonometricFnArg[] {
    let stack: TrigonometricFnArg[] = [];

    for (let i = 0; i < items.length; i++) {
      let curr = items[i];
      if (!curr.isMarked) {
        this.sortTopologicalUtil(curr, stack, items)
      }
    }
    return stack;
  }

  private sortTopologicalUtil(curr: TrigonometricFnArg, stack: TrigonometricFnArg[], items: TrigonometricFnArg[]) {
    curr.isMarked = true;
    let children = this.getChildrens(items, curr);
    for (let i = 0; i < children.length; i++) {
      if (!children[i].isMarked) {
        this.sortTopologicalUtil(children[i], stack, items);
      }
    }
    stack.push(curr);
  }

  private getChildrens(items: TrigonometricFnArg[], curr: TrigonometricFnArg): TrigonometricFnArg[] {
    let r = [];
    let s = curr.start;
    let e = curr.end;

    for (let i = 0; i < items.length; i++) {
      if (i == curr.txtOrder) {
        continue;
      }
      if (s < items[i].start && e < items[i].end) {
        r.push(items[i]);
      }
    }
    return r;
  }

  // math.js works with decimals
  private convertBase2Dec(s: string) {
    if (this.settings.mode != 'programmer') {
      return s;
    }
    let idx = 0;
    let regexp = new RegExp('[0123456789ABCDEFabcdef]+');
    let m: RegExpExecArray;
    while ((m = regexp.exec(s.substring(idx))) != null) {
      if (this.isInOperators(s, m.index + idx)) {
        idx = idx + m[0].length;
        continue;
      }
      let matchIdx = idx + m.index;
      let s1 = s.substr(0, matchIdx);
      let s2 = s.substr(matchIdx + m[0].length, s.length);
      let b = 10;
      if (this.base == 'HEX') {
        b = 16;
      }
      if (this.base == 'OCT') {
        b = 8;
      }
      if (this.base == 'BIN') {
        b = 2;
      }
      let s0 = s.substr(matchIdx, m[0].length);
      let r = this.convert2dec(s0, b);
      idx = s1.length + r.length;
      s = s1 + '' + r + s2;
    }
    return s;
  }

  private convert2dec(s: string, fromBase: number): string {
    if (fromBase == 10) {
      return s;
    }
    let n = 0;
    let pow = 0;
    for (let i = s.length - 1; i > -1; i--) {
      n += this.hex2dec[s[i]] * Math.pow(fromBase, pow);
      pow += 1;
    }
    return n + '';
  }

  private isInOperators(s: string, i: number): boolean {

    let regexp = new RegExp(this.keyboardOps.join('|'), 'gi');
    let match: RegExpExecArray, matches: RegExpExecArray[] = [];
    while ((match = regexp.exec(s)) != null) {
      matches.push(match);
    }

    let isIn = false;
    for (let m of matches) {

      if (i >= m.index && i <= (m.index + m[0].length)) {
        return true;
      }
    }
    return isIn;
  }

  // https://davidwalsh.name/javascript-debounce-function
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  private debounce(func: Function, wait: number, immediate: boolean = false) {
    let timeout;
    return function () {
      const context = this, args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}
