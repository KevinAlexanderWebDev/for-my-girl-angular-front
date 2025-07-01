import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../core/services/photo.service';
import { AudioService } from '../../core/services/audio.service';
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  standalone: true,
  selector: 'app-editor-de-recuerdos',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ImageCropperComponent],
  templateUrl: './editor-de-recuerdos.html',
  styleUrls: ['./editor-de-recuerdos.scss'],
})
export class EditorDeRecuerdosComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  photoId?: string;
  zoomFactor = 1;
  previewUrl?: string;
  photo?: { imgUrl?: string; title?: string };
  imageBase64: string = '';
  croppedImage: string = '';
  showCropModal = false;
  saveAsNew: boolean = false;
  mostrarCropper = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private audioService: AudioService,
    private cdr: ChangeDetectorRef
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
      this.photoService.getPhoto(this.photoId).subscribe((photo) => {
        this.photo = photo;
        this.editForm.patchValue({
          title: photo.title,
          description: photo.description,
          date: photo.createdAt
            ? new Date(photo.createdAt).toISOString().split('T')[0]
            : '',
        });

        setTimeout(() => {
          this.previewUrl = photo.imgUrl || '';
        }, 0);
      });
    }

    this.audioService.playAudio('assets/audio/Married-Life.mp3');
  }

  ngOnDestroy(): void {
    this.audioService.stopAudio();
  }

  abrirModalRecorte(): void {
    this.showCropModal = true;
  }

  cerrarModalRecorte(): void {
    this.showCropModal = false;
  }

  confirmarRecorte(): void {
    this.cerrarModalRecorte();

    const imgUrl = this.photo?.imgUrl;
    if (!imgUrl) return;

    this.imageBase64 = '';
    this.mostrarCropper = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.convertImageUrlToFile(imgUrl, 'recuerdo-recorte.jpg').then((file) => {
        this.onFileSelected(file);
      });
    }, 100);
  }

  onFileSelected(event: Event | File): void {
    const file = event instanceof File ? event : (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
      reader.onload = () => {
      const base64 = reader.result as string;

      this.mostrarCropper = false;
      this.imageBase64 = '';
      this.cdr.detectChanges(); // fuerza desmontaje del cropper

      setTimeout(() => {
        this.imageBase64 = base64;
        this.mostrarCropper = true;
        this.cdr.detectChanges(); // fuerza montaje del cropper con datos listos
        console.log('✅ Imagen asignada a cropper:', base64.substring(0, 100));
      }, 0);
    };
    reader.readAsDataURL(file);
  }

onImageCropped(event: any): void {
  console.log('📥 Evento del cropper:', event);

  if (event.base64) {
    this.croppedImage = event.base64;
    this.previewUrl = this.croppedImage;
    this.editForm.patchValue({ imageFile: this.croppedImage });
    console.log('📸 Imagen recortada (base64):', this.croppedImage.substring(0, 100));
  } else if (event.blob) {
    const reader = new FileReader();
    reader.onload = () => {
      this.croppedImage = reader.result as string;
      this.previewUrl = this.croppedImage;
      this.editForm.patchValue({ imageFile: this.croppedImage });
      console.log('📸 Imagen convertida desde blob:', this.croppedImage.substring(0, 100));
    };
    reader.readAsDataURL(event.blob);
  } else {
    console.warn('⚠️ El evento de recorte no contiene base64 ni blob');
  }
}

  onCropCancel(): void {
    this.imageBase64 = '';
    this.mostrarCropper = false;
    this.previewUrl = this.photo?.imgUrl || '';
    this.croppedImage = '';
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = { ...this.editForm.value };
      const file = this.croppedImage
        ? this.base64ToFile(this.croppedImage, 'recorte.png')
        : null;

      console.log('📸 Imagen base64 enviada al back:', this.croppedImage?.substring(0, 100));

      if (this.saveAsNew || !this.photoId) {
        if (!file) {
          alert('No hay imagen para subir');
          return;
        }

        this.photoService
          .uploadPhoto(formValue.title, formValue.description, file, formValue.date)
          .subscribe(
            (newPhoto) => {
              alert('¡Nuevo recuerdo creado con éxito!');
              this.router.navigate(['/biblioteca', newPhoto._id]);
            },
            (err) => alert('Error al crear el nuevo recuerdo')
          );
      } else {
        const payload: any = {
          title: formValue.title,
          description: formValue.description,
          date: formValue.date,
        };

        if (this.croppedImage) {
          payload.imgUrl = this.croppedImage;
        }

        console.log('📝 Payload enviado:', payload);

        this.photoService.updatePhoto(this.photoId, payload).subscribe(
          () => {
            alert('¡Recuerdo actualizado con éxito!');
            this.router.navigate(['/biblioteca', this.photoId]);
          },
          (err) => alert('Error al actualizar el recuerdo')
        );
      }
    }
  }

  applyZoom(): void {
    const imgElement = document.querySelector('.image-preview img') as HTMLImageElement;
    if (imgElement) {
      imgElement.style.transform = `scale(${this.zoomFactor})`;
    }
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async convertImageUrlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
}
