import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';

export interface Photo {
  _id?: string;
  title: string;
  description: string; 
  imgUrl: string;
  date: string; 
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = `${environment.apiUrl}/photos`;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  getPhoto(id: string): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  uploadPhoto(title: string, description: string, file: File, date: string): Observable<Photo> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('image', file);

    this.spinner.show(); // Mostrar spinner antes de enviar

    return this.http.post<Photo>(this.apiUrl, formData).pipe(
      finalize(() => this.spinner.hide()) // Ocultar spinner al terminar
    );
  }

  updatePhoto(id: string, data: Partial<Photo>) {
    return this.http.put<Photo>(`${this.apiUrl}/${id}`, data);
  }

  deletePhoto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
