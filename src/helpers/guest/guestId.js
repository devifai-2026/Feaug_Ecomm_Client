const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = `guest_${generateId()}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const clearGuestId = () => {
  localStorage.removeItem('guestId');
};
