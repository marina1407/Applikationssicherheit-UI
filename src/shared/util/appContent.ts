export interface SemesterModel {
  id: number;
  bezeichnung: string;
  schulTyp: string;
}

export interface SubjectModel {
  id: number;
  bezeichnung: string;
  gewichtung: number;
  notizen: string;
  durchschnitt: number;
  semesterId: number;
}

export interface MarkModel {
  id: number;
  note: number;
  gewichtung: number;
  notiz: string;
  date: Date;
  fachId: number;
}

export interface UserModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserModel {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface VerifyUserModel {
  email: string;
  password: string;
}
