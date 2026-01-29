import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AIService,
  AIInferenceResponse,
  AIModelsResponse,
} from '../../services/ai.service';

@Component({
  selector: 'app-ai-console',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-console.component.html',
  styleUrl: './ai-console.component.scss',
})
export class AIConsoleComponent implements OnInit {
  models: string[] = [];
  selectedModel = '';
  inputText = '{}';
  inferenceResult: AIInferenceResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(private readonly aiService: AIService) {}

  ngOnInit(): void {
    this.loadModels();
  }

  loadModels(): void {
    this.loading = true;
    this.error = null;
    this.aiService.listModels().subscribe({
      next: (r: AIModelsResponse) => {
        this.models = r.modelIds ?? [];
        this.selectedModel = this.models[0] ?? '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Failed to load models';
        this.loading = false;
      },
    });
  }

  runInference(): void {
    let inputs: Record<string, unknown> = {};
    try {
      inputs = JSON.parse(this.inputText || '{}');
    } catch {
      this.error = 'Invalid JSON input';
      return;
    }
    this.loading = true;
    this.error = null;
    this.inferenceResult = null;
    this.aiService.infer({ modelId: this.selectedModel, inputs }).subscribe({
      next: (r) => {
        this.inferenceResult = r;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Inference failed';
        this.loading = false;
      },
    });
  }
}
