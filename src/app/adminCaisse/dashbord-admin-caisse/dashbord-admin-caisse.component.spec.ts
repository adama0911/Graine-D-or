import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordAdminCaisseComponent } from './dashbord-admin-caisse.component';

describe('DashbordAdminCaisseComponent', () => {
  let component: DashbordAdminCaisseComponent;
  let fixture: ComponentFixture<DashbordAdminCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbordAdminCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordAdminCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
