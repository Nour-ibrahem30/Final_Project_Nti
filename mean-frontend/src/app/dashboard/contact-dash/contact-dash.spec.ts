import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDash } from './contact-dash';

describe('ContactDash', () => {
  let component: ContactDash;
  let fixture: ComponentFixture<ContactDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
