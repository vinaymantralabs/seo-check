const stopWords = ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount", "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as", "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the", "-", ".", "!", "?", "#", "@", "&"];

function checkPageContent(body, url, metaTagsArray) {
    let bodySplit = body.split(' ');
    let pageLength = bodySplit.length;
    let pageContentScore = 0, pageContentTotalScore = 0, pageContentResponseP = [], pageContentResponseN = [];
    if(pageLength > 600 && pageLength < 1000){
        pageContentScore++;
        pageContentTotalScore++;
        pageContentResponseP.push(`Page length is ${pageLength}. OK`);
    }else{
        pageContentScore--;
        pageContentTotalScore++;
        pageContentResponseN.push(`Page length is ${pageLength}, must be ~ 600 - 1000. KO`);
    }

    // number of stop words
    let numberOfStopWords = countStopWords(bodySplit);
    if(numberOfStopWords <= 30){
        pageContentScore++;
        pageContentTotalScore++;
        pageContentResponseP.push(`${numberOfStopWords}% of text are stop words. OK`);
    }else{
        pageContentScore--;
        pageContentTotalScore++;
        pageContentResponseN.push(`${numberOfStopWords}% of text are stop words, must be ~ 30%. KO`);
    }

    // number of headings
    if(metaTagsArray.totalHeadings < 50){
        pageContentScore++;
        pageContentTotalScore++;
        pageContentResponseP.push(`There are ${metaTagsArray.totalHeadings} headings. OK`);
    }else{
        pageContentScore--;
        pageContentTotalScore++;
        pageContentResponseN.push(`There are ${metaTagsArray.totalHeadings} headings, expected less. KO`);
    }

    // image seo
    if((metaTagsArray.imgAccessibility).toFixed(2) < 50){
        pageContentScore++;
        pageContentTotalScore++;
        pageContentResponseP.push(`There are ${(metaTagsArray.imgAccessibility).toFixed(2)}% images with alt attribute headings. OK`);
    }else{
        pageContentScore--;
        pageContentTotalScore++;
        pageContentResponseN.push(`There are ${(metaTagsArray.imgAccessibility).toFixed(2)}% images with no alt attribute headings. KO`);
    }

    return {
        score: pageContentScore,
        totalScore: pageContentTotalScore,
        name: "Page Content",
        value: "",
        reasonPositive: pageContentResponseP,
        reasonNegative: pageContentResponseN
    };
};

function countStopWords(words) {
    let count = 0;
    let wordLength = words.length;
    for(let i=0; i < words.length; i++) {
        if(!stopWords.includes(words[i])) {
            count++;
        }
    }

    return ((count / wordLength) * 100).toFixed(2);
}

module.exports = {
    checkPageContent : checkPageContent
};