"use strict";
import {split} from "sentence-splitter";
import {getTokenizer} from "kuromojin";

module.exports = function(context, options = {}) {
    const {Syntax, RuleError, report, getSource} = context;
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const sentences = split(text);

            const checkRenyo = (a,b) => {

                const errorPattern = [];
                const token1 = {};
                token1.pos = '動詞';
                token1.pos_detail_1 = '自立';
                token1.conjugated_form = '連用形';
                errorPattern.push(token1);

                const token2 = {};
                token2.surface_form = '、';
                token2.pos = '名詞';
                errorPattern.push(token2);
                
                const target = [];
                const aToken1 = {};
                aToken1.pos = a.pos;
                aToken1.pos_detail_1 = a.pos_detail_1;
                aToken1.conjugated_form = a.conjugated_form;
                target.push(aToken1);
                
                const bToken2 = {};
                bToken2.surface_form = b.surface_form;
                bToken2.pos = b.pos;
                target.push(bToken2);
                
                if (JSON.stringify(errorPattern) === JSON.stringify(target)){
                    return true;
                } else {
                    return false;
                }
                
            };

            return getTokenizer().then(tokenizer => {
                sentences.forEach(function (sentence,i) {
                    const tokens = tokenizer.tokenizeForSentence(sentence.raw);

                        tokens.forEach(function(token,j) {
                            //　対象のtokenが文末でなければ確認する 
                            if ( j < tokens.length - 1 ){
                                const result = checkRenyo(tokens[j],tokens[j+1]);
                                
                                if ( result === true ){
                                    const regex = new RegExp(tokens[j].surface_form + tokens[j+1].surface_form, 'g');
                                    const indexOfError = regex.exec(text);
                                    const ruleError = new RuleError("連用中止形が使われています。: " + tokens[j].surface_form + tokens[j+1].surface_form, {
                                        index: indexOfError.index// padding of index
                                    });
                                    report(node, ruleError);
                                }
                            }
                        });
                });
            });
        }
    };
};
