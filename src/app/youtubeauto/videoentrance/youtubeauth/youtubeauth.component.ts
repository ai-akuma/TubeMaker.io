import { Component } from '@angular/core';

@Component({
  selector: 'youtubeauth',
  templateUrl: './youtubeauth.component.html',
  styleUrls: ['./youtubeauth.component.scss']
})
export class YoutubeAuthComponent {
    hasCompletedYoutubeAuth = false;

    onYoutubeClick() {
        throw new Error('Method not implemented.');
    }
}
