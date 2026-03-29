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

export const getValidityDate = (date) => {
  const currentDate = new Date(date);
  const fiveYears = currentDate.getFullYear() + 5;
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  return `${month}/${fiveYears}`;
}

export const formatRole = (role) => {
  var role_lower = role.toLowerCase();

  switch (role_lower) {
    case "pastor":
      return "Pastor";
    case "deacon":
      return "Diácono";
    case "member":
      return "Membro";
    case "elder":
      return "Presbítero";
    case "auxiliary":
      return "Auxiliar";
    default:
      return "Membro";
  }

}

export const formatCivilStatus = (civilStatus) => {
  var civilStatus_lower = civilStatus.toLowerCase();

  switch (civilStatus_lower) {
    case "single":
      return "Solteiro(a)";
    case "married":
      return "Casado(a)";
    case "divorced":
      return "Divorciado(a)";
    case "widowed":
      return "Viúvo(a)";
    default:
      return "Membro";
  }

}
