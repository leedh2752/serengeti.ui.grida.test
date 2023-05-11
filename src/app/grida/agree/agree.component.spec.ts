import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreeComponent } from './agree.component';

describe('AgreeComponent', () => {
  let component: AgreeComponent;
  let fixture: ComponentFixture<AgreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
