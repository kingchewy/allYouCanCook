import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareShoppinglistPage } from './share-shoppinglist.page';

describe('ShareShoppinglistPage', () => {
  let component: ShareShoppinglistPage;
  let fixture: ComponentFixture<ShareShoppinglistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareShoppinglistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareShoppinglistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
