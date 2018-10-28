import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCreatePage } from './food-create.page';

describe('FoodCreatePage', () => {
  let component: FoodCreatePage;
  let fixture: ComponentFixture<FoodCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
