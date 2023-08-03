import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MylistPageComponent } from './mylist-page.component';

describe('MylistPageComponent', () => {
  let component: MylistPageComponent;
  let fixture: ComponentFixture<MylistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MylistPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MylistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
