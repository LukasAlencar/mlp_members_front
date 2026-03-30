import { build } from 'esbuild'

const define = {
  'process.env.CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME || ''),
  'process.env.CLOUDINARY_API_KEY': JSON.stringify(process.env.CLOUDINARY_API_KEY || ''),
  'process.env.CLOUDINARY_API_SECRET': JSON.stringify(process.env.CLOUDINARY_API_SECRET || ''),
}

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  external: [
    '@prisma/client',
    'prisma',
    '@mapbox/node-pre-gyp',
    'mock-aws-s3',
    'aws-sdk',
    'nock',
    'bcrypt',
    'sharp',
    'better-sqlite3'
  ],
  define,
})

console.log('Build concluído!')
