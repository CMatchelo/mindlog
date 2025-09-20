export const firebaseErrors: Record<string, string> = {
  "auth/invalid-email": "O e-mail informado é inválido.",
  "auth/user-disabled": "Esta conta foi desativada. Entre em contato com o suporte.",
  "auth/user-not-found": "Usuário não encontrado. Verifique o e-mail informado.",
  "auth/wrong-password": "Senha incorreta. Tente novamente.",
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Falha na conexão. Verifique sua internet.",
  default: "Ocorreu um erro inesperado. Tente novamente.",
};

export const getFirebaseErrorMessage = (code: string): string => {
  return firebaseErrors[code] || firebaseErrors.default;
};