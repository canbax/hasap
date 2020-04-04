import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenKeyboardComponent } from './screen-keyboard.component';

describe('ScreenKeyboardComponent', () => {
  let component: ScreenKeyboardComponent;
  let fixture: ComponentFixture<ScreenKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
