import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section>
      <h2>Welcome to Nexus Engine</h2>
      <p>Product UI — Angular 18</p>
    </section>
  `,
  styles: [
    `
      section {
        margin-top: 1rem;
      }
    `,
  ],
})
export class HomeComponent {}
