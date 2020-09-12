import * as fs from 'fs';
import lexer from './modules/lexer';
import parser from './modules/parser';
import * as jci from './modules/JinCodeInterfaces';

// Global variables
let suppliedFileName = "";
let debug = "none";

/**
 * Prints the help text to the terminal
 * @param exitCode The code to use when exiting the program
 */
function printHelp(exitCode: number = 0){
    console.log(`
    ======================== JinCode Transpiler ========================
    Usage: main.js [-h] <input-file> [-o] [output-file]

    -h, --help          Displays this help message
    -o, --output        Specifies an output file. The exstension is 
                        automatically .js
    -d, --debug [full]  Displays debug information. If the string "full"
                        is passed directly after it, it will show more
                        debug information than otherwise
    
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
 * Processes all arguments supplied to the transpiler
 */
function processArguments(){
    // If no file to transpile was supplied, print the help and exit with an error
    if(process.argv.length === 2) printHelp(1);

    // Print the help if the user requested it and supplied no file to transpile
    if(process.argv[2] === "-h" || process.argv[2] === "--help"){
        printHelp();
    }

    // Check if there's more than three arguments passed to the script
    if(process.argv.length > 3){
        // Print the help menu
        if(process.argv[3] === "-h" || process.argv[3] === "--help"){
            printHelp();
        }

        // Allow the user to specify a file name
        if(process.argv[3] === "-o" || process.argv[3] === "--output"){
            suppliedFileName = process.argv[4].split(".")[0];
        }
    }

    // Look through the arugments to see if the user ever wished to run the
    // transpiler in debug mode, and if so, check if he wanted full or
    // minimalized output.
    process.argv.forEach(arg => {
        if(arg === "-d" || arg === "--debug"){
            if(process.argv[process.argv.indexOf(arg, 1) + 1] === "full"){
                debug = "full";
            } else {
                debug = "min";
            }
        }
    });
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
    processArguments();
    const code: jci.Code = getCode();

    const result: Array<string> = lexer(code.code, debug);
    parser(result, code.fileName, debug);
}

main();