# Vietnamese (Vietnam)

- Locale: Vietnamese for a broad Vietnamese-reading audience; HTML language tag `vi-VN`, site path `/vi/`.
- Use clear, contemporary Vietnamese and address the visitor politely with “bạn”. Prefer familiar task words over literal English UI translations.
- Preserve standard developer terms and acronyms where Vietnamese users commonly recognize them: JSON, CSV, URL, Base64, UUID, JWT, SHA-256, HEX, RGB, HSL, QR, SEO and UTC.
- Use Vietnamese search phrasing naturally in titles, descriptions, intros and FAQs (for example “tính phần trăm online”, “công cụ tạo mã QR”, “đổi số thành chữ”, “chuyển CSV sang JSON”). These are localization targets, not claims of search volume or ranking.
- Display numbers with Vietnamese formatting (`Intl.NumberFormat('vi-VN')`); numeric inputs use the standard decimal point.
- Use Vietnamese cardinal number words and the nghìn/triệu/tỷ scales in `runtime.js`; the converter accepts integers from −999,999,999,999 to 999,999,999,999.
- All 33 tool pages have matching Vietnamese copy, metadata and useful FAQs. Avoid promising that every operation is private unless it actually runs locally; descriptions reflect the browser-only implementation.
- QR output stays black and white for scan reliability.
