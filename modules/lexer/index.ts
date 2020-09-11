import * as jce from '../JinCodeEnums';

/**
 * Goes through JinCode code and finds all tokens and stores them in an array
 * @param code The code to go through
 * @returns the array of found tokens
 */
export default function lexer(code: string): Array<string>{
    const length = code.length;

    let currentToken: string = ""; // Initiate an empty string variable in which to store the current token
    let tokens: Array<string> = new Array(); // Initiate an empty array of strings in which to store all found tokens

    // Flags
    let searchForString = false; // A flag that tells the lexer wheter it is searching for a string or not right now

    // Temporary variables
    let _tempString = "";

    // Loop through the code
    for(let i = 0; i < length; i++){
        if(code[i] === " " && !searchForString) continue;

        currentToken += code[i];

        // Check flags
        if(searchForString){
            if(currentToken === "\""){
                addToken(jce.strings.STRING);
                addToken(_tempString);
                addToken(jce.strings.QOUTE);
                searchForString = false;
                _tempString = "";
                continue;
            } else {
                _tempString += currentToken;
                resetToken();
                continue;
            }
        }

        if(currentToken === "write"){
            addToken(jce.functions.PRINT)
            continue;
        } else if(currentToken === "("){
            addToken(jce.syntax.OPEN_PARENTHESIS);
            continue;
        } else if(currentToken === ")"){
            addToken(jce.syntax.CLOSED_PARENTHESIS);
            continue;
        } else if(currentToken === "\""){
            addToken(jce.strings.QOUTE);
            searchForString = true;
            continue;
        } else if(currentToken === ";"){
            addToken(jce.syntax.END_LINE);
            continue;
        }
    }

    /**
     * Adds the current token to the list of found tokens
     * @param _currentToken The token to add
     */
    function addToken(_currentToken: string){
        tokens.push(_currentToken);
        resetToken();
    }

    /**
     * Reset the current token
     */
    function resetToken(){
        currentToken = "";
    }

    return tokens;
}