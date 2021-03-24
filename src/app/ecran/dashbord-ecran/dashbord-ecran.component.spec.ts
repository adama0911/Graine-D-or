import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordEcranComponent } from './dashbord-ecran.component';

describe('DashbordEcranComponent', () => {
  let component: DashbordEcranComponent;
  let fixture: ComponentFixture<DashbordEcranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbordEcranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordEcranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
