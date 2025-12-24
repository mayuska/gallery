import { TestBed } from '@angular/core/testing';
import { PhotosApiService } from './photos-api.service';

describe('PhotosApiService', () => {
  let service: PhotosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});




