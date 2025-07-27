import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-skeleton-container">
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
      </div>
      
      <div class="skeleton-form">
        <div class="skeleton-field" *ngFor="let field of [1,2,3,4,5]">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        
        <div class="skeleton-buttons">
          <div class="skeleton-button skeleton-reset"></div>
          <div class="skeleton-button skeleton-submit"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-skeleton-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .skeleton-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .skeleton-title {
      width: 200px;
      height: 32px;
      background: #e0e0e0;
      border-radius: 8px;
      margin: 0 auto;
    }

    .skeleton-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .skeleton-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .skeleton-label {
      width: 120px;
      height: 16px;
      background: #e0e0e0;
      border-radius: 4px;
    }

    .skeleton-input {
      width: 100%;
      height: 40px;
      background: #e0e0e0;
      border-radius: 8px;
    }

    .skeleton-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .skeleton-button {
      flex: 1;
      height: 48px;
      background: #e0e0e0;
      border-radius: 8px;
    }

    .skeleton-reset {
      background: #f0f0f0;
    }

    .skeleton-submit {
      background: #e8e8e8;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .form-skeleton-container {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @media (max-width: 600px) {
      .form-skeleton-container {
        margin: 1rem;
        padding: 1rem;
      }
      
      .skeleton-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class FormSkeletonComponent {}
