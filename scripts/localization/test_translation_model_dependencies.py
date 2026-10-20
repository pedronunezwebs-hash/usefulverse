"""Real compatibility regressions, run before downloading model weights on Actions."""
import os
import unittest


@unittest.skipUnless(os.environ.get('PILOT_ENGINE'), 'Model dependencies are installed only in the dedicated Actions pilot')
class ModelDependencyTest(unittest.TestCase):
    def test_language_detector_can_load_its_numpy_binary_model(self):
        import langid
        language, score = langid.classify('These files stay on your device and are never uploaded.')
        self.assertEqual(language, 'en')
        self.assertIsInstance(float(score), float)

    def test_pinned_converters_and_tokenizers_import_on_the_configured_python(self):
        import torch
        from ctranslate2.converters import TransformersConverter
        from transformers import M2M100Tokenizer, T5Tokenizer
        self.assertIsNone(torch.version.cuda, 'The pilot must use CPU-only PyTorch')
        self.assertTrue(all(callable(value) for value in (TransformersConverter, M2M100Tokenizer, T5Tokenizer)))


if __name__ == '__main__': unittest.main()
