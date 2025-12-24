import { Routes } from '@angular/router';
import { Paths } from './shared/consts/routes.const';

export const routes: Routes = [
  { path: '', redirectTo: Paths.photos, pathMatch: 'full' },
  {
    path: Paths.photos,
    loadComponent: () => import('./modules/photos/components/photostream/photostream').then((m) => m.Photostream)
  },
  {
    path: Paths.photoDetails,
    loadComponent: () => import('./modules/photos/components/photo-detail/photo-detail').then((m) => m.PhotoDetail)
  },
  {
    path: Paths.favorites,
    loadComponent: () => import('./modules/favorites/components/favorites/favorites').then((m) => m.Favorites)
  }
];
