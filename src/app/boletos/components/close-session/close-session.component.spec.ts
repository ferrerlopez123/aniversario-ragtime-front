import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSessionComponent } from './close-session.component';

describe('CloseSessionComponent', () => {
  let component: CloseSessionComponent;
  let fixture: ComponentFixture<CloseSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
