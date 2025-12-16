import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApuntesPage } from './apuntes.page';

describe('ApuntesPage', () => {
  let component: ApuntesPage;
  let fixture: ComponentFixture<ApuntesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuntesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
