import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Photostream } from './components/photostream/photostream';
import { PhotoDetail } from './components/photo-detail/photo-detail';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  { path: '/photos', component: Photostream },
  { path: '/photos/:id', component: PhotoDetail },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [RouterModule]
})
export class PhotosModule { }
