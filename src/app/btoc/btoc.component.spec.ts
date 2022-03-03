import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtocComponent } from './btoc.component';

describe('BtocComponent', () => {
  let component: BtocComponent;
  let fixture: ComponentFixture<BtocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
