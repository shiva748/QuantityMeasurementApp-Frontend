import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import { Quantity, QuantityResponseDto } from '../../service/quantity';
import { RouterLink } from '@angular/router';

export interface QuantityMeasurementHistory extends QuantityResponseDto {
  timestamp?: Date;
}

@Component({
  selector: 'app-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, DatePipe, RouterLink],
  templateUrl: './history.html',
})
export class History implements OnInit {
  private quantityService = inject(Quantity);
  
  historyItems = signal<QuantityMeasurementHistory[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    this.isLoading.set(true);
    this.error.set(null);
    this.quantityService.getHistory().subscribe({
      next: (res) => {
        // Map the data to include a default timestamp if missing, or just use as is
        const items = res.data.map(item => {
          const rawItem = item as QuantityResponseDto & { timestamp?: string | Date };
          return {
            ...item,
            timestamp: rawItem.timestamp ? new Date(rawItem.timestamp) : new Date()
          };
        });
        this.historyItems.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  clearAll() {
    if (confirm('Are you sure you want to clear all history?')) {
      this.isLoading.set(true);
      this.quantityService.clearHistory().subscribe({
        next: () => {
          this.historyItems.set([]);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to clear history: ' + err.message);
          this.isLoading.set(false);
        }
      });
    }
  }

  getOperationIcon(operation: string): string {
    if (!operation) return 'help_outline';
    switch (operation.toUpperCase()) {
      case 'ADD': return 'add';
      case 'SUBTRACT': return 'remove';
      case 'COMPARE':
      case 'EQUALITY': return 'drag_handle';
      case 'CONVERT': return 'sync';
      case 'DIVIDE': return 'horizontal_rule';
      default: return 'help_outline';
    }
  }

  getTypeIcon(type: string | null): string {
    if (!type) return 'category';
    switch (type.toLowerCase()) {
      case 'lengthunit':
      case 'length': return 'straighten';
      case 'weightunit':
      case 'weight': return 'scale';
      case 'temperatureunit':
      case 'temperature': return 'thermostat';
      case 'volumeunit':
      case 'volume': return 'science';
      default: return 'category';
    }
  }

  getDisplayValue(val: number | { source: string; parsedValue: number } | null | undefined): string {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'number') return val.toString();
    return val.source || val.parsedValue.toString();
  }
}
