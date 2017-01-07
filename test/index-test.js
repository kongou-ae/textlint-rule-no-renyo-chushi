"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../src/index");
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        // no problem
        "傷口を消毒して、清潔にした。"
    ],
    invalid: [
        // single match
        {
            text: "傷口を消毒し、清潔にした。",
            errors: [
                {
                    message: "連用中止形が使われています。: し、",
                    line: 1,
                    column: 6
                }
            ]
        },
        // multiple match
        {
            text: `服を洗濯機に入れ、ご飯を食べ、部屋を掃除した`,
            errors: [
                {
                    message: "連用中止形が使われています。: 入れ、",
                    line: 1,
                    column: 7
                },
                {
                    message: "連用中止形が使われています。: 食べ、",
                    line: 1,
                    column: 13
                }
            ]
        },

    ]
});