const fs = require('fs');
const path = require('path');

// Utility function to move files
function moveFile(source, target) {
  fs.rename(source, target, (err) => {
    if (err) {
      console.error(`Error moving ${source} to ${target}: ${err}`);
    } else {
      console.log(`Moved ${source} to ${target}`);
    }
  });
}

// Step 1: Create New Directories
const featureFolders = ['wallet', 'portfolio', 'exchange'];
featureFolders.forEach((feature) => {
  const basePath = path.join('apps', 'cryptiq-shell', 'features', feature);
  ['components', 'services', 'state'].forEach((subFolder) => {
    const folderPath = path.join(basePath, subFolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created directory: ${folderPath}`);
    }
  });
});

// Step 2: Move Feature-Based Components, Services, and State Files
const moveMappings = [
  // Exchange Manager
  {
    source: 'apps/cryptiq-shell/components/ExchangeManager/AddExchangeAccount.tsx',
    target: 'apps/cryptiq-shell/features/exchange/components/AddExchangeAccount.tsx',
  },
  {
    source: 'apps/cryptiq-shell/components/ExchangeManager/ConnectedExchangesList.tsx',
    target: 'apps/cryptiq-shell/features/exchange/components/ConnectedExchangesList.tsx',
  },
  // Portfolio Overview
  {
    source: 'apps/cryptiq-shell/components/PortfolioOverview/PortfolioAggregation.tsx',
    target: 'apps/cryptiq-shell/features/portfolio/components/PortfolioAggregation.tsx',
  },
  {
    source: 'apps/cryptiq-shell/components/PortfolioOverview/IndividualPortfolio.tsx',
    target: 'apps/cryptiq-shell/features/portfolio/components/IndividualPortfolio.tsx',
  },
  // Wallet Manager
  {
    source: 'apps/cryptiq-shell/components/WalletManager/ConnectWalletModal.tsx',
    target: 'apps/cryptiq-shell/features/wallet/components/ConnectWalletModal.tsx',
  },
  {
    source: 'apps/cryptiq-shell/components/WalletManager/ConnectedWalletsList.tsx',
    target: 'apps/cryptiq-shell/features/wallet/components/ConnectedWalletsList.tsx',
  },
  // Wallet Services and State
  {
    source: 'apps/cryptiq-shell/services/walletService.ts',
    target: 'apps/cryptiq-shell/features/wallet/services/walletService.ts',
  },
  {
    source: 'apps/cryptiq-shell/state/walletState.js',
    target: 'apps/cryptiq-shell/features/wallet/state/walletState.js',
  },
  // Exchange State (if any)
  {
    source: 'apps/cryptiq-shell/state/exchangeState.js',
    target: 'apps/cryptiq-shell/features/exchange/state/exchangeState.js',
  },
  // More mappings can be added here for other features
];

// Execute the file moves
moveMappings.forEach(({ source, target }) => {
  moveFile(source, target);
});

// Step 3: Shared Components & Utilities
const sharedFolders = ['components', 'lib', 'styles'];
const sharedBasePath = path.join('apps', 'cryptiq-shell', 'shared');

sharedFolders.forEach((folder) => {
  const folderPath = path.join(sharedBasePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created directory: ${folderPath}`);
  }
});

// Move shared components
const sharedMappings = [
  {
    source: 'apps/cryptiq-shell/components/ui/Button.tsx',
    target: 'apps/cryptiq-shell/shared/components/Button.tsx',
  },
  {
    source: 'apps/cryptiq-shell/components/ui/Loader.tsx',
    target: 'apps/cryptiq-shell/shared/components/Loader.tsx',
  },
  {
    source: 'apps/cryptiq-shell/components/ui/FormError.tsx',
    target: 'apps/cryptiq-shell/shared/components/FormError.tsx',
  },
  {
    source: 'apps/cryptiq-shell/components/ui/FormSuccess.tsx',
    target: 'apps/cryptiq-shell/shared/components/FormSuccess.tsx',
  },
  // Add more mappings for shared components here if needed
];

sharedMappings.forEach(({ source, target }) => {
  moveFile(source, target);
});

// Step 4: Update Import Paths (Optional Enhancement)
function updateImportPaths(baseDir, oldPath, newPath) {
  const walkSync = (dir, callback) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkSync(filePath, callback);
      } else if (stat.isFile() && file.endsWith('.tsx')) {
        callback(filePath);
      }
    });
  };

  walkSync(baseDir, (file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return console.error(`Error reading file ${file}: ${err}`);

      const updatedData = data.replace(
        new RegExp(oldPath, 'g'),
        newPath
      );

      if (updatedData !== data) {
        fs.writeFile(file, updatedData, 'utf8', (writeErr) => {
          if (writeErr) {
            console.error(`Error updating imports in ${file}: ${writeErr}`);
          } else {
            console.log(`Updated imports in ${file}`);
          }
        });
      }
    });
  });
}

// Update import paths for shared components and moved files
updateImportPaths(
  path.join('apps', 'cryptiq-shell'),
  '../../ui/',
  '../../shared/components/'
);

// Update import paths for feature-based components
updateImportPaths(
  path.join('apps', 'cryptiq-shell'),
  '../../components/ExchangeManager/',
  '../../features/exchange/components/'
);
updateImportPaths(
  path.join('apps', 'cryptiq-shell'),
  '../../components/PortfolioOverview/',
  '../../features/portfolio/components/'
);
updateImportPaths(
  path.join('apps', 'cryptiq-shell'),
  '../../components/WalletManager/',
  '../../features/wallet/components/'
);
