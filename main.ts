import * as fs from 'fs';
import lexer from './modules/lexer';
import parser from './modules/parser';
import * as jci from './modules/JinCodeInterfaces';

// Global variables
let suppliedFileName = "";

/**
 * Prints the help text to the terminal
 * @param exitCode The code to use when exiting the program
 */
function printHelp(exitCode: number = 0){
    console.log(`
    ======================== JinCode Transpiler ========================
    Usage: main.js [-h] <input-file> [-o] [output-file]

    -h, --help      Displays this help message
    -o, --output    Specifies an output file. The exstension is 
                    automatically .js
    
    Examples:
        # Runs the transpiler on a file called script.jc and outputs the 
        # result in a file called script.js
        main.js script.jc

        # Runs the transpiler on a file called script.jc and outputs it 
        # as a file called output-file.js
        main.js script.jc -o output-file.js
    ====================================================================
    `);

    process.exit(exitCode);
}

/**
 * Proccesses all arguments supplied to the transpiler
 */
function proccessArguments(){
    if(process.argv.length === 2) printHelp(1);

    if(process.argv[2] === "-h" || process.argv[2] === "--help"){
        printHelp();
    }

    if(process.argv.length > 3){
        if(process.argv[3] === "-h" || process.argv[3] === "--help"){
            printHelp();
        }


        if(process.argv[3] === "-o" || process.argv[3] === "--output"){
            suppliedFileName = process.argv[4].split(".")[0];
        }
    }
}

/**
 * Read JinCode from supplied file and remove all line breaks
 * @returns the code read from the file as well as the filename
 */
function getCode(): jci.Code{
    // Get code
    let contents: string = fs.readFileSync(process.argv[2], {encoding: "utf-8"});
    contents = contents.replace(/\r?\n|\r/g, " ").trim();
    
    // Return supplied file name if there is one
    if(suppliedFileName) return {code: contents, fileName: suppliedFileName};

    // Get filename
    const splitFileName = process.argv[2].replace(/\\/g, "/").split("/");
    const fileName = suppliedFileName || splitFileName[splitFileName.length - 1].split(".")[0];

    return {code: contents, fileName: fileName};
}

/**
 * Runs the transpiler
 */
function main(){
    proccessArguments();
    const code: jci.Code = getCode();

    const result: Array<string> = lexer(code.code);
    parser(result, code.fileName);
}

main();