import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSelectorPage } from './food-selector.page';

describe('FoodSelectorPage', () => {
  let component: FoodSelectorPage;
  let fixture: ComponentFixture<FoodSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodSelectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
