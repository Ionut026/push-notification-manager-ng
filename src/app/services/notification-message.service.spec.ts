import { TestBed } from '@angular/core/testing';

import { NotificationMessageService } from './notification-message.service';

describe('NotificationMessageService', () => {
  let service: NotificationMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
