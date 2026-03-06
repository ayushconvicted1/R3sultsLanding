/**
 * User shape aligned with Postgres schema and external User API (API_USAGE.csv).
 * Used for profile display and updates via GET/PATCH /api/user/profile, address, etc.
 */
export interface AppUser {
  id: string;
  phoneNumber: string;
  email: string;
  username: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  profilePictureUrl: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  bloodGroup: string | null;
  medicalConditions: string | null;
  isVerified: boolean;
  isActive: boolean;
  planLimit: number;
  isSubscriber: boolean;
  role: string;
  propertyAddress: string | null;
  propertyDescription: string | null;
  planId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  // Optional from API (propertyPhotos, groups, etc.)
  propertyPhotos?: unknown[];
  groups?: unknown[];
}

/** Default empty user for forms */
export const emptyAppUser: AppUser = {
  id: "",
  phoneNumber: "",
  email: "",
  username: "",
  fullName: "",
  dateOfBirth: null,
  gender: null,
  profilePictureUrl: null,
  address: null,
  city: null,
  state: null,
  country: "India",
  pincode: null,
  emergencyContactName: null,
  emergencyContactPhone: null,
  bloodGroup: null,
  medicalConditions: null,
  isVerified: false,
  isActive: true,
  planLimit: 2,
  isSubscriber: false,
  role: "MEMBER",
  propertyAddress: null,
  propertyDescription: null,
  planId: "basic",
  createdAt: null,
  updatedAt: null,
};

/** Backward compat: split fullName for components that use firstName/lastName */
export function fullNameToFirstLast(fullName: string): { firstName: string; lastName: string } {
  const parts = (fullName || "").trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") ?? "";
  return { firstName, lastName };
}

export function firstLastToFullName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}
