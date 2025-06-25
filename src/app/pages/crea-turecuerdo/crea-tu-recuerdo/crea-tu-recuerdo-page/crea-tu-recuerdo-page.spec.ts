import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaTuRecuerdoPage } from './crea-tu-recuerdo-page';

describe('CreaTuRecuerdoPage', () => {
  let component: CreaTuRecuerdoPage;
  let fixture: ComponentFixture<CreaTuRecuerdoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaTuRecuerdoPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaTuRecuerdoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
