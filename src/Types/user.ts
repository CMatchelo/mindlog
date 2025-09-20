import { Thought } from "./thoughts";

export type Role = "professional" | "client";

export interface BaseUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Professional extends BaseUser {
  role: "professional";
  patients: string[]; // lista de IDs dos pacientes
}

export interface Client extends BaseUser {
  role: "client";
  nameResponsible: string;
  thoughts: Thought[];
}

export type UserType = Professional | Client;
