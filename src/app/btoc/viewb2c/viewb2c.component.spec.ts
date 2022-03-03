import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewb2cComponent } from './viewb2c.component';

describe('Viewb2cComponent', () => {
  let component: Viewb2cComponent;
  let fixture: ComponentFixture<Viewb2cComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Viewb2cComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Viewb2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
