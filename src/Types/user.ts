import { Thought } from "./thoughts";

export type Role = "professional" | "client" | "admin";

export interface BaseUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Admin extends BaseUser {
  role: "admin";
}

export interface Professional extends BaseUser {
  role: "professional";
  crp: string;
  clients: string[];
  clientsProfiles?: Client[]; // lista de IDs dos pacientes
}

export interface Client extends BaseUser {
  role: "client";
  nameResponsible: string;
  crpResponsible: string;
  thoughts: Thought[];
}

export type UserType = Professional | Client | Admin;
