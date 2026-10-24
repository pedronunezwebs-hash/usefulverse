import { announce, readToolCopy } from '../controller-helpers.mjs';
import { assertChemicalStructure, createChemicalMolecule, parseChemicalStructure, summarizeChemicalStructure } from './logic.mjs';

const root = document.querySelector('[data-tool="chemical-structure-editor"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('[data-chem-form]');
  const canvas = root.querySelector('[data-chem-canvas]');
  const source = root.querySelector('[data-chem-source]');
  const sourceFormat = root.querySelector('[data-chem-source-format]');
  const element = root.querySelector('[data-chem-element]');
  const bondOrder = root.querySelector('[data-chem-bond-order]');
  const status = root.querySelector('[data-status]');
  const selected = root.querySelector('[data-chem-selection]');
  const formula = root.querySelector('[data-chem-formula]');
  const smiles = root.querySelector('[data-chem-smiles]');
  const undoButton = root.querySelector('[data-chem-undo]');
  const deleteButton = root.querySelector('[data-chem-delete]');
  let OCL;
  let molecule;
  let selection;
  const undo = [];

  const addSvgEventTargets = (svgMarkup) => {
    const parsed = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
    const svg = parsed.documentElement;
    if (svg.localName !== 'svg' || parsed.querySelector('parsererror')) throw new Error('The drawing could not be rendered.');
    for (const unsafe of svg.querySelectorAll('script,foreignObject,iframe,object,embed,style,animate,animateMotion,animateTransform,set')) unsafe.remove();
    for (const node of [svg, ...svg.querySelectorAll('*')]) {
      for (const attr of [...node.attributes]) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || ['href','xlink:href','style','src'].includes(name)) node.removeAttribute(attr.name);
      }
    }
    svg.setAttribute('class', 'chem-structure__svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    for (const target of svg.querySelectorAll('.event[id]')) {
      const match = target.id.match(/:(Atom|Bond):(\d+)$/u);
      if (!match) continue;
      const type = match[1].toLowerCase();
      target.setAttribute('tabindex', '0');
      target.setAttribute('role', 'button');
      target.setAttribute('aria-label', copy.fields.structurePart.replace('{type}', type === 'atom' ? copy.fields.atom : copy.fields.bond).replace('{number}', String(Number(match[2]) + 1)));
    }
    return document.importNode(svg, true);
  };

  const render = () => {
    if (!molecule) return;
    molecule.validate();
    assertChemicalStructure(molecule);
    const summary = summarizeChemicalStructure(molecule);
    const svg = addSvgEventTargets(molecule.toSVG(640, 420, 'usefulverse-chemical-structure', { autoCrop: true }));
    canvas.replaceChildren(svg);
    formula.textContent = summary.formula;
    smiles.value = summary.smiles;
    selected.textContent = selection ? copy.fields.selected.replace('{type}', selection.type === 'atom' ? copy.fields.atom : copy.fields.bond).replace('{number}', String(selection.index + 1)) : copy.fields.noSelection;
    deleteButton.disabled = !selection;
    undoButton.disabled = undo.length === 0;
  };

  const saveUndo = () => {
    undo.push(molecule.toMolfile());
    if (undo.length > 20) undo.shift();
  };

  const applyEdit = (edit) => {
    if (!molecule) return;
    saveUndo();
    try {
      edit();
      molecule.validate();
      assertChemicalStructure(molecule);
      render();
      announce(root, copy.messages.edited, 'success');
    } catch {
      molecule = parseChemicalStructure(OCL, undo.pop(), 'molfile');
      render();
      announce(root, copy.messages.invalidEdit, 'error');
    }
  };

  const start = async () => {
    try {
      // Separate module graphs may fetch dependencies at different speeds. Wait
      // for the local runtime module to publish its readiness promise.
      const deadline = Date.now() + 10000;
      while (!globalThis.UsefulVerseChemicalEngineReady && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      OCL = await globalThis.UsefulVerseChemicalEngineReady;
      if (!OCL) throw new Error('Local chemistry runtime is unavailable.');
      molecule = createChemicalMolecule(OCL);
      selection = { type: 'atom', index: 0 };
      render();
      status.textContent = copy.messages.ready;
    } catch {
      status.textContent = copy.messages.engineFailed;
      status.classList.add('status--error');
    }
  };

  canvas.addEventListener('click', (event) => {
    const hit = event.target.closest('[id]');
    const match = hit?.id.match(/:(Atom|Bond):(\d+)$/u);
    if (!match) return;
    selection = { type: match[1].toLowerCase(), index: Number(match[2]) };
    render();
  });
  canvas.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key) || !event.target.matches('.event[tabindex="0"]')) return;
    event.preventDefault();
    event.target.click();
  });

  root.querySelector('[data-chem-add-atom]').addEventListener('click', () => applyEdit(() => {
    const atomicNo = Number(element.value);
    const index = molecule.addAtom(atomicNo);
    if (selection?.type === 'atom') molecule.addBond(selection.index, index);
    selection = { type: 'atom', index };
  }));
  root.querySelector('[data-chem-set-bond]').addEventListener('click', () => applyEdit(() => {
    if (selection?.type !== 'bond') throw new Error('Select a bond first.');
    const first = molecule.getBondAtom(0, selection.index);
    const second = molecule.getBondAtom(1, selection.index);
    molecule.addOrChangeBond(first, second, Number(bondOrder.value));
  }));
  root.querySelector('[data-chem-add-ring]').addEventListener('click', () => applyEdit(() => {
    const size = Number(root.querySelector('[data-chem-ring-size]').value);
    const bondLength = OCL.Molecule.getDefaultAverageBondLength();
    if (selection?.type !== 'atom') {
      const currentBondLength = molecule.getAverageBondLength();
      if (currentBondLength > 0) molecule.scaleCoords(bondLength / currentBondLength);
    }
    const ok = selection?.type === 'atom'
      ? molecule.addRingToAtom(selection.index, size, root.querySelector('[data-chem-aromatic]').checked, bondLength)
      : molecule.addRing(Math.max(...Array.from({ length: molecule.getAllAtoms() }, (_, atom) => molecule.getAtomX(atom))) + bondLength * 2, 0, size, root.querySelector('[data-chem-aromatic]').checked, bondLength);
    if (!ok) throw new Error('Could not add this ring.');
    selection = undefined;
  }));
  deleteButton.addEventListener('click', () => applyEdit(() => {
    if (selection?.type === 'atom') molecule.deleteAtom(selection.index);
    else if (selection?.type === 'bond') molecule.deleteBond(selection.index);
    selection = undefined;
  }));
  undoButton.addEventListener('click', () => {
    const previous = undo.pop();
    if (!previous) return;
    try { molecule = parseChemicalStructure(OCL, previous, 'molfile'); selection = undefined; render(); announce(root, copy.messages.undone, 'success'); }
    catch { announce(root, copy.messages.invalidEdit, 'error'); }
  });
  root.querySelector('[data-chem-import]').addEventListener('click', () => {
    try { molecule = parseChemicalStructure(OCL, source.value, sourceFormat.value); undo.length = 0; selection = undefined; render(); announce(root, copy.messages.imported, 'success'); }
    catch { announce(root, copy.messages.invalidStructure, 'error'); }
  });
  root.querySelector('[data-chem-new]').addEventListener('click', () => {
    molecule = createChemicalMolecule(OCL); undo.length = 0; selection = { type: 'atom', index: 0 }; render(); announce(root, copy.messages.newStructure, 'success');
  });
  root.querySelector('[data-chem-copy]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(smiles.value); announce(root, copy.messages.copied, 'success'); }
    catch { smiles.focus(); smiles.select(); announce(root, copy.messages.copyFallback, 'error'); }
  });
  root.querySelector('[data-chem-download]').addEventListener('click', () => {
    if (!molecule) return;
    const blob = new Blob([molecule.toMolfile()], { type: 'chemical/x-mdl-molfile;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'structure.mol'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  form.addEventListener('submit', (event) => event.preventDefault());
  start();
}
