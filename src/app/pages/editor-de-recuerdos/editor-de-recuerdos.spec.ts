import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorDeRecuerdos } from './editor-de-recuerdos';

describe('EditorDeRecuerdos', () => {
  let component: EditorDeRecuerdos;
  let fixture: ComponentFixture<EditorDeRecuerdos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorDeRecuerdos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorDeRecuerdos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
