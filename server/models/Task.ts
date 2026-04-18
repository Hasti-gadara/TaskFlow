// This folder would typically contain Mongoose schemas.
// For Firestore, we use TypeScript interfaces to define our data model.

export interface TaskModel {
  title: string;
  description: string;
  status: 'todo' | 'done';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
