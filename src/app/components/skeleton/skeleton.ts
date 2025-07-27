import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container">
      <!-- Skeleton para la barra de búsqueda -->
      <div class="skeleton-search">
        <div class="skeleton-input"></div>
        <div class="skeleton-button"></div>
      </div>

      <!-- Skeleton para la tabla -->
      <div class="skeleton-table">
        <!-- Header skeleton -->
        <div class="skeleton-header">
          <div class="skeleton-cell" *ngFor="let col of [1,2,3,4,5,6]"></div>
        </div>
        
        <!-- Rows skeleton -->
        <div class="skeleton-row" *ngFor="let row of [1,2,3,4,5]">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-text skeleton-name"></div>
          <div class="skeleton-text skeleton-description"></div>
          <div class="skeleton-text skeleton-date"></div>
          <div class="skeleton-text skeleton-date"></div>
          <div class="skeleton-menu"></div>
        </div>
      </div>

      <!-- Skeleton para el footer -->
      <div class="skeleton-footer">
        <div class="skeleton-results"></div>
        <div class="skeleton-select"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      background: #f7f9fb;
      padding: 2rem;
      border-radius: 1rem;
      width: 80%;
      margin: 3rem auto 0 auto;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .skeleton-input {
      width: 250px;
      height: 40px;
      background: #e0e0e0;
      border-radius: 0.5rem;
    }

    .skeleton-button {
      width: 120px;
      height: 40px;
      background: #e0e0e0;
      border-radius: 0.5rem;
    }

    .skeleton-table {
      background: #fff;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }

    .skeleton-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem 0;
      background: #f7f9fb;
      border-radius: 0.5rem;
    }

    .skeleton-cell {
      flex: 1;
      height: 20px;
      background: #e0e0e0;
      border-radius: 4px;
    }

    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #ececec;
    }

    .skeleton-avatar {
      width: 36px;
      height: 36px;
      background: #e0e0e0;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .skeleton-text {
      background: #e0e0e0;
      border-radius: 4px;
      height: 16px;
    }

    .skeleton-name {
      width: 120px;
    }

    .skeleton-description {
      width: 200px;
    }

    .skeleton-date {
      width: 100px;
    }

    .skeleton-menu {
      width: 24px;
      height: 24px;
      background: #e0e0e0;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .skeleton-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding: 1rem 0;
    }

    .skeleton-results {
      width: 100px;
      height: 16px;
      background: #e0e0e0;
      border-radius: 4px;
    }

    .skeleton-select {
      width: 60px;
      height: 32px;
      background: #e0e0e0;
      border-radius: 4px;
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }

    /* Responsive para móvil */
    @media (max-width: 600px) {
      .skeleton-container {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0;
      }
      
      .skeleton-search {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }

      .skeleton-input {
        width: 100%;
        max-width: 300px;
      }

      .skeleton-button {
        width: 140px;
      }

      .skeleton-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        padding: 1rem;
        background: #fff;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      }

      .skeleton-header {
        display: none;
      }

      .skeleton-text {
        height: 20px;
      }

      .skeleton-name {
        width: 100%;
      }

      .skeleton-description {
        width: 100%;
      }

      .skeleton-date {
        width: 100%;
      }
    }
  `]
})
export class SkeletonComponent {}
