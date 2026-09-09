
function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/icar/g, "car");
}

function findFAQ(userText) {

    const normalizedUserText =
        normalizeText(userText);

    let bestMatch = null;
    let bestScore = 0;

    FAQS.forEach(faq => {

        let score = 0;

        faq.keywords.forEach(keyword => {

            const normalizedKeyword =
                normalizeText(keyword);

            if (
                normalizedUserText.includes(
                    normalizedKeyword
                )
            ) {
                score++;
            }

        });

        if (score > bestScore) {
            bestScore = score;
            bestMatch = faq;
        }

    });

    return bestScore > 0
        ? bestMatch
        : null;
}
