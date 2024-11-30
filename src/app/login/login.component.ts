import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for HttpClient injection

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Import HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  isSignup = false;
  message = '';

  // Inject HttpClient into the component
  constructor(private http: HttpClient) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.message = '';
  }

  handleSubmit() {
    const url = this.isSignup ? '/api/signup' : '/api/login';
    const body = { username: this.username, password: this.password };

    this.http.post<{ message: string }>(url, body).subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (err) => {
        this.message = err.error.message || 'An error occurred.';
      },
    });
  }
}
