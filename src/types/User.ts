export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface PhoneVerification {
  phoneNumber: string;
  verificationCode: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}
