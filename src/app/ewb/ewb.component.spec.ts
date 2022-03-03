import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EwbComponent } from './ewb.component';

describe('EwbComponent', () => {
  let component: EwbComponent;
  let fixture: ComponentFixture<EwbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EwbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
