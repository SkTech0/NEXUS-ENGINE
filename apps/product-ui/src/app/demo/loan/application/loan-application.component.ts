import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoanStateService } from '../services/loan-state.service';
import { LoanApplication } from '../models/loan-application.model';

@Component({
  selector: 'nexus-loan-application',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.scss',
})
export class LoanApplicationComponent {
  private readonly loanState = inject(LoanStateService);
  private readonly router = inject(Router);

  app: Partial<LoanApplication> = {
    fullName: '',
    age: 35,
    income: 75000,
    employmentType: 'Full-time',
    company: '',
    creditScore: 720,
    loanAmount: 25000,
    loanTenure: 36,
    existingLoans: 0,
    city: '',
    country: '',
    riskFlags: [],
  };

  employmentTypes = ['Full-time', 'Part-time', 'Self-employed', 'Contract', 'Freelance'];

  evaluate(): void {
    const application = this.buildApplication();
    if (!application) return;

    this.loanState.reset();
    this.loanState.setApplication(application);
    const runId = this.loanState.startEvaluation();
    if (runId) {
      void this.router.navigateByUrl('/loan/evaluate');
    }
  }

  private buildApplication(): LoanApplication | null {
    const a = this.app;
    const fullName = (a.fullName ?? '').trim();
    const age = Number(a.age);
    const income = Number(a.income);
    const creditScore = Number(a.creditScore);
    const loanAmount = Number(a.loanAmount);
    const loanTenure = Number(a.loanTenure);
    const existingLoans = Number(a.existingLoans);

    if (!fullName || !Number.isFinite(age) || !Number.isFinite(income) || !Number.isFinite(creditScore) || !Number.isFinite(loanAmount) || !Number.isFinite(loanTenure) || !Number.isFinite(existingLoans)) {
      return null;
    }

    return {
      fullName,
      age,
      income,
      employmentType: (a.employmentType ?? 'Full-time').trim(),
      company: (a.company ?? '').trim(),
      creditScore,
      loanAmount,
      loanTenure,
      existingLoans,
      city: (a.city ?? '').trim(),
      country: (a.country ?? '').trim(),
      riskFlags: Array.isArray(a.riskFlags) ? a.riskFlags : [],
    };
  }
}
