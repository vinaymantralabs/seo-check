let crawler = require('./checker.js');
const fs = require('fs');
const rules = require('./rules');

const scoreArray = [];

let finalScore = 0;

let page = crawler.load('https://www.mantralabsglobal.com', function(response) {
    // check for meta tag rules
    let metaTagsArray = crawler.meta(response);
    for(const meta of rules.metaTabRules){
        let scoreForExist = meta.scoreForExist ? meta.scoreForExist : 0;
        let scoreForValid = meta.scoreForValid ? meta.scoreForValid : 0;
        let scoreForDuplicate = meta.scoreForDuplicate ? meta.scoreForDuplicate : 0;
        let score = 0;
        let totalScore = scoreForExist +scoreForValid + scoreForDuplicate;
        let reasonP = [];
        let reasonN = [];
        if (meta.required) {
            if(metaTagsArray[meta.name].length > 0) {
                score = score + scoreForExist;
                reasonP.push(`${meta.name} exist. OK`);

                if(metaTagsArray[meta.name].length >= meta.minContentLength && metaTagsArray[meta.name].length <= meta.maxContentLength){
                    score = score + scoreForValid;
                    reasonP.push(`${meta.name} contains ~ ${meta.minContentLength} - ${meta.maxContentLength} characters. OK`);
                }else{
                    score = score - scoreForValid;
                    reasonN.push(`${meta.name} should contains ~ ${meta.minContentLength} - ${meta.maxContentLength} characters. KO`);
                }

                if(meta.checkDuplicateWords){
                    let isDuplicate = isContainsDuplicate(metaTagsArray[meta.name]);
                    if(isDuplicate[0] === true){
                        score = score - scoreForDuplicate;
                        reasonN.push(`${meta.name} contains duplicate words. KO`);
                    }else{
                        score = score + scoreForDuplicate;
                        reasonP.push(`${meta.name} does not contains any duplicate words. OK`);
                    }
                }
            }else{
                score = score - scoreForExist;
                reasonN.push(`${meta.name} should exist but not in your website. KO`);
            }
        } else {
            if(metaTagsArray[meta.name].length > 0) {
                score = score - totalScore;
                reasonN.push(`${meta.name} should not exist, but found in your website. KO`);
            }else{
                score = score + totalScore;
                reasonP.push(`${meta.name} should not exist and not found in your website. OK`);
            }
        }

        scoreArray.push({
            score: score,
            totalScore: totalScore,
            tag: "meta",
            name: meta.name,
            value: metaTagsArray[meta.name] ? metaTagsArray[meta.name] : "",
            reasonPositive: reasonP,
            reasonNegative: reasonN
        })

    }

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
    let exceptWords = ["an", "the", "is", "in", "to", "am", "are", "was", "were", "has", "have", "-", ".", "!", "?", "#", "@", "&"];
    let isContainsDuplicate = false;
    let duplicateWords = [];
    for(let s of splitedString){
        if(!exceptWords.includes(s.toLowerCase())) {
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