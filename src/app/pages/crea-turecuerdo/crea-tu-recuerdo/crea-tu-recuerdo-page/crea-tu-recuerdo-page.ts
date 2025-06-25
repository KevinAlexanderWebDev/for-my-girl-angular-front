import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PhotoService } from '../../../../core/services/photo.service';

@Component({
  standalone: true,
  selector: 'app-crea-tu-recuerdo-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crea-tu-recuerdo-page.html',
  styleUrls: ['./crea-tu-recuerdo-page.scss'],
})
export class CreaTuRecuerdoPage {
  recuerdoForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private photoService: PhotoService,
    private router: Router
  ) {
    this.recuerdoForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit() {
    if (this.recuerdoForm.invalid || !this.selectedFile) {
      alert('Completa todos los campos y selecciona una imagen');
      return;
    }

    const { title, description } = this.recuerdoForm.value;

    try {
      await this.photoService.uploadPhoto(title, description, this.selectedFile).toPromise();
      alert('✅ Recuerdo creado correctamente');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      alert('Error al crear el recuerdo, inténtalo nuevamente');
    }
  }
}
