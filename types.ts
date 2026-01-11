export interface User {
  id?: number;
  username: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Dataset {
  name: string;
  data: any[]; // JSON representation of CSV
  headers: string[];
  rowCount: number;
}

export interface MLModel {
  id: string;
  name: string;
  type: 'Regression' | 'Classification' | 'Clustering';
  accuracy: string;
  status: 'trained' | 'untrained';
  description: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  datasetName: string;
  modelName: string;
  accuracy: string;
  insights: string;
}

export enum AppRoute {
  HOME = '/',
  DASHBOARD = '/dashboard',
  LOGIN = '/login',
  SIGNUP = '/signup',
  HISTORY = '/history',
  PROFILE = '/profile',
  QUIZ = '/quiz',
  DEVELOPER = '/developer',
  TERMS = '/terms',
  PRIVACY = '/privacy',
  CONTACT = '/contact',
  TIPS = '/tips',
}