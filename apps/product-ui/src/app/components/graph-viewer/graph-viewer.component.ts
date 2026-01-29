import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph-viewer.component.html',
  styleUrl: './graph-viewer.component.scss',
})
export class GraphViewerComponent {
  nodes: GraphNode[] = [
    { id: '1', label: 'Engine' },
    { id: '2', label: 'Intelligence' },
    { id: '3', label: 'AI' },
    { id: '4', label: 'Trust' },
  ];
  edges: GraphEdge[] = [
    { id: 'e1', sourceId: '1', targetId: '2' },
    { id: 'e2', sourceId: '2', targetId: '3' },
    { id: 'e3', sourceId: '3', targetId: '4' },
  ];
  selectedNodeId: string | null = null;

  selectNode(id: string): void {
    this.selectedNodeId = this.selectedNodeId === id ? null : id;
  }
}
