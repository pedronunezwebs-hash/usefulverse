export const vocalRemoverEnglish = Object.freeze({
  name: 'Local Vocal and Accompaniment Separator',
  title: 'Vocal Remover — Separate Vocals and Accompaniment Locally',
  description: 'Separate a short stereo audio sample into estimated vocals and accompaniment in your browser. Audio stays on your device; the model is downloaded from its public host.',
  intro: 'Choose a stereo music clip up to 30 seconds. On first use, the browser downloads a 35.6 MB model. The audio file is processed on this device and is never uploaded.',
  exampleHeading: 'What you get', example: 'Preview and download two WAV stems: estimated vocals and the residual accompaniment. Results depend on the mix and may contain artifacts.',
  howItWorks: 'Local processing', details: 'The tool uses the Open-Unmix UMX-HQ vocals network exported to ONNX and ONNX Runtime Web. The model is fetched only when you press Separate; no paid inference API or subscription is used. Audio is decoded, processed and exported locally.',
  faqHeading: 'Questions', limitsHeading: 'Scope and limitations', related: 'Related tools',
  limits: 'This is an estimate for stereo 44.1 kHz processing and clips up to 30 seconds. Mono sources are duplicated to stereo. Vocals mixed deeply into instruments, heavy effects, live recordings and unusual genres can produce leakage or artifacts. Do not use the result as a clean master. Model download requires an internet connection; audio does not leave this device.',
  faq: [
    { q: 'Is my audio uploaded?', a: 'No. The selected audio is decoded and processed in your browser. The only network request is the model download when you start separation.' },
    { q: 'Why is the first run slow?', a: 'The browser downloads a 35.6 MB model once; the browser may cache it. Inference then runs locally on the device CPU.' },
    { q: 'Will every song separate cleanly?', a: 'No. The model estimates a vocal stem and may leave vocal leakage, remove instrument harmonics or create artifacts. Listen before relying on a stem.' },
  ],
  fields: { file:'Stereo audio file (up to 30 seconds)', select:'Choose audio', separate:'Separate vocals', cancel:'Cancel / clear', ready:'Choose a short audio file to begin.', downloading:'Downloading the separation model…', processing:'Separating locally…', complete:'Separation complete. Preview or download either stem.', failed:'Could not process this file or load the model. Check the format and connection, then try again.', source:'Model and weight license information', vocals:'Estimated vocals', accompaniment:'Estimated accompaniment', download:'Download WAV', play:'Preview', progress:'Progress' },
  messages: { ready:'Choose a short audio file to begin.', running:'Preparing local separation…', done:'Separation complete. Audio remained on this device.', invalid:'This audio could not be processed. Try a stereo music file under 30 seconds.' },
});
