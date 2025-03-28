const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? '' : 'E-mail inválido';
};

const validateName = (name) => {
  return name.trim().length >= 3 ? '' : 'O nome deve ter pelo menos 3 caracteres';
};

const validateCpf = (cpf) => {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf) ? '' : 'CPF inválido (000.000.000-00)';
};

const validateRG = (rg) => {
  const rgRegex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9Xx]$/;
  return rgRegex.test(rg) ? '' : 'RG inválido';
};

const validatePhone = (phone) => {
  const regex = /^\(?\d{2}\)?\s?(?:9\d{4}|\d{4})-\d{4}$/;
  return regex.test(phone) ? '' : 'Telefone inválido';
};

const validateBirthDate = (birthDate) => {
  if (!birthDate) return 'Data de nascimento é obrigatória';
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  return age >= 12 ? '' : 'O membro deve ter pelo menos 12 anos';
};

const validateRole = (role) => {
  const validRoles = ['member', 'pastor', 'elder', 'deacon', 'auxiliary'];
  return validRoles.includes(role) ? '' : 'Cargo inválido';
};

const validateImage = (image) => {
  if (!image) return 'A imagem é obrigatória';

  const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedExtensions.includes(image.type)) {
    return 'Apenas imagens JPEG ou PNG são permitidas';
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;

      if (Math.abs(aspectRatio - (3 / 4)) > 0.01) {
        resolve('A imagem deve ter proporção 3x4');
      } else {
        resolve('');
      }
    };
  });
};

export { validateEmail, validateName, validateCpf, validateRG, validatePhone, validateBirthDate, validateRole, validateImage };
