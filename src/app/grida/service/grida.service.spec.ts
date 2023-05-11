import { TestBed } from '@angular/core/testing';

import { GridaService } from './grida.service';

describe('GridaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridaService = TestBed.get(GridaService);
    expect(service).toBeTruthy();
  });
});
