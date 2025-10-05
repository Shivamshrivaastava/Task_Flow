import { useEffect } from "react";
import { translateText } from "../lib/translateText";

export function useAutoTranslate(texts, setTranslatedTexts, language) {
  useEffect(() => {
    async function runTranslation() {
      if (!texts || texts.length === 0) return;
      const translated = await Promise.all(
        texts.map((t) => translateText(t, language))
      );
      setTranslatedTexts(translated);
    }
    runTranslation();
  }, [texts, language, setTranslatedTexts]);
}
