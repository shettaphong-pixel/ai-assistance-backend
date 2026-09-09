import FAQS from "./faq.js";

export function findFAQ(question) {
  const text = question.toLowerCase().trim();

  return FAQS.find(faq =>
    faq.keywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    )
  );
}
