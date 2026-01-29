import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nexus-loan-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-landing.component.html',
  styleUrl: './loan-landing.component.scss',
})
export class LoanLandingComponent {}
