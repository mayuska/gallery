import { Component, inject, OnInit, signal } from '@angular/core';
import { Photo } from '../../../../shared/interfaces/photo.inteface';
import { MatCard, MatCardContent, MatCardFooter, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PhotosApiService } from '../../../../shared/services/photos-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Paths } from '../../../../shared/consts/routes.const';

@Component({
  selector: 'gallery-photo-detail',
  imports: [
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatButton,
    MatCardImage
  ],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss',
})
export class PhotoDetail implements OnInit {
  /** Photo to be displayed */
  public readonly photo = signal<Photo | null>(null);
  private readonly photosApiService = inject(PhotosApiService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit() {
    const photoId = this.activatedRoute.snapshot.paramMap.get('id');
    if (photoId) {
      this.photo.set(this.photosApiService.getFavoriteById(photoId));
    }
  }
  protected removeFromFavorites() {
    this.photosApiService.removeFromFavorites(this.photo()!.id);
    this.router.navigate([Paths.favorites]);
  }
}
