import {
  CreateUserModel,
  MarkModel,
  SemesterModel,
  SubjectModel,
  UserModel,
  VerifyUserModel
} from "./appContent";

const API_BASE_URL = 'http://localhost:8080/api';

const call = <T>(url: string, method: string, body: object): Promise<T> => {
  return Promise.resolve(fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    }
  }).then(function (response) {
    if (response.status === 400) {
      return Promise.resolve(null);
    }
    return response.json();
  }).then(function (data) {
    return Promise.resolve(data);
  }));
}

const callWithoutRequestBody = <T>(url: string, method: string): Promise<T> => {
  return Promise.resolve(fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json',
    }
  }).then(function (response) {
    if (response.status === 400) {
      return Promise.resolve(null);
    }
    return response.json();
  }).then(function (data) {
    return Promise.resolve(data);
  }));
}

const callWithoutResponseBody = (url: string, method: string): Promise<boolean> => {
  return Promise.resolve(fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json',
    }
  }).then(function (response) {
    if (response.status === 204) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }).catch(function () {
    return Promise.resolve(false);
  }));
}

export const getSemesters = async (userId: number): Promise<SemesterModel[]> => {

  const response: SemesterListResponse = await callWithoutRequestBody<SemesterListResponse>(`${API_BASE_URL}/semester/benutzer/${userId}`, 'get');
  const semesters: SemesterModel[] = response.semesters.map(
    sem => {
      return {
        id: sem.id,
        bezeichnung: sem.bezeichnung,
        schulTyp: sem.schulTyp,
      }
    }
  );
  return semesters;
};

export const getSemesterMarks = async (semesterId: number): Promise<SubjectModel[]> => {

  const response: SubjectListResponse = await callWithoutRequestBody<SubjectListResponse>(`${API_BASE_URL}/fach/semester/${semesterId}`, 'get');
  const subjects: SubjectModel[] = response.fachListe.map(
    fach => {
      return {
        id: fach.id,
        bezeichnung: fach.bezeichnung,
        notizen: fach.notizen,
        gewichtung: fach.gewichtung,
        durchschnitt: 0,
        semesterId
      }
    }
  );
  return subjects;
};

export const getSubjectMarks = async (subject: number): Promise<MarkModel[]> => {
  const response: NoteListResponse = await callWithoutRequestBody<NoteListResponse>(`${API_BASE_URL}/note/fach/${subject}`, 'get');
  const subjects: MarkModel[] = response.noten.map(
    note => {
      return {
        id: note.id,
        note: note.note,
        notiz: note.notiz,
        gewichtung: note.gewichtung,
        date: new Date(note.datum),
        fachId: subject
      }
    }
  );
  return subjects;
};

export const createMark = async (mark: MarkModel) => {
  const response: MarkResponse = await call<MarkResponse>(`${API_BASE_URL}/note`, 'put', {
    note: mark.note,
    gewichtung: mark.gewichtung,
    notiz: mark.notiz,
    fachId: mark.fachId,
    datum: mark.date.toISOString().split('T')[0]
  });
  if (response) {
    return {
      id: response.id,
      note: response.note,
      gewichtung: response.gewichtung,
      notiz: response.notiz,
      date: new Date(response.datum),
    };
  }
  return null;
};

export const createSemester = async (semester: SemesterModel, userId: number) => {
  const response: SemesterModel = await call<SemesterModel>(`${API_BASE_URL}/semester`, 'put', {
    bezeichnung: semester.bezeichnung,
    schulTyp: semester.schulTyp,
    benutzerId: userId
  });
  if (response) {
    return response;
  }
  return null;
};

export const createSubject = async (subject: SubjectModel) => {
  const response: SemesterModel = await call<SemesterModel>(`${API_BASE_URL}/fach`, 'put', {
    bezeichnung: subject.bezeichnung,
    gewichtung: subject.gewichtung,
    notizen: subject.notizen,
    semesterId: subject.semesterId
  });
  if (response) {
    return response;
  }
  return null;
};

export const createUser = async (createUser: CreateUserModel) => {

  const response: UserResponse = await call<UserResponse>(`${API_BASE_URL}/benutzer`, 'put', {
    vorname: createUser.firstName,
    nachname: createUser.lastName,
    email: createUser.email,
    passwort: createUser.password,
  });
  if (response) {
    const user: UserModel = {
      id: response.id,
      email: response.email,
      firstName: response.vorname,
      lastName: response.nachname
    };
    return user;
  }
  return null;
};

export const verifyUser = async (verifyUser: VerifyUserModel) => {

  const response: UserResponse = await call<UserResponse>(API_BASE_URL + '/benutzer/verify', 'post', {
    email: verifyUser.email,
    passwort: verifyUser.password,
  });
  if (response) {
    const user: UserModel = {
      id: response.id,
      email: response.email,
      firstName: response.vorname,
      lastName: response.nachname
    };
    return user;
  }
  return null;
};

export const deleteUser = async (userId: number) => {
  const response: boolean = await callWithoutResponseBody(API_BASE_URL + `/benutzer/${userId}`, 'delete');
  return response;
};

export const deleteSemester = async (semesterId: number) => {
  const response: boolean = await callWithoutResponseBody(API_BASE_URL + `/semester/${semesterId}`, 'delete');
  return response;
};

export const deleteSubject = async (subjectId: number) => {
  const response: boolean = await callWithoutResponseBody(API_BASE_URL + `/fach/${subjectId}`, 'delete');
  return response;
}

export interface UserResponse {
  id: number;
  email: string;
  vorname: string;
  nachname: string;
}

export interface SemesterListResponse {
  semesters: SemesterResponse[];
}

export interface SemesterResponse {
  bezeichnung: string;
  id: number;
  schulTyp: string;
}

export interface SubjectListResponse {
  fachListe: SubjectResponse[];
}

export interface SubjectResponse {
  bezeichnung: string;
  id: number;
  gewichtung: number;
  notizen: string
}

export interface NoteListResponse {
  noten: NoteResponse[];
}

export interface NoteResponse {
  datum: string;
  id: number;
  gewichtung: number;
  notiz: string,
  note: number,
}


export interface MarkResponse {
  id: number;
  note: number;
  gewichtung: number;
  notiz: string;
  datum: string;
}