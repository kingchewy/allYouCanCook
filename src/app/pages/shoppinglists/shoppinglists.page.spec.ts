import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppinglistsPage } from './shoppinglists.page';

describe('ShoppinglistsPage', () => {
  let component: ShoppinglistsPage;
  let fixture: ComponentFixture<ShoppinglistsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppinglistsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppinglistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
