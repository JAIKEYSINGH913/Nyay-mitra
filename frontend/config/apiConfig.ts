export const apiConfig = {
  neo4j: {
    uri: process.env.NEXT_PUBLIC_NEO4J_URI || '',
    user: process.env.NEXT_PUBLIC_NEO4J_USER || '',
    password: process.env.NEXT_PUBLIC_NEO4J_PASSWORD || '',
    apiKey: process.env.NEXT_PUBLIC_NEO4J_API_KEY || '',
    auditDb: {
      uri: process.env.NEXT_PUBLIC_NEO4J_AUDIT_DB_URI || '',
      user: process.env.NEXT_PUBLIC_NEO4J_AUDIT_DB_USER || '',
      password: process.env.NEXT_PUBLIC_NEO4J_AUDIT_DB_PASSWORD || '',
    }
  },
  gemini: {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  },
  bhashini: {
    apiKey: process.env.NEXT_PUBLIC_BHASHINI_API_KEY || '',
  },
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
};

export const validateConfig = () => {
  const missing = [];
  if (!apiConfig.neo4j.uri) missing.push('NEO4J_URI');
  if (!apiConfig.gemini.apiKey) missing.push('GEMINI_API_KEY');
  if (!apiConfig.bhashini.apiKey) missing.push('BHASHINI_API_KEY');
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};
