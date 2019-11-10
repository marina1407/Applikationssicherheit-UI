import { UserModel } from "./appContent";

const LOCAL_STORAGE_KEY = "notenapp-user";

export const saveUser = (user: UserModel) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const userJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (userJson) {
    const user: UserModel = JSON.parse(userJson);
    return user;
  }
  return null;
};

export const getUserId = () => {
  const user = getUser();
  if(user) {
    return user.id;
  }
  return 0;
}

export const removeStoredUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
