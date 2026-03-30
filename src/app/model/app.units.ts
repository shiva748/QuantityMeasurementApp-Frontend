export enum UnitCategory {
  LENGTH = 'Length',
  WEIGHT = 'Weight',
  VOLUME = 'Volume',
  TEMPERATURE = 'Temperature'
}

export const UNITS = {
  [UnitCategory.LENGTH]: [
    'FEET', 'INCH', 'YARD', 'CENTIMETER'
  ],
  [UnitCategory.WEIGHT]: [
    'GRAM', 'KILOGRAM', 'MILLIGRAM', 'POUND'
  ],
  [UnitCategory.VOLUME]: [
    'LITRE', 'MILLILITRE', 'GALLON'
  ],
  [UnitCategory.TEMPERATURE]: [
    'CELSIUS', 'FAHRENHEIT'
  ]
};
