const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = require('../package.json');
const { build = {}, name, version } = packageJson;
const appId = build.appId || `com.aileck.${name}`;
const productName = build.productName || name;

const languages = ['en', 'zh', 'es'];

// Create language-specific builds
async function buildForLanguage(lang) {
  console.log(`Building for language: ${lang}`);
  
  // Read electron-builder.yml
  const builderConfigPath = path.join(__dirname, '..', 'electron-builder.yml');
  const configContent = fs.readFileSync(builderConfigPath, 'utf8');
  
  // Create language-specific config
  const langConfig = configContent
    // Keep the same appId for all versions
    .replace(
      /appId: .+/,
      `appId: ${appId}`
    )
    // Keep the same productName but add language suffix in artifactName
    .replace(
      /productName: .+/,
      `productName: ${productName}`
    )
    // Update Windows configuration
    .replace(
      /win:[\s\S]*?(?=\n\w|$)/,
      `win:
  executableName: ${name}
  target: 
    - target: nsis
      arch: 
        - x64
  artifactName: \${name}-\${version}-\${arch}-${lang}.\${ext}`
    )
    // Update NSIS configuration
    .replace(
      /nsis:[\s\S]*?(?=\n\w|$)/,
      `nsis:
  artifactName: \${name}-\${version}-\${arch}-${lang}-setup.\${ext}
  shortcutName: \${productName}
  uninstallDisplayName: \${productName}
  createDesktopShortcut: always
  oneClick: false
  allowToChangeInstallationDirectory: true
  deleteAppDataOnUninstall: false
  include: installer.nsh`
    )
    // Add asar configuration
    .replace(
      /asar:[\s\S]*?(?=\n\w|$)/,
      `asar: true
asarUnpack:
  - node_modules/koffi/**/*
  - **/*.node`
    )
    // Add directories configuration
    .replace(
      /directories:[\s\S]*?(?=\n\w|$)/,
      `directories:
  buildResources: resources
  output: dist_electron`
    )
    // Add extraResources configuration
    + `\nextraResources:
  - from: dlls
    to: dlls
    filter:
      - "**/*"`;
  
  // Write temporary config
  const tempConfigPath = path.join(__dirname, '..', `electron-builder.${lang}.yml`);
  fs.writeFileSync(tempConfigPath, langConfig);
  
  try {
    // Build with language-specific config
    console.log(`Building ${lang} version with electron-builder...`);
    
    // Use npx to ensure we're using the local electron-builder
    execSync(`npx electron-builder --config ${tempConfigPath} --win --x64`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES: 'true'
      }
    });
    
    console.log(`Successfully built ${lang} version`);
  } catch (error) {
    console.error(`Error building for ${lang}:`, error);
    throw error;
  } finally {
    // Clean up temporary config
    fs.unlinkSync(tempConfigPath);
  }
}

// Build for all languages
async function buildAll() {
  console.log('Starting multi-language build...');
  
  try {
    // First build the app
    console.log('Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Then create installers for each language
    for (const lang of languages) {
      await buildForLanguage(lang);
    }
    
    console.log('Multi-language build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildAll().catch(console.error); 