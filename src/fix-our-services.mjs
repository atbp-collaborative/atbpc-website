import fs from 'fs';
import path from 'path';

const files = [
  './src/app/studio/our-services/OurServicesClient.tsx',
  './src/app/studio/our-services/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\//g, '../../../');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
