import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNewComponent } from './home-new.component';

describe('HomeNewComponent', () => {
  let component: HomeNewComponent;
  let fixture: ComponentFixture<HomeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
