import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../core/services/photo.service';
import { AudioService } from '../../core/services/audio.service';

@Component({
  standalone: true,
  selector: 'app-editor-de-recuerdos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor-de-recuerdos.html',
  styleUrls: ['./editor-de-recuerdos.scss'],
})
export class EditorDeRecuerdosComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  photoId?: string;
  zoomFactor = 1;
  previewUrl?: string;
  photo?: { imgUrl?: string; title?: string };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private audioService: AudioService
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      date: [''],
      imageFile: [null], 
    });
  }

  ngOnInit(): void {
    this.photoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.photoId) {
      this.photoService.getPhoto(this.photoId).subscribe(photo => {
        this.photo = photo;
        this.previewUrl = photo.imgUrl;
        this.editForm.patchValue({
          title: photo.title,
          description: photo.description,
          date: photo.createdAt
            ? new Date(photo.createdAt).toISOString().split('T')[0]
            : '',
        });
      });
    }

    this.audioService.playAudio('assets/audio/Married-Life.mp3');
  }

  ngOnDestroy(): void {
    this.audioService.stopAudio();
  }

  onSubmit() {
    if (this.editForm.valid && this.photoId) {
      const payload = { ...this.editForm.value };
      delete payload.imageFile;

      this.photoService.updatePhoto(this.photoId, payload).subscribe(
        () => {
          alert('¡Foto actualizada con éxito!');
          this.router.navigate(['/biblioteca', this.photoId]);
        },
        err => alert('Error al actualizar la foto')
      );
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.editForm.patchValue({ imageFile: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  applyZoom() {
    const imgElement = document.querySelector('.image-preview img') as HTMLImageElement;
    if (imgElement) {
      imgElement.style.transform = `scale(${this.zoomFactor})`;
    }
  }

  openCropper() {
    alert('Kevin, favor de agregar el programa de recortes de ngx o alguna similar');
  }
}
