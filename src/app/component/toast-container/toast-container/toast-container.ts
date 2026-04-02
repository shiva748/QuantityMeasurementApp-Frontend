import {ChangeDetectionStrategy, Component, inject, effect, ElementRef, viewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {Toast} from '../../../service/toast';
import {animate} from 'motion';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          #toastItem
          class="pointer-events-auto relative overflow-hidden flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border backdrop-blur-xl transition-all duration-500"
          [ngClass]="{
            'bg-white/90 border-emerald-100/50 text-emerald-950': toast.type === 'success',
            'bg-white/90 border-red-100/50 text-rose-950': toast.type === 'error',
            'bg-white/90 border-blue-100/50 text-blue-950': toast.type === 'info',
            'bg-white/90 border-amber-100/50 text-amber-950': toast.type === 'warning'
          }"
        >
          <!-- Progress Bar Background -->
          <div class="absolute bottom-0 left-0 h-1 w-full bg-black/5"></div>
          <!-- Progress Bar Fill -->
          <div 
            class="absolute bottom-0 left-0 h-1 transition-all duration-[3000ms] ease-linear"
            [ngClass]="{
              'bg-emerald-500': toast.type === 'success',
              'bg-rose-500': toast.type === 'error',
              'bg-blue-500': toast.type === 'info',
              'bg-amber-500': toast.type === 'warning'
            }"
            [style.width]="'0%'"
            #progressBar
          ></div>

          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            [ngClass]="{
              'bg-emerald-100 text-emerald-600': toast.type === 'success',
              'bg-rose-100 text-rose-600': toast.type === 'error',
              'bg-blue-100 text-blue-600': toast.type === 'info',
              'bg-amber-100 text-amber-600': toast.type === 'warning'
            }"
          >
            <mat-icon class="text-xl">{{ getIcon(toast.type) }}</mat-icon>
          </div>
          
          <div class="flex-grow flex flex-col gap-0.5">
            <span class="text-[10px] uppercase tracking-wider font-bold opacity-40">
              {{ toast.type }}
            </span>
            <div class="text-sm font-semibold tracking-tight leading-snug">
              {{ toast.message }}
            </div>
          </div>

          <button
            (click)="toastService.remove(toast.id)"
            class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-black/20 hover:text-black/60"
          >
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  readonly toastService = inject(Toast);
  private readonly toastItems = viewChildren<ElementRef<HTMLDivElement>>('toastItem');
  private readonly progressBars = viewChildren<ElementRef<HTMLDivElement>>('progressBar');

  constructor() {
    effect(() => {
      const items = this.toastItems();
      const bars = this.progressBars();
      
      if (items.length > 0) {
        const lastItem = items[items.length - 1].nativeElement;
        if (!lastItem.classList.contains('animated')) {
          lastItem.classList.add('animated');
          
          // Entry animation
          animate(
            lastItem,
            { 
              opacity: [0, 1], 
              y: [20, 0], 
              scale: [0.9, 1],
              filter: ['blur(10px)', 'blur(0px)']
            },
            { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          );

          // Progress bar animation
          if (bars.length > 0) {
            const lastBar = bars[bars.length - 1].nativeElement;
            setTimeout(() => {
              lastBar.style.width = '100%';
            }, 50);
          }
        }
      }
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check';
      case 'error': return 'close';
      case 'warning': return 'priority_high';
      default: return 'notifications';
    }
  }
}
