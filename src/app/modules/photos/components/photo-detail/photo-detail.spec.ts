import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetail } from './photo-detail';
import { PhotosApiService } from '../../../../shared/services/photos-api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { Photo } from '../../../../shared/interfaces/photo.inteface';
import { Paths } from '../../../../shared/consts/routes.const';


const mockPhoto = {
  id: '123',
  thumbPhotoUrl: 'https://picsum.photos/id/123/400/400',
} as Photo;

const PhotosApiServiceMock = {
  getFavoriteById: vi.fn().mockReturnValue(mockPhoto),
  removeFromFavorites: vi.fn(),
}

const ActivatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => (key === 'id' ? '123' : null),
    },
  },
  params: of({} as Params),
}

const RouterMock = {
  navigate: vi.fn(),
}


describe('PhotoDetail', () => {
  let component: PhotoDetail;
  let fixture: ComponentFixture<PhotoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetail],
      providers: [
        { provide: PhotosApiService, useValue: PhotosApiServiceMock },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock, },
        { provide: Router, useValue: RouterMock },
      ],
    }).overrideComponent(PhotoDetail, {
      set: {
        template: '',
        imports: []
      }
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load photo from service using route id', () => {
    expect(PhotosApiServiceMock.getFavoriteById).toHaveBeenCalledWith('123');
    expect(component.photo()).toEqual(mockPhoto);
  });

  it('removeFromFavorites should remove photo and navigate back to favorites', () => {
    // precondition: photo signal contains mockPhoto from ngOnInit
    (component as any).removeFromFavorites();
    expect(PhotosApiServiceMock.removeFromFavorites).toHaveBeenCalledWith('123');
    expect(RouterMock.navigate).toHaveBeenCalledWith([Paths.favorites]);
  });
});
