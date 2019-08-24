const metaTagRules = [
    {
        name: "title",
        property: [{
            type: "length",
            minContentLength: 10,
            maxContentLength: 60,
            score: 0.5,
        },
            {
                type: "required",
                value: true,
                score: 1,
            },
            {
                type: "duplicate",
                score: 0.5
            }
        ]
    },
    {
        name: "description",
        property: [{
            type: "length",
            minContentLength: 10,
            maxContentLength: 160,
            score: 0.5,
        },
            {
                type: "required",
                value: true,
                score: 1,
            },
            {
                type: "duplicate",
                score: 0.5
            }
        ]
    },
    {
        name: "canonical",
        property: [
            {
                type: "required",
                value: true,
                score: 1,
            },
        ]
    },
    {
        name: "language",
        property: [
            {
                type: "required",
                value: true,
                score: 1,
            },
        ]
    },
    {
        name: "alternate",
        property: [
            {
                type: "required",
                value: false,
                score: 1,
            },
        ]
    },
    {
        name: "contentType",
        property: [
            {
                type: "required",
                value: true,
                score: 1,
            },
        ]
    },
    {
        name: "favicon",
        property: [
            {
                type: "required",
                value: true,
                score: 1,
            },
        ]
    },
];


module.exports = {
    metaTagRules: metaTagRules
};