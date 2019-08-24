const metaTabRules = [{
    name: "description",
    minContentLength: 10,
    maxContentLength: 160,
    required: true,
    checkDuplicateWords: true,
    scoreForExist: 1,
    scoreForValid: 0.5,
    scoreForDuplicate: 0.5

}, {
    name: "title",
    minContentLength: 10,
    maxContentLength : 60,
    required: true,
    checkDuplicateWords: true,
    scoreForExist: 1,
    scoreForValid: 0.5,
    scoreForDuplicate: 0.5
}, {
    name: "title",
    minContentLength: 10,
    maxContentLength : 60,
    required: true,
    checkDuplicateWords: true,
    scoreForExist: 1,
    scoreForValid: 0.5,
    scoreForDuplicate: 0.5
}];

module.exports = {
    metaTabRules: metaTabRules
};