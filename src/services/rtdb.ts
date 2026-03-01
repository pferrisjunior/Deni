// src/services/rtdb.ts
// Single place for all RTDB reads and writes.
// UI screens call these functions, not firebase/database directly.

import { ref, set, get, update, push } from "firebase/database";
import { db, auth } from "../firebase";

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not logged in. Sign in first.");
  return uid;
}

function stripUndefined<T extends Record<string, any>>(obj: T): T {
  const result: any = {};

  for (const key in obj) {
    const value = obj[key];

    if (value === undefined) continue;

    // Recursively clean nested objects
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = stripUndefined(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export type UserProfile = {
  createdAt: number;
  displayName: string;
  email: string;
  lastLoginAt: number;
  photoURL: string;
  role?: "user" | "admin";
};

export type GeoLocation = {
  lat: number;
  lng: number;
  geohash?: string;
  name?: string;
};

export type EventRecord = {
  createdAt: number;
  updatedAt: number;
  createdByUid: string;
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  isVerified: boolean;
  location: GeoLocation;
  truckIds?: Record<string, true>;
};

export type TruckRecord = {
  createdAt: number;
  updatedAt: number;
  ownerUid: string;
  name: string;
  isVerified: boolean;
  location: GeoLocation;
};

export async function createOrUpdateOwnUserProfile(
  input?: Partial<UserProfile>
) {
  const uid = requireUid();
  const now = Date.now();
  const path = `users/${uid}`;

  // Preserve createdAt if it already exists
  const existing = await get(ref(db, path));
  const existingCreatedAt =
    existing.exists() && existing.val()?.createdAt
      ? Number(existing.val().createdAt)
      : now;

  const payload: UserProfile = {
    createdAt: input?.createdAt ?? existingCreatedAt,
    displayName: input?.displayName ?? "User",
    email: input?.email ?? (auth.currentUser?.email ?? ""),
    lastLoginAt: now,
    photoURL: input?.photoURL ?? (auth.currentUser?.photoURL ?? ""),
    ...(input?.role ? { role: input.role } : {}),
  };

  await set(ref(db, path), stripUndefined(payload));
  return { uid, path, payload };
}

export async function getOwnUserProfile() {
  const uid = requireUid();
  const path = `users/${uid}`;
  const snap = await get(ref(db, path));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

export type CreateEventInput = {
  title: string;
  startTime: number;
  endTime?: number;
  description?: string;
  location: GeoLocation;
  truckIds?: Record<string, true>;
};

export async function createEvent(input: CreateEventInput) {
  const uid = requireUid();
  const now = Date.now();

  // Use push() for collision free keys
  const eventsRef = ref(db, "events");
  const newRef = push(eventsRef);
  const eventId = newRef.key as string;
  const path = `events/${eventId}`;

  const payload: EventRecord = {
    createdAt: now,
    updatedAt: now,
    createdByUid: uid,
    title: input.title,
    description: input.description ?? "",
    startTime: input.startTime,
    endTime: input.endTime ?? input.startTime,
    isVerified: false, // keep rule invariant
    location: input.location,
    truckIds: input.truckIds ?? {},
  };

  await set(newRef, stripUndefined(payload));
  return { eventId, path, payload };
}

export async function updateEvent(
  eventId: string,
  patch: Partial<Omit<EventRecord, "createdByUid" | "createdAt" | "isVerified">>
) {
  const now = Date.now();
  const path = `events/${eventId}`;

  // Always update updatedAt here
  const payload = { ...patch, updatedAt: now };

  // Ensure caller cannot sneak in disallowed fields
  delete (payload as any).createdByUid;
  delete (payload as any).createdAt;
  delete (payload as any).isVerified;

  await update(ref(db, path), payload);
  return { eventId, path, payload };
}

export async function getEvent(eventId: string) {
  const path = `events/${eventId}`;
  const snap = await get(ref(db, path));
  return snap.exists() ? (snap.val() as EventRecord) : null;
}

export type CreateTruckInput = {
  name: string;
  location: GeoLocation;
};

export async function createTruck(input: CreateTruckInput) {
  const uid = requireUid();
  const now = Date.now();

  const trucksRef = ref(db, "trucks");
  const newRef = push(trucksRef);
  const truckId = newRef.key as string;
  const path = `trucks/${truckId}`;

  const payload: TruckRecord = {
    createdAt: now,
    updatedAt: now,
    ownerUid: uid,
    name: input.name,
    isVerified: false,
    location: input.location,
  };

  await set(newRef, payload);
  return { truckId, path, payload };
}

export async function updateTruck(
  truckId: string,
  patch: Partial<Omit<TruckRecord, "ownerUid" | "createdAt" | "isVerified">>
) {
  const now = Date.now();
  const path = `trucks/${truckId}`;

  const payload = { ...patch, updatedAt: now };

  delete (payload as any).ownerUid;
  delete (payload as any).createdAt;
  delete (payload as any).isVerified;

  await update(ref(db, path), payload);
  return { truckId, path, payload };
}

export async function getTruck(truckId: string) {
  const path = `trucks/${truckId}`;
  const snap = await get(ref(db, path));
  return snap.exists() ? (snap.val() as TruckRecord) : null;
}