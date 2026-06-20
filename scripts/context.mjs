import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const generatedPath = path.join(root, 'generated', 'miningCoreNodes.json');
const tuningPath = path.join(root, 'src', 'game', 'tuning.ts');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const nodes = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
const tuningSource = fs.readFileSync(tuningPath, 'utf8');

const branchCounts = {};
const costPresets = {};
const effectKeys = new Set();
const ids = new Set(nodes.map((node) => node.id));
const invalidParentNodes = [];

for (const node of nodes) {
  branchCounts[node.branch] = (branchCounts[node.branch] ?? 0) + 1;
  costPresets[node.costPreset] = (costPresets[node.costPreset] ?? 0) + 1;
  effectKeys.add(node.effectKey);
  if (node.parents.some((parentId) => !ids.has(parentId))) {
    invalidParentNodes.push(node.id);
  }
}

const recognizedEffects = new Set(
  Array.from(tuningSource.matchAll(/^\s+([A-Z0-9_]+): effectValue\(/gm)).map((match) => match[1])
);
const missingEffects = Array.from(effectKeys).filter((key) => !recognizedEffects.has(key)).sort();

const result = {
  packageScripts: pkg.scripts,
  packageExists: true,
  srcExists: fs.existsSync(path.join(root, 'src')),
  generatedData: {
    totalNodeCount: nodes.length,
    branchCounts,
    costPresets,
    uniqueEffectKeyCount: effectKeys.size,
    recognizedEffectKeyCount: Array.from(effectKeys).filter((key) => recognizedEffects.has(key)).length,
    missingEffects,
    invalidParentNodes
  },
  pwa: {
    manifest: fs.existsSync(path.join(root, 'public', 'manifest.webmanifest')),
    serviceWorker: fs.existsSync(path.join(root, 'public', 'sw.js')),
    icon192: fs.existsSync(path.join(root, 'public', 'icon-192.svg')),
    icon512: fs.existsSync(path.join(root, 'public', 'icon-512.svg'))
  }
};

console.log(JSON.stringify(result, null, 2));

if (missingEffects.length > 0 || invalidParentNodes.length > 0 || nodes.length !== 189) {
  process.exitCode = 1;
}
