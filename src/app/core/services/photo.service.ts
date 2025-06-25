import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';// usa tu env

export interface Photo {
  _id?: string;
  title: string;
  description: string; 
  imgUrl: string;
  createdAt?: string; //El signo de pregunta invertido hace al valor indefinido XD
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = `${environment.apiUrl}/photos`; 

  constructor(private http: HttpClient) {}

  // Petición tipo GET para obtener todas las fotos
  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  // Petición tipo GET para obtener una sola foto | por ID
  getPhoto(id: string): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  // POST subir una nueva foto
  uploadPhoto(title: string, description: string, file: File): Observable<Photo> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', file); // clave "image"
    return this.http.post<Photo>(this.apiUrl, formData);
  }

  deletePhoto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
