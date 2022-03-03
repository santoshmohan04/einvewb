import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewewbComponent } from './viewewb.component';

describe('ViewewbComponent', () => {
  let component: ViewewbComponent;
  let fixture: ComponentFixture<ViewewbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewewbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewewbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
