const TEMPLATES=Object.freeze({
  node:['node_modules/','.npm/','.yarn/','npm-debug.log*','yarn-debug.log*','pnpm-debug.log*'],
  python:['__pycache__/','*.py[cod]','.venv/','venv/','.pytest_cache/','.mypy_cache/'],
  java:['*.class','target/','.gradle/','build/'],
  dotnet:['bin/','obj/','*.user','*.suo'],
  go:['*.exe','*.test','*.out','coverage.out'],
  rust:['target/'],
  php:['vendor/','.phpunit.cache/','composer.phar'],
  ruby:['.bundle/','vendor/bundle/','coverage/','log/'],
  swift:['.build/','DerivedData/','*.xcuserstate','xcuserdata/'],
  flutter:['.dart_tool/','build/','.flutter-plugins*'],
  android:['.gradle/','local.properties','captures/','*.iml'],
  macos:['.DS_Store','._*','.AppleDouble','.LSOverride'],
  windows:['Thumbs.db','Thumbs.db:encryptable','ehthumbs.db','Desktop.ini'],
  linux:['*~','.directory'],
  jetbrains:['.idea/','*.iml'],
  vscode:['.vscode/'],
  terraform:['.terraform/','*.tfstate','*.tfstate.*','crash.log'],
  wordpress:['wp-content/cache/','wp-content/upgrade/'],
});
export const GITIGNORE_TEMPLATE_IDS=Object.freeze(Object.keys(TEMPLATES));
const COMMON=['# Generated locally by UsefulVerse Gitignore Generator','.DS_Store','Thumbs.db','*.log','.env','!.env.example','node_modules/','dist/','build/','coverage/','.cache/'];
export function generateGitignore(selection){const chosen=String(selection??'').split(/[\s,;]+/u).map(value=>value.trim().toLowerCase()).filter(Boolean);if(!chosen.length)throw Object.assign(new RangeError('Choose at least one template.'),{code:'empty-selection'});if(chosen.length>12)throw Object.assign(new RangeError('Choose up to 12 templates.'),{code:'too-many-templates'});const unique=[...new Set(chosen)];const unknown=unique.filter(id=>!Object.hasOwn(TEMPLATES,id));if(unknown.length)throw Object.assign(new RangeError('Choose templates from the supported list.'),{code:'unknown-template'});const lines=[...COMMON];for(const id of unique)lines.push(`\n# ${id}`,...TEMPLATES[id]);return Object.freeze({templates:Object.freeze(unique),text:`${[...new Set(lines)].join('\n').trim()}\n`});}
