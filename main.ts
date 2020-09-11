import * as fs from 'fs';
import lexer from './modules/lexer';
import parser from './modules/parser';
import * as jci from './modules/JinCodeInterfaces';

/**
 * Read JinCode from supplied file and remove all line breaks
 * @returns the code read from the file
 */
function getCode(): jci.Code{
    // Get code
    let contents: string = fs.readFileSync(process.argv[2], {encoding: "utf-8"});
    contents = contents.replace(/\r?\n|\r/g, " ").trim();
    
    // Get filename
    const splitFileName = process.argv[2].replace(/\\/g, "/").split("/");
    const fileName = splitFileName[splitFileName.length - 1].split(".")[0];

    return {code: contents, fileName: fileName};
}

/**
 * Runs the transpiler
 */
function main(){
    const code: jci.Code = getCode();

    const result: Array<string> = lexer(code.code);
    parser(result, code.fileName);
}

main();