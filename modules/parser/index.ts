import * as fs from 'fs';
import * as jce from '../JinCodeEnums';

/**
 * Parse the tokens and output a JavaScript file
 * @param tokens A list of tokens to parse
 * @param fileName The name of the file to use when outputting the transpiled code
 */
export default function parser(tokens: Array<string>, fileName: string): void{
    let finalCode = ""; // The final JavaScript code to output to file

    for(let i = 0; i < tokens.length; i++){
        switch(tokens[i]){
            case jce.functions.PRINT:
                finalCode += "console.log";
                break;
            case jce.syntax.OPEN_PARENTHESIS:
                finalCode += "(";
                break;
            case jce.syntax.CLOSED_PARENTHESIS:
                finalCode += ")";
                break;
            case jce.strings.QOUTE:
                finalCode += "\"";
                break;
            case jce.syntax.END_LINE:
                finalCode += ";\n";
                break;
            case jce.strings.STRING:
                finalCode += tokens[i+1];
                break;
            default:
                break;
        }
    }

    finalCode = finalCode.replace(/(\r?\n|\r)$/g, " ").trimEnd();
    fs.writeFile(`${fileName}.js`, finalCode, {encoding: "utf-8"}, err => {
        if(err) throw err;
        console.log(`Written to ${fileName}.js`);
    });
}