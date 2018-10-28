import { TestBed, inject } from '@angular/core/testing';

import { FoodCalendarService } from './food-calendar.service';

describe('FoodCalendarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodCalendarService]
    });
  });

  it('should be created', inject([FoodCalendarService], (service: FoodCalendarService) => {
    expect(service).toBeTruthy();
  }));
});
