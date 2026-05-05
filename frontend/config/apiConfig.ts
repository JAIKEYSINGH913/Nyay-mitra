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
  sarvam: {
    apiKey: process.env.NEXT_PUBLIC_SARVAM_API_KEY || '',
  },
  baseUrl: 'https://nyay-python-gateway.fly.dev',
};

export const validateConfig = () => {
  const missing = [];
  if (!apiConfig.neo4j.uri) missing.push('NEO4J_URI');
  if (!apiConfig.gemini.apiKey) missing.push('GEMINI_API_KEY');
  if (!apiConfig.sarvam.apiKey) missing.push('SARVAM_API_KEY');
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};
