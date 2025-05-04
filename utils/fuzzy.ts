function normalize(text: String): String {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokenize(text: String): String[] {
    return normalize(text).split(/\s+/);
}

function jaccardSimilarity(a: String[], b: String[]): number {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set();
    const union = new Set(setA);

    setA.forEach(item => {
        if (setB.has(item)) {
            intersection.add(item);
        }
    });

    setB.forEach(item => {
        union.add(item);
    });

    return intersection.size / union.size;
}

function prefixScore(queryTokens: String[], choiceTokens: String[]): number {
    for (let i = 0; i < queryTokens.length; i++) {
        if (choiceTokens[i] !== queryTokens[i]) return 0;
    }
    return queryTokens.length / choiceTokens.length;
}

export function search(query: String, choices: String[]): String | null {
    const qTokens = tokenize(query);

    let best: String | null = null;
    let bestScore = -1;

    for (const choice of choices) {
        const cTokens = tokenize(choice);
        const jaccard = jaccardSimilarity(qTokens, cTokens);
        const prefix = prefixScore(qTokens, cTokens);
        const totalScore = jaccard * 0.9 + prefix * 0.1;

        if (totalScore > bestScore) {
            bestScore = totalScore;
            best = choice;
        }
    }

    return best;
}

export function commonTokens(names: string[]): string {
    if (names.length === 0) return "vague";

    const tokenLists = names.map(name =>
        name
            .split(/\s+/)
            .filter(Boolean)
    );

    const freq: Record<string, number> = {};
    tokenLists.forEach(tokens => {
        new Set(tokens.map(tok => tok.toLowerCase().replace(/[:.\-–—'"]/g, ""))).forEach(tok => {
            freq[tok] = (freq[tok] || 0) + 1;
        });
    });

    const threshold = Math.ceil(tokenLists.length / 2);
    const baseOrder = tokenLists[0];
    const common = baseOrder.filter(tok =>
        freq[tok.toLowerCase().replace(/[:.\-–—'"]/g, "")] >= threshold
    );

    if (common.length === 0) {
        console.log("No common tokens found, returning vague");
        return "vague";
    }

    if (common.length === 1) {
        return common[0];
    }

    const commonStr = common.join(" ");

    if (commonStr.trim().length < 3) {
        console.log("Ambiguous result, returning vague");
        return "vague";
    }

    return commonStr;
}