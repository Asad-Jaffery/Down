// User interface for authentication and onboarding
export interface UserMetadata {
  uid: string;
  username: string;
  displayName: string;
  authMethod: 'phone';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}
