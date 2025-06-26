import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhotoService, Photo } from '../../../core/services/photo.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage implements OnInit {
  photos: Photo[] = [];
  searchTerm = '';
  filterDate = '';
  date = ''; 
  showScrollTop = false;
  private styleMap: Map<string, any> = new Map();

  constructor(
  private photoService: PhotoService,  
  private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarFotos();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollTop = yOffset > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private cargarFotos(): void {
    this.photoService.getPhotos().subscribe(
      (photos) => {
        this.photos = photos;
        this.cd.detectChanges(); // Forzamos actualización cuando las fotos llegan
      },
      (error) => console.error('Error cargando fotos:', error)
    );
  }

  filteredPhotos(): Photo[] {
    return this.photos.filter((photo) => {
      const matchesTitle = this.searchTerm
        ? photo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesDate = this.filterDate
      ? new Date(photo.createdAt || '').toISOString().slice(0, 10) === this.filterDate
      : true;

      return matchesTitle && matchesDate;
    });
  }

  getRandomStyle(id: string | undefined): any {
    if (!id) return {}; // Evita fallos si aún no hay ID

    if (!this.styleMap.has(id)) {
      const directions = ['-80px', '120px', '0px'];
      const angles = ['-6deg', '-3deg', '3deg', '6deg'];
      const posX = directions[Math.floor(Math.random() * directions.length)];
      const posY = directions[Math.floor(Math.random() * directions.length)];
      const rotate = angles[Math.floor(Math.random() * angles.length)];
      const delay = Math.floor(Math.random() * 600);

      const style = {
        '--x': posX,
        '--y': posY,
        '--r': rotate,
        '--delay': `${delay}ms`,
      };

      this.styleMap.set(id, style);
    }

    return this.styleMap.get(id);
  }
}
