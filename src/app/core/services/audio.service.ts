import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;

  playAudio(src: string, loop: boolean = true) {
    this.stopAudio(); 

    this.audio = new Audio();
    this.audio.src = src;
    this.audio.loop = loop;
    this.audio.volume = 0.5;
    this.audio.autoplay = true;

    this.audio.play().catch(err => {
      console.warn('🎧 Reproducción automática bloqueada:', err);
    });
  }

  stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}
