import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/guards/auth-guard-guard';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'], // o login-page.scss si lo prefieres
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      if (this.authService.login(username, password)) {
        this.router.navigate(['/home']);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } else {
      alert('Por favor completa todos los campos');
    }
  }
}
