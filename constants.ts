// Determine if we're in ESM or CJS context
export const isESM = typeof __dirname === 'undefined' || 
                    (() => { try { return require.resolve; } catch { return false; }})() === false;