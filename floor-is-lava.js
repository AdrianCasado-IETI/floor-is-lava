const readline = require('readline').promises
const fs = require('fs').promises

let tauler = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2],
]

let playerPos = "0,0"
let vides = 32

let continuePlaying = true;

let trampa = false;

const printTauler = () => {
    for(let i = 0; i < tauler.length; i++) {
        let line = "";
        for(let j = 0; j<tauler[i].length; j++) {
            if(playerPos === `${i},${j}`) {
                line += "T"
            }
            else if(tauler[i][j] === 0 || tauler[i][j] === 1) {
                line += "·"
            }
            else if(tauler[i][j] === -1) {
                line += "l"
            }
            else if(tauler[i][j] === 2) {
                line += "*"
            }
        }
        if(trampa) {
            line += "    "
            for(let j = 0; j<tauler[i].length; j++) {
                if(tauler[i][j] === -1 || tauler[i][j] === 1) {
                    line += "l"
                }
                else if(tauler[i][j] === 0) {
                    line += "·"
                }else if(tauler[i][j] === 2) {
                    line += "*"
                }
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

        if(tauler[lavaPosX][lavaPosX] === 0 && !(lavaPosX === 0 && lavaPosY === 0) && !(lavaPosX === 5 && lavaPosY === 7)){
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

        await handleJugada(jugada);
    }
    rl.close()
}

const handleJugada = async (jugada) => {
    jugada = jugada.toLowerCase().trim().split(" ")
    if(jugada.length == 2){
        if(jugada[0] == "caminar"){
            const posicio = jugada[1]
            if(posicio === "dreta") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${playerPosArray[0]},${parseInt(playerPosArray[1])+1}`
                checkPos()
                vides--
            }else if(posicio === "esquerra") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${playerPosArray[0]},${parseInt(playerPosArray[1])-1}`
                checkPos()
                vides--
            }else if(posicio === "avall") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${parseInt(playerPosArray[0])+1},${playerPosArray[1]}`
                checkPos()
                vides--
            }else if(posicio === "amunt") {
                const playerPosArray = playerPos.split(",")
                playerPos = `${parseInt(playerPosArray[0])-1},${playerPosArray[1]}`
                checkPos()
                vides--
            }
            if(vides <= 0) {
                continuePlaying = false
                console.log("Has perdut, ja no tens més passes")
            }
        }else if(jugada[0] === "activar" && jugada[1] === "trampa") {
            trampa = true;
        }
        else if(jugada[0] === "desactivar" && jugada[1] === "trampa") {
            trampa = false;
        }
    }else if(jugada.length === 1) {
        if(jugada[0] === "ajuda") {
            console.log("\n\n--- LLISTA DE COMANDES ---")
            console.log("- carregar partida [nom_arxiu.json]: carrega una partida guardada")
            console.log("- guardar partida [nom_arxiu.json]: guarda la partida actual")
            console.log("- activar/desactivar trampa: mostrar o amagar tauler amb les caselles destapades")
            console.log("- caminar [direcció]: caminar cap a la direcció mencionada (amunt, avall, dreta, esquerra)\n\n")
        }
        else if(jugada[0].replace("ó","o") === "puntuacio") {
            console.log(`\n\nPasses restants: ${vides}\n\n`)
        }else if(jugada[0] === "sortir") {
            continuePlaying = false;
        }
    }else if(jugada.length === 3) {
        if(jugada[0] === "guardar" && jugada[1] === "partida") {
            await saveData(jugada[2])
        }
        else if(jugada[0] === "carregar" && jugada[1] === "partida") {
            await getData(jugada[2])
        }
    }
}

const checkPos = () => {
    positionArray = playerPos.split(",")
    if(tauler[positionArray[0]][positionArray[1]] === 1 || tauler[positionArray[0]][positionArray[1]] === -1) {
        console.log("Has trepitjat lava, perds un punt")
        tauler[positionArray[0]][positionArray[1]] = -1
        vides--;
    }else if(tauler[positionArray[0]][positionArray[1]] === 2) {
        continuePlaying = false
        console.log("Has guanyat, has trobat el tresor")
    }else {
        console.log(`Vas per bon camí, tens lava a ${getLavaPropera()} caselles`)
    }
}

const getLavaPropera = () => {
    const [playerX, playerY] = playerPos.split(",").map((pos)=>parseInt(pos));
    let minDistance = Infinity;

    for (let i = 0; i < tauler.length; i++) {
        for (let j = 0; j < tauler[i].length; j++) {
            if (tauler[i][j] === 1 || tauler[i][j] === -1) {
                const distance = Math.abs(playerX - i) + Math.abs(playerY - j);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
    }

    return minDistance === Infinity ? -1 : minDistance;
}

const saveData = async (nomArxiu) => {
    const data = {
        tauler: tauler,
        posicio: playerPos,
        vides: vides
    }

    try {
        const jsonData = JSON.stringify(data, null, 2)
        await fs.writeFile(nomArxiu,jsonData,'utf-8')
        console.log(`Dades guardades a ${nomArxiu}`)
    }catch(error) {
        console.error("Error en escriure les dades: ",error);
    }
}
const getData = async (nomArxiu) => {
    try {
        const jsonData = await fs.readFile(nomArxiu,'utf-8')
        const data = JSON.parse(jsonData)
        tauler = data.tauler
        vides = data.vides
        playerPos = data.posicio
    }catch(error) {
        console.error("Error en llegir les dades: ",error)
    }
}

main()