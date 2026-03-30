import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {UnitCategory} from '../../model/app.units';
import { RouterLink } from "@angular/router";

interface UnitDetail {
  name: string;
  symbol: string;
  factor: string;
  description: string;
}

interface CategoryDetail {
  category: UnitCategory;
  icon: string;
  color: string;
  baseUnit: string;
  units: UnitDetail[];
}

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './units.html',
})
export class Units {
  selectedCategory = signal<UnitCategory>(UnitCategory.LENGTH);

  unitDetails: CategoryDetail[] = [
    {
      category: UnitCategory.LENGTH,
      icon: 'straighten',
      color: 'bg-blue-50 text-blue-600',
      baseUnit: 'Inch',
      units: [
        { name: 'Inch', symbol: 'in', factor: '1.0', description: 'The base unit of length in our system. Historically defined as the width of a human thumb.' },
        { name: 'Feet', symbol: 'ft', factor: '12.0', description: 'Equal to 12 inches. Originally based on the length of a human foot.' },
        { name: 'Yard', symbol: 'yd', factor: '36.0', description: 'Equal to 3 feet or 36 inches. Commonly used in field sports and fabric measurement.' },
        { name: 'Centimeter', symbol: 'cm', factor: '0.393701', description: 'A metric unit of length. 1 inch is exactly 2.54 centimeters.' }
      ]
    },
    {
      category: UnitCategory.WEIGHT,
      icon: 'scale',
      color: 'bg-emerald-50 text-emerald-600',
      baseUnit: 'Gram',
      units: [
        { name: 'Gram', symbol: 'g', factor: '1.0', description: 'The base unit of mass in our system. Roughly the weight of a paperclip.' },
        { name: 'Kilogram', symbol: 'kg', factor: '1000.0', description: 'Equal to 1,000 grams. The standard unit of mass in the International System of Units (SI).' },
        { name: 'Milligram', symbol: 'mg', factor: '0.001', description: 'Equal to one thousandth of a gram. Used for very small measurements like medicine dosages.' },
        { name: 'Pound', symbol: 'lb', factor: '453.592', description: 'A unit of mass used in the imperial system. 1 pound is approximately 453.6 grams.' }
      ]
    },
    {
      category: UnitCategory.VOLUME,
      icon: 'science',
      color: 'bg-purple-50 text-purple-600',
      baseUnit: 'Litre',
      units: [
        { name: 'Litre', symbol: 'L', factor: '1.0', description: 'The base unit of volume in our system. Equal to the volume of a cube with 10cm sides.' },
        { name: 'Millilitre', symbol: 'ml', factor: '0.001', description: 'Equal to one thousandth of a litre. Also equivalent to one cubic centimeter (cc).' },
        { name: 'Gallon', symbol: 'gal', factor: '3.78541', description: 'A unit of liquid capacity. We use the US liquid gallon, which is exactly 3.785411784 litres.' }
      ]
    },
    {
      category: UnitCategory.TEMPERATURE,
      icon: 'thermostat',
      color: 'bg-orange-50 text-orange-600',
      baseUnit: 'Celsius',
      units: [
        { name: 'Celsius', symbol: '°C', factor: 'Base', description: 'The scale where water freezes at 0° and boils at 100° under standard conditions.' },
        { name: 'Fahrenheit', symbol: '°F', factor: '(°C × 9/5) + 32', description: 'A temperature scale where water freezes at 32° and boils at 212°.' }
      ]
    }
  ];

  get currentCategoryDetail() {
    return this.unitDetails.find(d => d.category === this.selectedCategory())!;
  }

  selectCategory(category: UnitCategory) {
    this.selectedCategory.set(category);
  }
}
