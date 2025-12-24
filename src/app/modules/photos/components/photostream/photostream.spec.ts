import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photostream } from './photostream';

describe('Photostream', () => {
  let component: Photostream;
  let fixture: ComponentFixture<Photostream>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Photostream]
    }).compileComponents();

    fixture = TestBed.createComponent(Photostream);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
