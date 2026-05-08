const allowedChars = /[^a-öA-Ö0-9 .,-<>!"#%&/()=?`´+@£$€{}[\]*^~]/g;

export const sanitizeToPlainText = (text: string) => {
  const clean = text.replace(allowedChars, '');
  return clean;
};
