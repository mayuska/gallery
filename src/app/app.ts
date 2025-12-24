import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navigation} from './core/components/navigation/navigation';

@Component({
  selector: 'gallery-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
