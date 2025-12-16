import { TestBed } from '@angular/core/testing';

import { DbTask } from './db-task';

describe('DbTask', () => {
  let service: DbTask;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbTask);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
