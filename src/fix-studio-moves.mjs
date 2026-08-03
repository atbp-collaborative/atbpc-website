import fs from 'fs';
import path from 'path';

// 1. Update src/lib/routes.ts
const routesPath = './src/lib/routes.ts';
if (fs.existsSync(routesPath)) {
  let content = fs.readFileSync(routesPath, 'utf8');
  content = content.replace(/services: '\/services'/, "services: '/studio/services'");
  content = content.replace(/ourServices: '\/our-services'/, "ourServices: '/studio/our-services'");
  content = content.replace(/ourPeople: '\/our-people'/, "ourPeople: '/studio/our-people'");
  content = content.replace(/return `\/our-people\/\$\{slug\}`/, "return `/studio/our-people/${slug}`");
  fs.writeFileSync(routesPath, content, 'utf8');
  console.log('Updated routes.ts');
}

// 2. Fix imports in moved folders: our-people, our-services, services
const foldersToFix = [
  './src/app/studio/our-people',
  './src/app/studio/our-services',
  './src/app/studio/services'
];

function fixImportsInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      fixImportsInDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Since they moved from src/app/our-people (depth 3) to src/app/studio/our-people (depth 4)
      // all relative imports going up need one more '../'.
      // Usually they were importing from '../../lib' or '../../components'.
      // We need to replace '../../' with '../../../' carefully.
      
      // To be completely safe and generic, we replace any import starting with '../' up to arbitrary depth 
      // by prepending an extra '../'.
      // Example: `import { X } from '../../lib'` -> `import { X } from '../../../lib'`
      
      // Regex matches `from '..` or `import('..`
      content = content.replace(/from '(\.\.\/)+/g, (match) => {
        return match + '../';
      });
      content = content.replace(/import\('(\.\.\/)+/g, (match) => {
        return match + '../';
      });
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated imports in ${fullPath}`);
    }
  }
}

for (const folder of foldersToFix) {
  fixImportsInDir(folder);
}

console.log('Done.');
