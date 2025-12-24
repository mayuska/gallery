import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Paths } from '../../../shared/consts/routes.const';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'gallery-navigation',
  imports: [
    RouterLink,
    MatToolbar,
    RouterLinkActive,
    MatButton
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  /** Expose Paths enum to template */
  protected readonly Paths = Paths;
}
