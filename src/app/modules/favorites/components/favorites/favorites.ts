import { Component, inject, OnInit, signal } from '@angular/core';
import { PhotosApiService } from '../../../../shared/services/photos-api.service';
import { Photo } from '../../../../shared/interfaces/photo.inteface';
import { Gallery } from '../../../../shared/components/gallery/gallery';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router } from '@angular/router';
import { Paths } from '../../../../shared/consts/routes.const';

@Component({
  selector: 'gallery-favorites',
  imports: [
    Gallery,
    MatCard,
    MatCardContent
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  /** All favorites photos to be displayed */
  public readonly photos = signal<Photo[]>([])
  private readonly photosApiService = inject(PhotosApiService);
  private readonly router = inject(Router);

  public ngOnInit() {
    const favorites = this.photosApiService.getFavorites();
    this.photos.set(favorites);
  }

  protected openDetailView(photo: Photo) {
    this.router.navigate([Paths.photos, photo.id]);
  }
}
