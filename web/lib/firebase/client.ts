// Stub simples para futura integração com Firebase.
// Aqui manteremos apenas a definição da função de inicialização,
// sem trazer dependências reais enquanto o backend não estiver em uso.

type FirebaseAppLike = object;

const cachedApp: FirebaseAppLike | null = null;

export function getFirebaseApp(): FirebaseAppLike | null {
  // Quando a integração estiver pronta, esta função deve:
  // - Ler configurações do Firebase (por variáveis de ambiente);
  // - Chamar initializeApp apenas uma vez;
  // - Devolver a instância de FirebaseApp.
  return cachedApp;
}

