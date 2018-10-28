import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCalendarPage } from './food-calendar.page';

describe('FoodCalendarPage', () => {
  let component: FoodCalendarPage;
  let fixture: ComponentFixture<FoodCalendarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodCalendarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
