import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaPage } from './biblioteca-page';

describe('BibliotecaPage', () => {
  let component: BibliotecaPage;
  let fixture: ComponentFixture<BibliotecaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
