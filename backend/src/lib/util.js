import fs from 'fs';

export const logPattern = (level, context, message, data) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 23);
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  const line = `[${timestamp}] [${level}] [${context}] ${message}${dataStr}`;
  const logPath = process.env.LOG_PATH;
  if (logPath) fs.appendFileSync(logPath, line + '\n');
  console.log(line);
};
