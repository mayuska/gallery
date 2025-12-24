import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gallery } from './gallery';
import { Photo } from '../../interfaces/photo.inteface';

const photoMock = {
  id: '123',
  thumbPhotoUrl: 'https://picsum.photos/id/123/400/400',
} as Photo;

describe('Gallery', () => {
  let component: Gallery;
  let fixture: ComponentFixture<Gallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gallery]
    }).overrideComponent(Gallery, {
      set: {
        template: ``,
        imports: []
      }
    }).compileComponents();

    fixture = TestBed.createComponent(Gallery);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photos', photoMock);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onPhotoHover should set hoveredPhotoId and emit hovered photo', () => {
    const hoveredSpy = vi.fn();
    component.hovered.subscribe(hoveredSpy);

    (component as any).onPhotoHover(photoMock);
    expect((component as any).hoveredPhotoId()).toBe('123');
    expect(hoveredSpy).toHaveBeenCalledWith(photoMock);
  });

  it('onPhotoLeave should clear hoveredPhotoId and emit null', () => {
    (component as any).hoveredPhotoId.set('123');
    const hoveredSpy = vi.fn();
    component.hovered.subscribe(hoveredSpy);

    (component as any).onPhotoLeave();
    expect((component as any).hoveredPhotoId()).toBeNull();
    expect(hoveredSpy).toHaveBeenCalledWith(null);
  });
});
