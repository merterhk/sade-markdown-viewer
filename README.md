# Sade Markdown Görüntüleyici

Firefox'ta `.md` ve `.markdown` dosyalarını temiz, okunaklı bir sayfa olarak gösteren küçük bir eklenti. Derleme ve bağımlılık gerektirmez.

## Kurulum

1. Firefox'ta `about:debugging#/runtime/this-firefox` adresini açın.
2. **Geçici Eklenti Yükle** düğmesine basın.
3. Bu klasördeki `manifest.json` dosyasını seçin.
4. Yerel dosyalar için eklentinin ayrıntılarından **Dosya URL'lerine erişim** iznini açın.

Bir `.md` dosyasını Firefox'a sürükleyip bırakın. Sağ üstteki düğme tema sırasını **Sistem → Açık → Koyu** olarak değiştirir ve seçimi hatırlar.

## Desteklenen sözdizimi

Başlıklar, paragraflar, kalın/italik/üstü çizili metin, bağlantılar, uzak görseller, sıralı ve sırasız listeler, alıntılar, yatay çizgiler, satır içi kod ve çitli kod blokları.

## Mağaza paketi

Mozilla'nın `web-ext` aracıyla doğrulamak ve paketlemek için:

```sh
web-ext lint
web-ext build --overwrite-dest
```

Oluşan ZIP dosyası `web-ext-artifacts` klasörüne yazılır. Mağaza açıklaması ve gizlilik metni `STORE-LISTING.md` dosyasındadır.
