import { Component, HostListener, OnInit } from '@angular/core';
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
  showScrollTop = false;
  private styleMap: Map<string, any> = new Map();

  constructor(private photoService: PhotoService) {}

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
      (photos) => (this.photos = photos),
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

  getRandomStyle(id: string): any {
    if (!this.styleMap.has(id)) {
      const directions = ['-100%', '100%', '0%'];
      const angles = ['-8deg', '-4deg', '4deg', '8deg'];
      const posX = directions[Math.floor(Math.random() * directions.length)];
      const posY = directions[Math.floor(Math.random() * directions.length)];
      const rotate = angles[Math.floor(Math.random() * angles.length)];
      const width = Math.floor(Math.random() * 50 + 200);

      const style = {
        '--x': posX,
        '--y': posY,
        '--r': rotate,
        '--stagger-order': Math.floor(Math.random() * 10),
        width: `${width}px`
      };

      this.styleMap.set(id, style);
    }

    return this.styleMap.get(id);
  }
}
