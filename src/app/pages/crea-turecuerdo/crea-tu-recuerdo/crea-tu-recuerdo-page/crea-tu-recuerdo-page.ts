import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PhotoService } from '../../../../core/services/photo.service';
import { AudioService } from '../../../../core/services/audio.service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

@Component({
  standalone: true,
  selector: 'app-crea-tu-recuerdo-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxSpinnerModule],
  templateUrl: './crea-tu-recuerdo-page.html',
  styleUrls: ['./crea-tu-recuerdo-page.scss'],
})
export class CreaTuRecuerdoPage implements OnInit, OnDestroy {
  recuerdoForm: FormGroup;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  recuerdoCreado = false;

  constructor(
    private fb: FormBuilder,
    private photoService: PhotoService,
    private router: Router,
    private audioService: AudioService,
    private spinner: NgxSpinnerService
  ) {
    this.recuerdoForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('🎵 Reproduciendo audio: Married-Life.mp3');
    this.audioService.playAudio('assets/audio/Married-Life.mp3');
  }

  ngOnDestroy(): void {
    console.log('🛑 Deteniendo audio');
    this.audioService.stopAudio();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit() {
    if (this.recuerdoForm.invalid || !this.selectedFile) {
      alert('Completa todos los campos y selecciona una imagen');
      return;
    }

    const { title, description, date } = this.recuerdoForm.value;

    try {
      console.log('⏳ Mostrando spinner: subiendo imagen...');
      this.spinner.show();

      await this.photoService
        .uploadPhoto(title, description, this.selectedFile, date)
        .toPromise();

      this.spinner.hide();
      console.log('✅ Recuerdo creado correctamente y spinner ocultado');

      alert('✅ Recuerdo creado correctamente');
      this.recuerdoCreado = true;

      setTimeout(() => {
        this.recuerdoCreado = false;
        this.router.navigate(['/home']);
      }, 1800);
    } catch (error) {
      this.spinner.hide();
      console.error('❌ Error al subir recuerdo:', error);
      alert('Error al crear el recuerdo, inténtalo nuevamente');
    }
  }
}
