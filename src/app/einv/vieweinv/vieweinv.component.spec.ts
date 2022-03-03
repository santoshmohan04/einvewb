import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweinvComponent } from './vieweinv.component';

describe('VieweinvComponent', () => {
  let component: VieweinvComponent;
  let fixture: ComponentFixture<VieweinvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VieweinvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VieweinvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
