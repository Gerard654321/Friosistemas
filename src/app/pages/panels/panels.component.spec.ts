import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panels } from './panels.component';

describe('Panels', () => {
  let component: Panels;
  let fixture: ComponentFixture<Panels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
