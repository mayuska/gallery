import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { Photo } from '../interfaces/photo.inteface';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://picsum.photos/v2/list';
  /** Local storage key that holds all favorites photos */
  private readonly FAVORITES_KEY = 'gallery-favorites';
  /** in‑memory map of favorites, hydrated from localStorage */
  private favorites = new Map<string, Photo>();
  /** Random delay between 200-300 ms to simulate network latency */
  private readonly randomDelay = 200 + Math.floor(Math.random() * 101)

  constructor() {
    // Raw is either null (nothing saved yet) or a JSON string
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    if (raw) {
      try {
        const arr: Photo[] = JSON.parse(raw);
        // fills in‑memory favorites Map so:
        // - getFavorites() can just return Array.from(this.favorites.values()).
        // - getById(id) can be O(1) via this.favorites.get(id).
        // - isFavorite(id) is a simple has(id).
        arr.forEach(p => this.favorites.set(p.id, p));
      } catch {
        this.favorites.clear();
      }
    }
  }

  public getPhotos(page = 0, limit = 50): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}?page=${page}&limit=${limit}`).pipe(
      delay(this.randomDelay),
      map(items => items.map(i => {
        i.thumbPhotoUrl = `https://picsum.photos/id/${i.id}/400/400`;
        return i;
      })));
  }

  // Favorites relies only on local storage, not memory map. This is intentional to ensure that the source of truth is
  // always local storage, in case it is modified externally (clear local-storage).

  /** Get all favorite photos (persists across reload via localStorage). */
  public getFavorites(): Photo[] {
    return this.readFavorites();
  }

  /** Check if photo is already favorite. */
  public isFavorite(id: string): boolean {
    return this.readFavorites().some(p => p.id === id);
  }

  /** Get single favorite by id, or null if not found. */
  public getFavoriteById(id: string): Photo | null {
    return this.readFavorites().find(p => p.id === id) ?? null;
  }

  /** Add photo to favorites and persist. */
  public addToFavorites(photo: Photo): void {
    const favorites = this.readFavorites();
    if (favorites.some(p => p.id === photo.id)) {
      return;
    }
    favorites.push(photo);
    this.writeFavorites(favorites);
  }

  /** Remove photo from favorites and persist. */
  public removeFromFavorites(id: string): void {
    const favorites = this.readFavorites().filter(p => p.id !== id);
    this.writeFavorites(favorites);
  }

  /** Reads favorites array from local storage. Returns empty array if none or invalid JSON. */
  private readFavorites(): Photo[] {
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Photo[];
    } catch {
      return [];
    }
  }

  /** Writes favorites array to local storage under FAVORITES_KEY. */
  private writeFavorites(favorites: Photo[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

}
