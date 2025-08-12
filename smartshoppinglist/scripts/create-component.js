#!/usr/bin/env node

/**
 * Component Generator Script
 * Creates a new component with separated logic and UI following our pattern
 * 
 * Usage: node scripts/create-component.js ComponentName
 */

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: node scripts/create-component.js ComponentName');
  process.exit(1);
}

const componentDir = path.join(__dirname, '..', 'app', 'components', componentName);

// Create component directory
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
  console.log(`✅ Created directory: ${componentDir}`);
} else {
  console.log(`⚠️  Directory already exists: ${componentDir}`);
}

// Template for logic hook
const logicTemplate = `import { useState } from 'react'

interface Use${componentName}LogicProps {
  // Add your props here
}

/**
 * Custom hook for ${componentName} business logic
 * Handles state management, event handlers, and computations
 */
export const use${componentName}Logic = ({ 
  // Add props destructuring here
}: Use${componentName}LogicProps) => {
  // State management
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Event handlers
  const handleSomething = () => {
    // Add your business logic here
  }

  // Computed values
  // const computedValue = useMemo(() => {
  //   // Add computations here
  // }, [dependencies])

  return {
    // State
    loading,
    error,
    
    // Event handlers
    handleSomething,
    
    // Computed values
    // computedValue,
  }
}`;

// Template for UI component
const uiTemplate = `interface ${componentName}UIProps {
  // State props
  loading: boolean
  error: string | null
  
  // Event handler props
  onSomething: () => void
  
  // Add more props as needed
}

/**
 * Pure UI component for ${componentName}
 * Contains only rendering logic, no business logic
 */
export const ${componentName}UI = ({
  loading,
  error,
  onSomething,
}: ${componentName}UIProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">${componentName}</h2>
      
      {error && (
        <div className="text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={onSomething}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  )
}`;

// Template for container component
const containerTemplate = `import { use${componentName}Logic } from './use${componentName}Logic'
import { ${componentName}UI } from './${componentName}UI'

interface ${componentName}Props {
  // Add your public API props here
}

/**
 * Container component that combines logic and UI
 * Follows the Container/Presentational pattern
 */
export const ${componentName} = ({ 
  // Add props destructuring here
}: ${componentName}Props) => {
  const logic = use${componentName}Logic({
    // Pass props to logic hook
  })

  return (
    <${componentName}UI
      loading={logic.loading}
      error={logic.error}
      onSomething={logic.handleSomething}
      // Add more prop mappings as needed
    />
  )
}`;

// Write files
const files = [
  {
    name: `use${componentName}Logic.ts`,
    content: logicTemplate
  },
  {
    name: `${componentName}UI.tsx`,
    content: uiTemplate
  },
  {
    name: 'index.tsx',
    content: containerTemplate
  }
];

files.forEach(file => {
  const filePath = path.join(componentDir, file.name);
  fs.writeFileSync(filePath, file.content);
  console.log(`✅ Created: ${file.name}`);
});

// Update component index.ts
const indexPath = path.join(__dirname, '..', 'app', 'components', 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes(`export { ${componentName} }`)) {
  const newExport = `export { ${componentName} } from './${componentName}'`;
  fs.appendFileSync(indexPath, `\n${newExport}`);
  console.log(`✅ Added export to components/index.ts`);
}

console.log(`\n🎉 Component ${componentName} created successfully!`);
console.log(`\n📁 Files created:`);
files.forEach(file => {
  console.log(`   - ${componentName}/${file.name}`);
});

console.log(`\n💡 Next steps:`);
console.log(`   1. Implement your business logic in use${componentName}Logic.ts`);
console.log(`   2. Design your UI in ${componentName}UI.tsx`);
console.log(`   3. Update prop interfaces as needed`);
console.log(`   4. Import and use: import { ${componentName} } from '@/app/components'`);
