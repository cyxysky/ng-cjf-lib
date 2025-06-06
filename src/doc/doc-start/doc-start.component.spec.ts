import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocStartComponent } from './doc-start.component';

describe('DocStartComponent', () => {
  let component: DocStartComponent;
  let fixture: ComponentFixture<DocStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
