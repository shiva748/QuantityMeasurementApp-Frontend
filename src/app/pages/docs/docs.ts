import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  category: 'Auth' | 'Quantities';
}

@Component({
  selector: 'app-docs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, CommonModule],
  templateUrl: './docs.html',
})
export class Docs {
  activeCategory = signal<'Auth' | 'Quantities'>('Auth');

  endpoints = signal<ApiEndpoint[]>([
    {
      category: 'Auth',
      method: 'POST',
      path: '/auth/register',
      description: 'Register a new user account.',
      requestBody: `{
  "username": "string",
  "email": "string",
  "password": "string"
}`,
      responseBody: `{
  "success": true,
  "message": "User registered successfully!",
  "data": null
}`
    },
    {
      category: 'Auth',
      method: 'POST',
      path: '/auth/login',
      description: 'Authenticate user and receive a JWT in a HttpOnly cookie.',
      requestBody: `{
  "email": "string",
  "password": "string"
}`,
      responseBody: `{
  "success": true,
  "message": "Login successfully!",
  "data": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}`
    },
    {
      category: 'Auth',
      method: 'GET',
      path: '/auth/session',
      description: 'Retrieve the current authenticated user session.',
      responseBody: `{
  "success": true,
  "message": "Session Found!",
  "data": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}`
    },
    {
      category: 'Auth',
      method: 'GET',
      path: '/auth/session/logout',
      description: 'Clear the authentication session and JWT cookie.',
      responseBody: `{
  "success": true,
  "message": "Logged out successfully.",
  "data": null
}`
    },
    {
      category: 'Quantities',
      method: 'GET',
      path: '/api/quantities',
      description: 'Welcome endpoint for the Quantity Measurement API.',
      responseBody: '"Welcome to Quantity Measurement API!"'
    },
    {
      category: 'Quantities',
      method: 'POST',
      path: '/api/quantities/equality',
      description: 'Check if two quantities are equal across different units.',
      requestBody: `{
  "q1": { "value": 5.0, "unit": "FEET" },
  "q2": { "value": 60.0, "unit": "INCH" }
}`,
      responseBody: `{
  "success": true,
  "message": "Operation Successful",
  "data": {
    "id": 19,
    "thisValue": { "source": "5.0", "parsedValue": 5 },
    "thisUnit": "FEET",
    "operation": "COMPARE",
    "resultString": "Equal",
    ...
  }
}`
    },
    {
      category: 'Quantities',
      method: 'POST',
      path: '/api/quantities/convert',
      description: 'Convert a quantity to a target unit.',
      requestBody: `{
  "value": 40.0,
  "unit": "FEET"
} (Query Param: targetUnit=YARD)`,
      responseBody: `{
  "success": true,
  "message": "Operation Successful",
  "data": {
    "id": 20,
    "resultValue": 13.33,
    "resultUnit": "YARD",
    "resultString": "13.33 YARD",
    ...
  }
}`
    },
    {
      category: 'Quantities',
      method: 'POST',
      path: '/api/quantities/add',
      description: 'Add two quantities and optionally convert to a target unit.',
      requestBody: `{
  "q1": { "value": 14.0, "unit": "FEET" },
  "q2": { "value": 5.0, "unit": "YARD" }
}`,
      responseBody: `{
  "success": true,
  "message": "Operation Successful",
  "data": {
    "id": 21,
    "resultValue": { "source": "348.0", "parsedValue": 348 },
    "resultUnit": "INCH",
    "resultString": "348.0 INCH",
    ...
  }
}`
    },
    {
      category: 'Quantities',
      method: 'GET',
      path: '/api/quantities/history',
      description: 'Retrieve the history of measurement operations.',
      responseBody: `{
  "success": true,
  "message": "History fetched successfully.",
  "data": [ ... ]
}`
    },
    {
      category: 'Quantities',
      method: 'DELETE',
      path: '/api/quantities/history',
      description: 'Clear all measurement operation history.',
      responseBody: `{
  "success": true,
  "message": "History cleared successfully.",
  "data": null
}`
    }
  ]);

  filteredEndpoints = () => this.endpoints().filter(e => e.category === this.activeCategory());

  setCategory(cat: 'Auth' | 'Quantities') {
    this.activeCategory.set(cat);
  }

  getMethodClass(method: string): string {
    switch (method) {
      case 'GET': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'POST': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'PUT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
}
