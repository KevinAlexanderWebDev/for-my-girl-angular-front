import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhotoService, Photo } from '../../../core/services/photo.service';
import { Router } from '@angular/router';
import { AudioService } from '../../../core/services/audio.service';
import { CustomDatePipe } from '../../../core/pipe/pipecustom-date.pipe-pipe';

@Component({
  standalone: true,
  selector: 'app-biblioteca-page',
  imports: [CommonModule, RouterLink, CustomDatePipe],
  templateUrl: './biblioteca-page.html',
  styleUrls: ['./biblioteca-page.scss'],
})
export class BibliotecaPage implements OnInit, OnDestroy {
  photo?: Photo;
  isModalOpen = false;
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  rotation = 0;
  scale = 1;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService, 
    private router: Router,
    private cd: ChangeDetectorRef,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.photoService.getPhoto(id).subscribe(
        (photo) => {
          this.photo = photo;
          this.cd.detectChanges();
        },
        (error) => console.error('Error cargando foto:', error)
      );
    }

    this.audioService.playAudio('assets/audio/sparks.mp3');
  }

  ngOnDestroy(): void {
    this.audioService.stopAudio();
  }

  deletePhoto(): void {
    if (this.photo?._id) {
      this.photoService.deletePhoto(this.photo._id).subscribe(
        () => {
          alert('Foto eliminada con éxito');
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error eliminando la foto:', error);
          alert('Error eliminando la foto.');
        }
      );
    }
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    const point = 'touches' in event ? event.touches[0] : event;
    this.startX = point.clientX - this.translateX;
    this.startY = point.clientY - this.translateY;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const point = 'touches' in event ? event.touches[0] : event;
    this.translateX = point.clientX - this.startX;
    this.translateY = point.clientY - this.startY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetTransforms();
  }

  rotatePhoto() {
    this.rotation = (this.rotation + 90) % 360;
  }

  downloadImage() {
    if (!this.photo?.imgUrl) return;
    const link = document.createElement('a');
    link.href = this.photo.imgUrl;
    link.download = this.photo.title || 'imagen';
    link.click();
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.scale = Math.min(Math.max(this.scale + delta, 0.5), 3);
  }

  resetTransforms() {
    this.translateX = 0;
    this.translateY = 0;
    this.rotation = 0;
    this.scale = 1;
  }

  shouldHideToolbar(): boolean {
    return this.scale !== 1;
  }
}
