import { Component, inject, input, output, signal } from '@angular/core';
import { MatCard, MatCardImage } from '@angular/material/card';
import { Photo } from '../../interfaces/photo.inteface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'gallery-gallery',
  imports: [
    MatCard,
    MatCardImage,
    MatIcon
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  /** photos to be displayed */
  public readonly photos = input.required<Photo[]>();
  /** Mat icon name to be set on hover overlay  */
  public readonly clickIcon = input<string>('favorite')
  /** Emitted when a photo is clicked */
  public readonly clicked = output<Photo>();
  /** Emitted when a photo is hovered */
  public readonly hovered = output<Photo | null>();
  /** currently hovered photo. used for adding CSS class so parent component could add effects */
  protected hoveredPhotoId = signal<string | null>(null);

  /** Adds hovered id and emit hovered item */
  protected onPhotoHover(photo: Photo) {
    this.hoveredPhotoId.set(photo.id);
    this.hovered.emit(photo)
  }

  /** Removes hovered id and emit null for hovered item */
  protected onPhotoLeave() {
    this.hoveredPhotoId.set(null);
    this.hovered.emit(null);
  }
}
