# UsefulVerse · Türkçe (tr-TR) · Terim ve yerelleştirme rehberi

Türkçe arayüz ve Türkiye pazarı için tek tercihli terimleri, biçimleri ve ürün sınırlarını kaydeder. Arama sonuçları nitel araştırmadır; bu rehber **arama hacmi iddiası değildir**. DataForSEO veya ücretli API kullanılmadı.

## Kararlar

| Alan | Tercih |
|---|---|
| Dil etiketi ve yol | `tr-TR`, `/tr/` |
| Hitap ve ton | Kısa, nazik, yalın; kullanıcıya `siz` biçiminde hitap edilir. |
| Ana ürün terimi | `araç`; işlemlerde `dönüştür`, hesaplamalarda `hesapla`, sonuç için `sonuç`. |
| Kelime aracı | `Kelime Sayacı`; yardımcı varyant `kelime ve karakter sayacı`. |
| Yüzde aracı | `Yüzde Hesaplama`; `yüzde hesaplama` ve `yüzde hesap makinesi` doğal arama varyantlarıdır. |
| QR aracı | `QR Kod Oluşturucu`; kısa metin/bağlantıdan siyah-beyaz PNG üretir. |
| JSON aracı | `JSON Biçimlendirici`; `JSON` ve `online` terimleri teknik aramalarda korunur. |
| Şifre | Arayüzde `şifre`; açıklamada gerekirse `parola` eş anlamlısı bir kez kullanılabilir. |
| URL parçası | SEO terimi `slug`; açıklamada ilk kullanımda `URL kısa adı` ile anlatılır. |
| Ondalık / binlik | Virgül ondalık, nokta binlik: `1.234.567,5`. |
| Sayıyla yazım | `sıfır`, `bir`, `yüz`, `bin`, `milyon`, `milyar`; eksi değer `eksi`; en çok 999.999.999.999. |
| Tarih ve saat | `tr-TR` Intl biçimi; saat dilimleri `Europe/Istanbul` → `America/New_York`. |

## Arama gözlemleri

29 Eylül 2026 tarihli, hacim iddiası taşımayan SERP kontrolünde yerel araç adlarında `yüzde hesaplama`, `kelime sayacı`, `QR kod oluşturucu`, `şifre oluşturucu`, `JSON biçimlendirici` ve `online araçlar` kullanımları görünüyordu. Kopya bu doğal adları kapsar; her sayfanın amacı ayrı tutulur ve aracın yapmadığı özellikler vaat edilmez.

## Ürün sınırları

- Kelime ve karakter sayacı okuma süresini yaklaşık gösterir.
- Base64 kodlamadır, şifreleme değildir.
- JWT aracı yalnızca başlık ve yükü çözer; imzayı doğrulamaz.
- Zaman aracı iş saati, mola veya resmî tatilleri düşmez.
- CSV dönüştürücüde veri ayırıcı virgüldür; Türkçe Excel noktalı virgül çıktısını otomatik algıladığı iddia edilmez.
- Birim dönüştürücü yaygın uzunluk, ağırlık, sıcaklık ve hacim birimleriyle sınırlıdır.
- QR kod yalnızca siyah-beyazdır ve en fazla 106 baytlık içerik alır.

## Kaynaklar

- SERP terminoloji örnekleri: [Sentos yüzde hesaplama](https://www.sentos.com.tr/yuzde-hesaplama/), [PratikAraç](https://pratikarac.com/), [Webfinity kelime sayacı](https://webfinity.com.tr/araclar/kelime-sayaci), [FlyUtils Türkçe araçlar](https://flyutils.com/tr), [Melih Bilge hesap makinesi](https://www.melihbilge.com.tr/araclar/hesap-makinesi). Kontrol tarihi: 29 Eylül 2026.
- Sayı yazımı, yerel biçimler ve özellik sınırları ayrıca uygulamanın gerçek koduna göre doğrulanır; arama sonuçları hacim, rekabet veya sıralama tahmini olarak yorumlanmaz.
