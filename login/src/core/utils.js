export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 5) return 'Password must be at least 6 characters.';

  return '';
};

export const nameValidator = name => {
  const pattern = /^[a-zA-Z]{2,40}/;

  const re = /^[a-zA-Z\s]{2,32}/;
  if (!name || name.length <= 2 ) return 'Name should be at least 3 characters.';
  if (!pattern.test(name)) return 'Ooops! enter a valid name.';
  return '';
};
