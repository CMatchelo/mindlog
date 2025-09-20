export interface Thought {
  id: string;
  situation: string;
  emotion?: string;
  automaticThought: string;
  evidenceFor?: string;
  evidenceAgainst: string;
  alternativeThought: string;
  createdAt?: unknown; // firebase.Timestamp se quiser tipar melhor
}