import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinvComponent } from './einv.component';

describe('EinvComponent', () => {
  let component: EinvComponent;
  let fixture: ComponentFixture<EinvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
