let crawler = require('./checker.js');
const fs = require('fs');
const rules = require('./rules');

const scoreArray = [];

let finalScore = 0;
const stopWords = ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount", "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as", "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the", "-", ".", "!", "?", "#", "@", "&"];

let page = crawler.load('https://www.mantralabsglobal.com', function(response) {
    // check for meta tag rules
    let metaTagsArray = crawler.meta(response);
    let body = metaTagsArray.body;
    for(const meta of rules.metaTagRules){
        let reasonP = [];
        let reasonN = [];
        let score = 0;
        let totalScore = 0;
        for(let property of meta.property){
            let scoreProperty = property.score ? property.score : 0;
            totalScore = totalScore + scoreProperty;
            if(property.type == "required"){
                if(property.value === true){
                    if(metaTagsArray[meta.name] != null && metaTagsArray[meta.name].length > 0) {
                        score = score + scoreProperty;
                        reasonP.push(`${meta.name} exist. OK`);
                    }else{
                        score = score - scoreProperty;
                        reasonN.push(`${meta.name} should exist but not in your website. KO`);
                    }
                }else{
                    if(metaTagsArray[meta.name] != null && metaTagsArray[meta.name].length > 0) {
                        score = score + scoreProperty;
                        reasonN.push(`${meta.name} should not exist, but found in your website. KO`);
                    }else{
                        score = score + scoreProperty;
                        reasonP.push(`${meta.name} should not exist and not found in your website. OK`);
                    }
                }

            }
            else if(property.type == "length"){
                if(metaTagsArray[meta.name].length >= property.minContentLength && metaTagsArray[meta.name].length <= property.maxContentLength){
                    score = score + scoreProperty;
                    reasonP.push(`${meta.name} contains ~ ${property.minContentLength} - ${property.maxContentLength} characters. OK`);
                }else{
                    score = score - scoreProperty;
                    reasonN.push(`${meta.name} should contains ~ ${property.minContentLength} - ${property.maxContentLength} characters. KO`);
                }
            }
            else if(property.type == "duplicate"){
                let isDuplicate = isContainsDuplicate(metaTagsArray[meta.name]);
                if(isDuplicate[0] === true){
                    score = score - scoreProperty;
                    reasonN.push(`${meta.name} contains duplicate words. KO`);
                }else{
                    score = score + scoreProperty;
                    reasonP.push(`${meta.name} does not contains any duplicate words. OK`);
                }
            }
        }
        scoreArray.push({
            score: score,
            totalScore: totalScore,
            name: meta.name,
            value: metaTagsArray[meta.name] ? metaTagsArray[meta.name] : "",
            reasonPositive: reasonP,
            reasonNegative: reasonN
        })
    }

    let parseBody = crawler.body(body);
    console.log(parseBody);

    console.log(scoreArray);
    // calculate final score
    let combinedScore = 0;
    let combinedTotalScore = 0;
    for(let score of scoreArray){
        combinedScore = combinedScore + score.score;
        combinedTotalScore = combinedTotalScore + score.totalScore;
    }

    finalScore = ((combinedScore / combinedTotalScore) * 100).toFixed(2);

    console.log(finalScore);

});

function isContainsDuplicate(string) {
    let splitedString = string.trim().split(" ");
    let isContainsDuplicate = false;
    let duplicateWords = [];
    for(let s of splitedString){
        if(!stopWords.includes(s.toLowerCase())) {
            let re = new RegExp(s, 'gi');
            let len = string.match(re).length;
            if(len > 1){
                isContainsDuplicate = true;
                duplicateWords.push(s);
            }
        }
    }
    return [isContainsDuplicate, duplicateWords];
}