import { Component } from '@angular/core';
import { HomeOldComponent } from './home-old/home-old.component';
import { HomeNewComponent } from './home-new/home-new.component';


@Component({
  selector: 'app-root',
  imports: [HomeOldComponent, HomeNewComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
