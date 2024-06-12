export const randomString = (
  maxLength: number,
  characters: string = '0123456789abcdefghijklmnopqrstuvwxyz',
): string => {
  let randomStr = '';

  while (randomStr.length < maxLength) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomIndex];
  }

  return randomStr;
};
