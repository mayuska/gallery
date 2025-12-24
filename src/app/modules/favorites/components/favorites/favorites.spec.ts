import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Favorites } from './favorites';
import { Router } from '@angular/router';
import { Photo } from '../../../../shared/interfaces/photo.inteface';
import { Paths } from '../../../../shared/consts/routes.const';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;
  let navigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    navigateSpy = vi.fn();
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        { provide: Router, useValue: { navigate: navigateSpy } }
      ]
    }).overrideComponent(Favorites, {
      set: {
        template: '',
        imports: []
      }
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to photo detail on openDetailView', () => {
    const photo = {
      id: '123',
      thumbPhotoUrl: 'https://picsum.photos/id/123/400/400',
    } as Photo;

    (component as any).openDetailView(photo);
    expect(navigateSpy).toHaveBeenCalledWith([Paths.photos, '123']);
  });
});
