import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UnitCategory, UNITS } from '../../model/app.units';
import {CommonModule} from '@angular/common';
import { Quantity, QuantityRequestDto, TwoQuantityRequestDto, QuantityResponseDto } from '../../service/quantity';

@Component({
  selector: 'app-operations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './operations.html',
})
export class Operations {
  private fb = inject(FormBuilder);
  private quantityService = inject(Quantity);

  activeTab = signal<'equality' | 'convert' | 'add' | 'subtract' | 'divide'>('equality');
  result = signal<QuantityResponseDto | null>(null);
  error = signal<string | null>(null);
  isLoading = signal(false);

  unitCategories = Object.values(UnitCategory);
  units = UNITS;

  equalityForm: FormGroup;
  convertForm: FormGroup;
  addForm: FormGroup;
  subtractForm: FormGroup;
  divideForm: FormGroup;

  constructor() {
    this.equalityForm = this.fb.group({
      category: [UnitCategory.LENGTH, Validators.required],
      q1_value: [0, Validators.required],
      q1_unit: ['FEET', Validators.required],
      q2_value: [0, Validators.required],
      q2_unit: ['INCH', Validators.required]
    });

    this.convertForm = this.fb.group({
      category: [UnitCategory.LENGTH, Validators.required],
      value: [0, Validators.required],
      unit: ['FEET', Validators.required],
      targetUnit: ['INCH', Validators.required]
    });

    this.addForm = this.fb.group({
      category: [UnitCategory.LENGTH, Validators.required],
      q1_value: [0, Validators.required],
      q1_unit: ['FEET', Validators.required],
      q2_value: [0, Validators.required],
      q2_unit: ['FEET', Validators.required],
      targetUnit: ['FEET']
    });

    this.subtractForm = this.fb.group({
      category: [UnitCategory.LENGTH, Validators.required],
      q1_value: [0, Validators.required],
      q1_unit: ['FEET', Validators.required],
      q2_value: [0, Validators.required],
      q2_unit: ['FEET', Validators.required],
      targetUnit: ['FEET']
    });

    this.divideForm = this.fb.group({
      category: [UnitCategory.LENGTH, Validators.required],
      q1_value: [0, Validators.required],
      q1_unit: ['FEET', Validators.required],
      q2_value: [0, Validators.required],
      q2_unit: ['FEET', Validators.required]
    });

    // Listen for category changes to reset units
    this.setupCategoryListeners();
  }

  private setupCategoryListeners() {
    const forms = [
      { form: this.equalityForm, units: ['q1_unit', 'q2_unit'] },
      { form: this.convertForm, units: ['unit', 'targetUnit'] },
      { form: this.addForm, units: ['q1_unit', 'q2_unit', 'targetUnit'] },
      { form: this.subtractForm, units: ['q1_unit', 'q2_unit', 'targetUnit'] },
      { form: this.divideForm, units: ['q1_unit', 'q2_unit'] }
    ];

    forms.forEach(({ form, units }) => {
      form.get('category')?.valueChanges.subscribe((cat: UnitCategory) => {
        const firstUnit = this.units[cat][0];
        units.forEach(u => {
          form.get(u)?.setValue(firstUnit);
        });
      });
    });
  }

  getUnitsForCategory(category: UnitCategory): string[] {
    return this.units[category] || [];
  }

  isArithmeticSupported(): boolean {
    const tab = this.activeTab();
    if (tab === 'equality' || tab === 'convert') return true;
    
    let currentCategory: UnitCategory;
    switch(tab) {
      case 'add': currentCategory = this.addForm.get('category')?.value; break;
      case 'subtract': currentCategory = this.subtractForm.get('category')?.value; break;
      case 'divide': currentCategory = this.divideForm.get('category')?.value; break;
      default: return true;
    }
    
    return currentCategory !== UnitCategory.TEMPERATURE;
  }

  setTab(tab: 'equality' | 'convert' | 'add' | 'subtract' | 'divide') {
    this.activeTab.set(tab);
    this.result.set(null);
    this.error.set(null);
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

  getTypeIcon(type: string): string {
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

  onEquality() {
    if (this.equalityForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    const val = this.equalityForm.value;
    const request: TwoQuantityRequestDto = {
      q1: { value: val.q1_value, unit: val.q1_unit },
      q2: { value: val.q2_value, unit: val.q2_unit }
    };
    this.quantityService.checkEquality(request).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  onConvert() {
    if (this.convertForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    const val = this.convertForm.value;
    const request: QuantityRequestDto = { value: val.value, unit: val.unit };
    this.quantityService.convert(request, val.targetUnit).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  onAdd() {
    if (this.addForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    const val = this.addForm.value;
    const request: TwoQuantityRequestDto = {
      q1: { value: val.q1_value, unit: val.q1_unit },
      q2: { value: val.q2_value, unit: val.q2_unit }
    };
    this.quantityService.add(request, val.targetUnit).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  onSubtract() {
    if (this.subtractForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    const val = this.subtractForm.value;
    const request: TwoQuantityRequestDto = {
      q1: { value: val.q1_value, unit: val.q1_unit },
      q2: { value: val.q2_value, unit: val.q2_unit }
    };
    this.quantityService.subtract(request, val.targetUnit).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  onDivide() {
    if (this.divideForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    const val = this.divideForm.value;
    const request: TwoQuantityRequestDto = {
      q1: { value: val.q1_value, unit: val.q1_unit },
      q2: { value: val.q2_value, unit: val.q2_unit }
    };
    this.quantityService.divide(request).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}
