import OCL from '/assets/openchemlib-9.25.1/openchemlib.mjs';

globalThis.UsefulVerseChemicalEngineReady = OCL.Resources.registerFromUrl('/assets/openchemlib-9.25.1/resources.json')
  .then(() => { globalThis.UsefulVerseChemicalEngine = OCL; return OCL; });
