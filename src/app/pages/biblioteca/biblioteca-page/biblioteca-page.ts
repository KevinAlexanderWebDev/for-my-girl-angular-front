import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhotoService, Photo } from '../../../core/services/photo.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-biblioteca-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './biblioteca-page.html',
  styleUrls: ['./biblioteca-page.scss'],
})
export class BibliotecaPage {
  photo?: Photo;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService, 
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido en biblioteca:', id); 
    if (id) {
      this.photoService.getPhoto(id).subscribe(
        (photo) => this.photo = photo,
        (error) => console.error('Error cargando foto:', error)
      );
    }
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
}
