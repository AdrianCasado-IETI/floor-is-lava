const readline = require('readline').promises

const tauler = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
]

let playerPos = "0,0"
let vides = 32

let continuePlaying = true;

const printTaulerTrampa = () => {
    for(let i = 0; i < tauler.length; i++) {
        let line = "";
        for(let j = 0; j<tauler[i].length; j++) {
            if(tauler[i][j] === 0 ) {
                line += "·"
            }else {
                line += "l"
            }
        }
        console.log(line)
    }
}

const printTauler = () => {
    for(let i = 0; i < tauler.length; i++) {
        let line = "";
        for(let j = 0; j<tauler[i].length; j++) {
            if(playerPos === `${i},${j}`) {
                line += "T"
            }
            else if(tauler[i][j] === 0 || tauler[i][j]) {
                line += "·"
            }
        }
        console.log(line)
    }
}

const initTauler = () => {
    let lavaToPut = 16

    while(lavaToPut > 0) {
        const lavaPosX = Math.floor(Math.random()*6)
        const lavaPosY = Math.floor(Math.random()*8)

        if(tauler[lavaPosX][lavaPosX] === 0 && !(lavaPosX === 0 && lavaPosY === 0) && !(lavaPosX === 7 && lavaPosY === 5)){
            tauler[lavaPosX][lavaPosY] = 1;
            lavaToPut--;
        }
    }
}

const main = async () => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    initTauler()
    while(continuePlaying) {
        printTauler()
        const jugada = await rl.question("Escriu una comanda: ");

        handleJugada(jugada);
    }
}

const handleJugada = (jugada) => {
    jugada = jugada.split(" ")
    if(jugada.length == 2){
        if(jugada[0] == "caminar"){
            const posicio = jugada[1]
            if(posicio === "dreta") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${playerPosArray[0]},${parseInt(playerPosArray[1])+1}`
                checkPos(playerPos)
                vides--
            }else if(posicio === "esquerra") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${playerPosArray[0]},${parseInt(playerPosArray[1])-1}`
                checkPos(playerPos)
                vides--
            }else if(posicio === "avall") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${parseInt(playerPosArray[0])+1},${playerPosArray[1]}`
                checkPos(playerPos)
                vides--
            }else if(posicio === "amunt") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${parseInt(playerPosArray[0])-1},${playerPosArray[1]}`
                checkPos(playerPos)
                vides--
            }
            if(vides <= 0) {
                continuePlaying = false
            }
        }
    }
}

const checkPos = () => {
    
}

main()