import {
  Component,
  inject,
  signal,
  viewChild,
  DestroyRef,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { PhotosApiService } from '../../../../shared/services/photos-api.service';
import { Photo } from '../../../../shared/interfaces/photo.inteface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Gallery } from '../../../../shared/components/gallery/gallery';
import { debounceTime, finalize, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'gallery-photostream',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, Gallery],
  templateUrl: './photostream.html',
  styleUrl: './photostream.scss',
})
export class Photostream implements AfterViewInit {
  /** List of photos to be displayed */
  public readonly photos = signal<Photo[]>([]);
  /** Is loading icon displayed */
  public readonly loading = signal(false);
  /** Reference to scroll container element */
  public readonly scrollContainer = viewChild('scrollContainer', { read: ElementRef });
  public readonly destroyRef = inject(DestroyRef);
  /** Is favorite icon hovered */
  protected favoriteHovered = signal<boolean>(false);
  private photosApiService = inject(PhotosApiService);

  /** Paging state */
  private paging = {
    /** Page size */
    limit: 50,
    /** Current page to be loaded */
    currentPage: 1,
    /** Max page loaded so far */
    maxLoadedPage: 1
  }
  /** All photos loaded so far */
  private inMemoryPhotos = signal<Photo[]>([]);

  ngAfterViewInit() {
    this.loadMorePhotos();
    this.setupScrollListener();
  }

  protected onPhotoHover(photo: Photo | null) {
    let isFav = false;
    if (photo) {
      isFav = this.photosApiService.isFavorite(photo.id)
    }
    this.favoriteHovered.set(isFav);
  }

  private setupScrollListener() {
    const nativeElement = this.scrollContainer()!.nativeElement as HTMLElement;
    fromEvent(nativeElement, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(50))
      .subscribe(() => {
        if (this.loading()) {
          return;
        }
        const threshold = 200;
        const scrollTop = nativeElement.scrollTop;
        const clientHeight = nativeElement.clientHeight;
        const scrollHeight = nativeElement.scrollHeight;
        const nearTop = scrollTop <= threshold;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

        if (nearBottom) { // next page
          if (this.paging.currentPage > this.paging.maxLoadedPage) {
            this.loadMorePhotos();
          } else {
            this.showNextFromMemory();
          }
        }

        if (nearTop && this.paging.currentPage > 2) {
          this.showPreviousFromMemory(nativeElement)
        }
      });

  }

  /** Show previous page from in-memory cache */
  private showPreviousFromMemory(container: HTMLElement) {
    const anchorEl = container.querySelector('.photo-card') as HTMLElement | null;
    const anchorId = anchorEl?.getAttribute('data-id');
    if (!anchorId) return;

    this.paging.currentPage--; // move one page up
    const { limit } = this.paging;
    const end = this.paging.currentPage * limit;
    const start = (this.paging.currentPage - 2) * limit;
    const newPage = this.inMemoryPhotos().slice(start, end);
    this.photos.set(newPage);

    queueMicrotask(() => {
      const newAnchor = container.querySelector(
        `.photo-card[data-id="${anchorId}"]`,
      ) as HTMLElement | null;
      if (newAnchor) {
        container.scrollTop = newAnchor.offsetTop;
      }
    });
  }

  /** Adds a photo to favorites using {@link PhotosApiService} */
  protected addToFavorites(photo: Photo) {
    if (this.photosApiService.isFavorite(photo.id)) {
      return;
    }
    this.photosApiService.addToFavorites(photo);
    this.favoriteHovered.set(true);
  }

  /** Show next page from in-memory cache */
  private showNextFromMemory() {
    this.loading.set(true);
    const { limit, currentPage } = this.paging;
    const start = (currentPage - 1) * limit;
    const end = start + 2 * limit; // window = 2 pages
    const newPage = this.inMemoryPhotos().slice(start, end);
    this.photos.set(newPage);
    this.paging.currentPage++;
    this.loading.set(false);
  }

  /** Load more photos from API, append to list, and update in-memory cache */
  private loadMorePhotos() {
    this.loading.set(true);
    const allPhotos = this.inMemoryPhotos();
    const { limit, currentPage } = this.paging;

    // Keep only the last n photos in DOM, for virtualization.
    const oldNo = currentPage > 1 ? allPhotos.length - limit : 0;
    const oldPhotos = oldNo ? allPhotos.slice(oldNo) : allPhotos;
    this.photosApiService.getPhotos(currentPage, limit)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(photos => {
        this.setPhotosUnique([...oldPhotos, ...photos]);
        this.inMemoryPhotos.set([...allPhotos, ...photos]);
        this.paging.currentPage++;
      })
  }

  /** Set photos ensuring uniqueness by ID */
  private setPhotosUnique(photos: Photo[]) {
    const seen = new Set<string>();
    this.photos.set(
      photos.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      }),
    );
  }

}

