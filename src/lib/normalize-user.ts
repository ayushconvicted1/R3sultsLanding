import type { AppUser } from "@/types/user";
import { emptyAppUser } from "@/types/user";

/**
 * Normalize external User API response to our AppUser (Postgres schema).
 * Handles both /api/auth/me and /api/user/profile response shapes.
 */
export function normalizeUser(ext: Record<string, unknown> | undefined): AppUser {
  if (!ext || typeof ext !== "object") return { ...emptyAppUser };

  const str = (v: unknown) => (v != null ? String(v) : "");
  const strOrNull = (v: unknown) => (v != null && v !== "" ? String(v) : null);
  const num = (v: unknown, def: number) => (typeof v === "number" ? v : def);
  const bool = (v: unknown, def: boolean) => (typeof v === "boolean" ? v : def);

  return {
    id: str(ext.id),
    phoneNumber: str(ext.phoneNumber ?? ext.phone),
    email: str(ext.email),
    username: str(ext.username),
    fullName: str(ext.fullName ?? ext.name),
    dateOfBirth: strOrNull(ext.dateOfBirth),
    gender: strOrNull(ext.gender),
    profilePictureUrl: strOrNull(ext.profilePictureUrl),
    address: strOrNull(ext.address),
    city: strOrNull(ext.city),
    state: strOrNull(ext.state),
    country: str(ext.country) || "India",
    pincode: strOrNull(ext.pincode),
    emergencyContactName: strOrNull(ext.emergencyContactName),
    emergencyContactPhone: strOrNull(ext.emergencyContactPhone),
    bloodGroup: strOrNull(ext.bloodGroup),
    medicalConditions: strOrNull(ext.medicalConditions),
    isVerified: bool(ext.isVerified, false),
    isActive: bool(ext.isActive, true),
    planLimit: num(ext.planLimit, 2),
    isSubscriber: bool(ext.isSubscriber, false),
    role: str(ext.role) || "MEMBER",
    propertyAddress: strOrNull(ext.propertyAddress),
    propertyDescription: strOrNull(ext.propertyDescription),
    planId: strOrNull(ext.planId) ?? "basic",
    createdAt: strOrNull(ext.createdAt),
    updatedAt: strOrNull(ext.updatedAt),
    propertyPhotos: Array.isArray(ext.propertyPhotos) ? ext.propertyPhotos : undefined,
    groups: Array.isArray(ext.groups) ? ext.groups : undefined,
  };
}
