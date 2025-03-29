export const formatDate = (date) => {
  const newDate = new Date(date).toISOString().split('T')[0]
  return newDate
}

export const formatDatePTBR = (date) => {
    const newDate = new Date(date);
    const day = String(newDate.getUTCDate()).padStart(2, '0');
    const month = String(newDate.getUTCMonth() + 1).padStart(2, '0');
    const year = newDate.getUTCFullYear();

    return `${day}/${month}/${year}`;
}
