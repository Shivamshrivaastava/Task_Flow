export async function translateText(text, targetLang) {
  try {
    if (!text) return "";

    // Detect correct source language dynamically
    const sourceLang = targetLang === "hi" ? "en" : "hi";

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    // Extract translated text
    return data?.[0]?.[0]?.[0] || text;
  } catch (err) {
    console.error("⚠️ Google Translate API error:", err);
    return text;
  }
}
