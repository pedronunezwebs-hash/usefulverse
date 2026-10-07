Third-party components for the UsefulVerse image upscaler

Model weights: `Xenova/swin2SR-lightweight-x2-64`, pinned to Hugging Face revision `92a21aca5713f20faf9a87590cdfbdce2e34112c`; the upstream model is the lightweight 2× Swin2SR model from `caidas/swin2SR-lightweight-x2-64`, whose model card states Apache-2.0. The quantized ONNX file is `onnx/model_q4.onnx` (SHA-256 `b75c09757a7159f32ad279919a77fb185c3389676674cf226a467eaf2f7928f1`). See `LICENSE-APACHE-2.0.txt` and the pinned model card at https://huggingface.co/Xenova/swin2SR-lightweight-x2-64/tree/92a21aca5713f20faf9a87590cdfbdce2e34112c.

Runtime bundle: Transformers.js 4.3.0, Apache-2.0; ONNX Runtime Web, MIT. License texts are distributed in the `licenses/upscaler/` assets. The source worker uses the runtime locally; no inference service is used.
