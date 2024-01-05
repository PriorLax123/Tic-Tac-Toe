// Author: Jackson Mishuk

// Constants used to designate different types of wins
const HORZ_TOP = 0
const HORZ_MID = 1
const HORZ_BOT = 2
const VIRT_LFT = 3
const VIRT_MID = 4
const VIRT_RGT = 5
const DIAG_TLBR= 6
const DIAG_BLTR= 7

//DOM Elements
var settingsStatus = document.getElementById("settingsStatus")
var playerHeader = document.getElementById("playerHeader")
var boardElement = document.getElementById("ticTacToeBoard")
const resetButton = document.getElementById("resetButton")


//Values of all squares on the board
const boardValues = ["", "", "",
                     "", "", "", 
                     "", "", ""]

//DOM Elements for all squares on the board
const squareElements = [document.getElementById("r1c1"), document.getElementById("r1c2"), document.getElementById("r1c3"),
                        document.getElementById("r2c1"), document.getElementById("r2c2"), document.getElementById("r2c3"),
                        document.getElementById("r3c1"), document.getElementById("r3c2"), document.getElementById("r3c3")]

//Settings that are currently being used
const currentGameSettings = {
    playerAmt: '2PlayerMode',
    diffLvl: 'Easy',
    firstPlayer: "X",
}

//Settings that have currently been selected
const selectedGameSettings = {
    playerAmt: '2PlayerMode',
    diffLvl: 'Easy',
    firstPlayer: 'X',
}

var moveLock = false
var emptySqrs
restartGame()


function testCall(){
    fetch(new Request("http://localhost:3000/api/v1/Test/1:A/2:B/3:C/4:D/5:E/6:G"))
        .then((response) => {
            return response.blob()
        })

        .then((response) => {
            console.log(response)
        })
}
/*
 * restartGame() is used when the game is started, or when a restart button is hit.
 * Will prepair a new game with the potentially new selected settings
 *
 * Perameter: None
 *
 * Returns: None
 */
function restartGame(){


    for(i = 0; i<boardValues.length; i++){
        boardValues[i] = "";
    }
    
    boardValues.forEach((tElement, i) => {
        squareElements[i].textContent = tElement;
        squareElements[i].className = ""
    });

    playerHeader.className = ""
    boardElement.className = ""
    
    makeSelectedSettingsCurrent()

    settingsStatus.style.visibility = 'hidden'

    winConditionMet = -1
    drawMet = false
    emptySqrs = 9;

    setPlayerMove(currentGameSettings['firstPlayer'])
    
    resetButton.style.visibility = 'hidden'

    if(currentGameSettings['playerAmt'] === '1PlayerMode' && playerMove === 'O'){
        simulateComputerMove()
    }
}

/*
 * getRandomInt(ceiling(int)) is used to get a random int between [0, ceiling)
 *
 * Parameter: ceiling(int): the amount of integers that could be returned
 *
 * Returns: The random integer that is calculated
 */
function getRandomInt(ceiling){
    return Math.floor(Math.random()*ceiling)
}

/*
 * checkNearWin(piece(String)) is used to see if player can win with one move
 *
 * Parameter: piece(String): the player value that is being checked for a "near-win"
 *
 * Returns: The Value of the first "near-win" spot found for the player, or null if there is none
 */
function checkNearWin(piece){
    if(emptySqrs > 6 || emptySqrs <= 1) return null

    let blankIndicies = boardValues.map((element, index) => element === "" ? index : -1)
    blankIndicies = blankIndicies.filter(element => element !== -1)

    for(let index in blankIndicies){
        let value = blankIndicies[index]
        if(boardValues[(value+3)%9] === piece && boardValues[(value+6)%9] === piece){
            console.log(`Down near-win detected for ` + piece + ` on open space ` + value + `!`)
            return value
        }
        if(boardValues[Math.floor(value/3) * 3 + ((value+1)%3)] === piece && boardValues[Math.floor(value/3) * 3 + ((value+2)%3)] === piece){
            console.log(`Across near-win detected for ` + piece + ` on open space ` + value + `!`)
            return value
        }
        if(value%4===0 && boardValues[(value+4)%12]===piece && boardValues[(value+8)%12]===piece){
            console.log(`Diag(TLBR) near-win detected for ` + piece + ` on open space ` + value + `!`)
            return value
        }
        if(value%8!==0 && value%2===0 && boardValues[(value%6)+2]===piece && boardValues[((value+2)%6)+2]===piece){
            console.log(`Diag(BLTR) near-win detected for ` + piece + ` on open space ` + value + `!`)
            return value
        }

    }
    return null
}

/*
 * getRandomishMove() is used to recieve a sligtly skued random move and perform the move on that space
 *
 * Parameter: None
 *
 * Returns: None
 */
function getRandomishMove(){
    //Jackson heuristic for medium difficulty
    //Goal is to make it so that if all squares are still avalible, that there is...
    //A 30% chance to go center, 60% chance to go in any corner and only a 10% chance to go on the edges
    let moveCalc
    while(true){
        moveCalc = getRandomInt(10)
        if(moveCalc < 3 ){//center move
            if(boardValues[4] === ""){
                handleClick(squareElements[4], 4)
                return
            }
        }else if(moveCalc < 9){
            moveCalc = getRandomInt(4)
            switch(moveCalc){
                case 0:
                    if(boardValues[0] === ""){
                        handleClick(squareElements[0], 0)
                        return
                    }
                case 1:
                    if(boardValues[2] === ""){
                        handleClick(squareElements[2], 2)
                        return
                    }
                case 2:
                    if(boardValues[6] === ""){
                        handleClick(squareElements[6], 6)
                        return
                    }
                case 3:
                    if(boardValues[8] === ""){
                        handleClick(squareElements[8], 8)
                        return
                    }
            }
        }else{
            moveCalc = getRandomInt(4)
            switch(moveCalc){
                case 0:
                    if(boardValues[1] === ""){
                        handleClick(squareElements[1], 1)
                        return
                    }
                case 1:
                    if(boardValues[3] === ""){
                        handleClick(squareElements[3], 3)
                        return
                    }
                case 2:
                    if(boardValues[5] === ""){
                        handleClick(squareElements[5], 5)
                        return
                    }
                case 3:
                    if(boardValues[7] === ""){
                        handleClick(squareElements[7], 7)
                        return
                    }
            }
        }
    }
}

/*
 * getStateUtility(stateBoardValues(String[]), rootDist(int), player(String)) is used 
 * to get the value of a particular move on the stateBoardValues
 *
 * Parameters: stateBoardValues(String[]): the board values in a particular recursive stack
 *            rootDist(int): the amount of plays into the future that are being calculated
 *            player(String): the player value that would be moving onto this board
 *
 * Returns: int[2]: { [0]: The utility value of a particuar play,
 *                    [1]: The index of the board that is calculated to be the best square to play on}
 */
function getStateUtility(stateBoardValues, rootDist, player){
    let blankIndicies = stateBoardValues.map((element, index) => element === "" ? index : -1)
    blankIndicies = blankIndicies.filter(element => element !== -1)
    let miniMax;
    if(winCondition(player, stateBoardValues) >= 0){
        if(rootDist % 2 === 0){
            return [1, -1]
        }
        return [-1, -1]
    }
    if(winCondition(player === 'O' ? 'X' : 'O', stateBoardValues) >= 0){
        if(rootDist % 2 === 0){
            return [-1, -1]
        }
        return [1, -1]
    }
    if(drawCondition(stateBoardValues)){
        return [0, -1]
    }

    let indexVal = -1
    for(let index in blankIndicies){

        let randInt = getRandomInt(blankIndicies.length)

        let value = blankIndicies[index]

        let updatedArr = stateBoardValues.slice()
        updatedArr[value] = player

        let returnedArr = getStateUtility(updatedArr, rootDist+1, player === 'O' ? 'X' : 'O')
        let recRet = returnedArr[0]
        if(indexVal === -1){
            miniMax = recRet
            indexVal = value
        }else if(rootDist % 2 === 0){
            if(recRet > miniMax || (recRet === miniMax && randInt==0)){
                miniMax = recRet
                indexVal = value
            }
        }else{
            if(recRet < miniMax || (recRet === miniMax && randInt==0)){
                miniMax = recRet
                indexVal = value
            }
        }
    }
    return [miniMax, indexVal]
}

/*
 * getBestUtilityPlay() is used to find the best play based on minimax value for the given board state
 *
 * Parameter: None
 *
 * Returns: The index of the best spot to move on
 */
function getBestUtilityPlay(){
    returnedArr = getStateUtility(boardValues, 0, playerMove)
    return returnedArr[1]
}

/*
 * getComputerMove() is used to get the computers move based of the difficulty level and play the move on the board
 *
 * Parameter: None
 *
 * Returns: None
 */
function getComputerMove(){
    if(currentGameSettings['diffLvl'] === 'Easy'){
        getRandomishMove() //Calls the handleClick for the calculated spot inside
    }else if(currentGameSettings['diffLvl'] === 'Medium'){
        
        let nearWinSqr = checkNearWin(playerMove)
        if(nearWinSqr !== null){
            handleClick(squareElements[nearWinSqr], nearWinSqr)
             return 
        }
        nearWinSqr = checkNearWin(playerMove === 'O' ? 'X' : 'O')
        if(nearWinSqr !== null){
            handleClick(squareElements[nearWinSqr], nearWinSqr)
            return 
        }
        getRandomishMove() //Calls the handleClick for the calculated spot inside
    }else if(currentGameSettings['diffLvl'] === 'Hard'){
        let index = getBestUtilityPlay()
        handleClick(squareElements[index], index)
    }
}

/*
 * simulateComputerMove() is used to simulate the computer having to "think" about its move
 *
 * Parameter: None
 *
 * Returns: None
 */
function simulateComputerMove(){
    
    if(!boardValues.every(element => element === "")){
        const thinkingSpan = document.getElementById("indicateThinking")
    
        thinkingSpan.style.visibility = 'visible'
        moveLock = true;

        const oldCurrGameSettings = structuredClone(currentGameSettings)
        setTimeout(function(){
            if(!Object.keys(selectedGameSettings).every(key => currentGameSettings[key] === oldCurrGameSettings[key])){
                clearTimeout(setTimeoutID)
                thinkingSpan.style.visibility = 'hidden'
                moveLock = false
                if(currentGameSettings['playerAmt'] === '1PlayerMode')
                    simulateComputerMove()
            }
        }, 1500)

        const setTimeoutID = setTimeout(function(){
            
            moveLock = false
            getComputerMove()
            thinkingSpan.style.visibility = 'hidden'
        }, 1500)
    }else
        getComputerMove()
}

/*
 * makeSelectedSettingsCurrent() is used to put all of the selectedGameSettings JSON into the currentGameSettings JSON
 *
 * Parameter: None
 *
 * Returns: None
 */
function makeSelectedSettingsCurrent(){
    Object.keys(selectedGameSettings).forEach(key=>{currentGameSettings[key] = selectedGameSettings[key]})
}

/*
 * changePlayerHeaderContent(newContent(String)) is used to update the playerHeader HTML textContent to newContent
 *
 * Parameter: newContent(String): The string that you want to be showen in the playerHeader HTML textContent
 *
 * Returns: None
 */
function changePlayerHeaderContent(newContent){
    playerHeader.textContent = newContent
}

/*
 * setPlayerMove(player(String)) is used to update the (current) playerMove
 *
 * Parameter: player(String): The player value that the playerMove should be updated to
 *
 * Returns: None
 */
function setPlayerMove(player){
    playerMove = player;
    changePlayerHeaderContent(`${playerMove}'s Move`)
}

/*
 * winCondition(player, stateBoardValues) checks to see if the player who just played has just won
 *
 * Parameters: player(String): The player value that the playerMove should be updated to
 *             stateBoardValues(String[]): The board state that is being checked for a win
 *
 * Returns: int: A value that represents the type of win that has occurred (-1 if no win has occurred)
 */
function winCondition(player, stateBoardValues){
        if      (stateBoardValues[0] == player && stateBoardValues[1] == player && stateBoardValues[2] == player) return HORZ_TOP
        else if (stateBoardValues[3] == player && stateBoardValues[4] == player && stateBoardValues[5] == player) return HORZ_MID
        else if (stateBoardValues[6] == player && stateBoardValues[7] == player && stateBoardValues[8] == player) return HORZ_BOT
        else if (stateBoardValues[0] == player && stateBoardValues[3] == player && stateBoardValues[6] == player) return VIRT_LFT
        else if (stateBoardValues[1] == player && stateBoardValues[4] == player && stateBoardValues[7] == player) return VIRT_MID
        else if (stateBoardValues[2] == player && stateBoardValues[5] == player && stateBoardValues[8] == player) return VIRT_RGT
        else if (stateBoardValues[0] == player && stateBoardValues[4] == player && stateBoardValues[8] == player) return DIAG_TLBR
        else if (stateBoardValues[2] == player && stateBoardValues[4] == player && stateBoardValues[6] == player) return DIAG_BLTR
    return -1;
}

/*
 * PRE: Must be called AFTER calling the winCondition method, otherwise result is not reliable
 *
 * drawCondition(stateBoardValues) checks to see if the board state is a draw
 *
 * Parameters: stateBoardValues(String[]): The board state that is being checked for a win
 *
 * Returns: boolean: true if the state is a draw and false if not
 */
function drawCondition(stateBoardValues){
    let count=0
    stateBoardValues.forEach((element) =>{
        if(element == "") count++
    }); 

    if(count==0) return true

    return false
}

/*
 * winUpdate() is used to update the game after a win has already been detected
 *
 * Parameters: None
 *
 * Returns: None
 */
function winUpdate(){
    changePlayerHeaderContent(`${playerMove} Wins!`)
        resetButton.style.visibility = 'visible'
        switch(winConditionMet){
            case HORZ_TOP:
                for(let i = 0; i<3; i++) winAnimation(squareElements[i])
                break
            case HORZ_MID:
                for(let i = 3; i<6; i++) winAnimation(squareElements[i])
                break
            case HORZ_BOT:
                for(let i = 6; i<9; i++)winAnimation(squareElements[i])
                break
            case VIRT_LFT:
                for(let i = 0; i<7; i+=3) winAnimation(squareElements[i])
                break
            case VIRT_MID:
                for(let i = 1; i<8; i+=3) winAnimation(squareElements[i])
                break
            case VIRT_RGT:
                for(let i = 2; i<9; i+=3) winAnimation(squareElements[i])
                break
            case DIAG_TLBR:
                for(let i = 0; i<9; i+=4) winAnimation(squareElements[i])
                break
            case DIAG_BLTR:
                for(let i = 2; i<7; i+=2) winAnimation(squareElements[i])
        }
        winAnimation(playerHeader)
        settingsStatus.style.visibility = 'hidden'
}

/*
 * winAnimation(i(int)) is used to add an animation to a given index on the board
 *
 * Parameters: i(int): the index of a space that the victoryTransition class will be added to
 *
 * Returns: None
 */
function winAnimation(i){
    setTimeout(function(){i.className='victoryTransition'},4)
}

/*
 * updateBoard(i(int)) is used to add text to index i and check for terminal states
 *
 * Parameters: i(int): the index of a space that will have text added to it
 *
 * Returns: None
 */
function updateBoard(i){

    squareElements[i].style.color= 'black'
    squareElements[i].textContent = boardValues[i]
    
    let win = winCondition(playerMove, boardValues)
    if(win == -1){
        drawMet = drawCondition(boardValues)
    }else{
        console.log("Type of win: " + win)
        winConditionMet = win;
    }
}

/*
 * handleClick(element(DOM Element), i(int)) handle a click on a given element/i(index)
 *
 * Parameters: element(DOM Element): the element that was clicked on
 *             i(int): the index of a space that was clicked
 *
 * Returns: None
 */
function handleClick(element, i){
    // console.log(element)
    if(winConditionMet != -1 || boardValues[i] != "" || moveLock) return

    boardValues[i] = playerMove
    emptySqrs--
    updateBoard(i)

    if(winConditionMet != -1){
        winUpdate()
        return
    }
    if(drawMet){
        console.log("Draw!")
        playerHeader.textContent = `Draw!`
        resetButton.style.visibility = 'visible'
        settingsStatus.style.visibility = 'hidden'
        return
    }
    if(playerMove == "X")
        setPlayerMove("O")
    else
        setPlayerMove("X")

    if(currentGameSettings['playerAmt'] === '1PlayerMode' && playerMove === 'O'){
        simulateComputerMove()
    }
}

/*
 * handleHover(element(DOM Element), i(int)) handle a hover on a given element/i(index)
 *
 * Parameters: element(DOM Element): the element that is being hovered
 *             i(int): the index of a space that is being hovered
 *
 * Returns: None
 */
function handleHover(element, i){
    if(boardValues[i] == "" && winConditionMet === -1 && !drawMet && !moveLock){
        element.innerHTML = playerMove
        element.style.color='rgb(165,165,165)'
    }
}

// Hover action listeners
squareElements.forEach((docElement, index )=> {docElement.addEventListener("mouseover", function(){handleHover(docElement, index)})});
squareElements.forEach((docElement, index )=> {docElement.addEventListener("mouseout", function(){if(boardValues[index] == "")docElement.innerHTML = "";})});

// Settings buttons DOM elements
var playerMode1 = document.getElementById('1PlayerMode');
var playerMode2 = document.getElementById('2PlayerMode');

const diffGroup = document.getElementsByName("difficulty")
var easyMode = document.getElementById('Easy');
var mediumMode = document.getElementById('Medium');
var hardMode = document.getElementById('Hard');

var XFirst = document.getElementById('X');
var OFirst = document.getElementById('O');

// Settings buttons action listeners
playerMode1.addEventListener('change', handlePlayerModeChange);
playerMode2.addEventListener('change', handlePlayerModeChange);

easyMode.addEventListener('change', handleDifficultyChange);
mediumMode.addEventListener('change', handleDifficultyChange);
hardMode.addEventListener('change', handleDifficultyChange);

XFirst.addEventListener('change', handleFirstPlayerChange);
OFirst.addEventListener('change', handleFirstPlayerChange);

/*
 * settingsConsistent() used to see if the current & selected settings are consistent
 *
 * Parameters: None
 *
 * Returns: None
 */
function settingsConsistent(){
    if(selectedGameSettings['playerAmt'] === '1PlayerMode')
        return Object.keys(selectedGameSettings).every(key => selectedGameSettings[key] === currentGameSettings[key]);
    else{
        return '2PlayerMode' === currentGameSettings['playerAmt'] && selectedGameSettings['firstPlayer'] === currentGameSettings['firstPlayer']
    }
}

/*
 * toggleSettingsMessage() used to display the message alerting the user that the settings that they selected are not current
 *
 * Parameters: None
 *
 * Returns: None
 */
function toggleSettingsMessage(){
    if(settingsConsistent()){
        settingsStatus.style.visibility = 'hidden'
    }else{
        if((boardValues.every((element)=>element === ""))){
            makeSelectedSettingsCurrent()
            settingsStatus.style.visibility = 'hidden'
            restartGame()
        }else if(winConditionMet != -1 || drawMet){
            makeSelectedSettingsCurrent()
            settingsStatus.style.visibility = 'hidden'
        }else
            settingsStatus.style.visibility = 'visible'

    }
}

/*
 * handlePlayerModeChange(event(DOM Element)) used to deal with the checking of a setting on the page
 *
 * Parameters: event(DOM Element): The setting status to be updated
 *
 * Returns: None
 */
function handlePlayerModeChange(event) {
    selectedGameSettings['playerAmt'] = event.target.id;
    if(event.target.id === '1PlayerMode'){
        diffGroup.forEach((element)=>{
            element.nextElementSibling.setAttribute('aria-disabled', false)
            element.nextElementSibling.classList.remove('disabled');
            if(element.id === selectedGameSettings['diffLvl'])
                element.checked = true
        })
    }else if(event.target.id === '2PlayerMode'){
        diffGroup.forEach((element)=>{
            element.nextElementSibling.setAttribute('aria-disabled', true)
            element.nextElementSibling.classList.add('disabled');
            if(element.checked)
                element.checked = false
        })
    }
    toggleSettingsMessage()
}

/*
 * handleDifficultyChange(event(DOM Element)) used to deal with the checking of a setting on the page
 *
 * Parameters: event(DOM Element): The setting status to be updated
 *
 * Returns: None
 */
function handleDifficultyChange(event) {
    selectedGameSettings['diffLvl'] = event.target.id;
    toggleSettingsMessage()
}

/*
 * handleFirstPlayerChange(event(DOM Element)) used to deal with the checking of a setting on the page
 *
 * Parameters: event(DOM Element): The setting status to be updated
 *
 * Returns: None
 */
function handleFirstPlayerChange(event) {
    selectedGameSettings['firstPlayer'] = event.target.id;
    toggleSettingsMessage()
}
