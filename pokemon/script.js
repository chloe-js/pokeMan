class Pokemon {
    constructor(name, sprite, hp, moves) {
        this.name = name;
        this.sprite = sprite;
        this.hp = hp;
        this.fullhp = hp;
        this.moves = moves;
    }
}

let pkmList = [
    ['Charizard', 'https://img.pokemondb.net/sprites/black-white/normal/charizard.png', 360, [
        ['Flamethrower', 'fire', 95, 0.95],
        ['Dragon Claw', 'dragon', 100, 0.95],
        ['Air slash', 'fly', 75, 0.85],
        ['Slash', 'normal', 70,]
    ]],
    ['Blastoise', 'https://img.pokemondb.net/sprites/black-white/normal/blastoise.png', 362, [
        ['Surf', 'water', 90, 0.95],
        ['Crunch', 'normal', 80, 0.95],
        ['Ice punch', 'ice', 75, 0.95],
        ['Flash cannon', 'steel', 80, 0.95]
    ]],
    ['Venusaur', 'https://img.pokemondb.net/sprites/black-white/normal/venusaur-f.png', 364, [
        ['Petal Blizzard', 'grass', 90, 0.95],
        ['Sludge bomb', 'poison', 90, 0.95],
        ['Earthquake', 'ground', 100, 0.95],
        ['Body Slam', 'normal', 85, 0.95]
    ]]
];

let typeMatch = {
    'Charizard': [
        ['ground'],
        ['water', 'rock'],
        ['fire', 'grass', 'steel']
    ],
    'Blastoise': [
        [''],
        ['grass'],
        ['fire', 'water']
    ],
    'Venusaur': [
        ['poison'],
        ['fire', 'fly', 'ice', 'steel'],
        ['grass', 'water']
    ],
}
// function true is our pokemon false spawn opponent pokemon // if it ours need to produce add functionality . opponent behavior is automatic
function spawn(bool) {
    let p = pkmList[Math.floor(Math.random() * pkmList.length)];
    let pkm = new Pokemon(p[0], p[1], p[2], p[3]);

    if (bool) {
        for (i = 0; i < 4; i++) {
            document.getElementById('m' + i).value = pkm.moves[i][0];
        }
    }
    return pkm;
}

// /start to spawn pkm
let pk1 = spawn(true);
s1 = document.createElement('img');
s1.src = pk1.sprite;
document.getElementById('pk1').appendChild(s1);
document.getElementById('hp1').innerHTML = '<p>HP: ' + pk1.hp + '/' + pk1.fullhp + '</p>';

let pk2 = spawn(false);
s2 = document.createElement('img');
s2.src = pk2.sprite;
document.getElementById('pk2').appendChild(s2);
document.getElementById('hp2').innerHTML = '<p>HP: ' + pk2.hp + '/' + pk2.fullhp + '</p>';

//add event listener to each button

for (i = 0; i < 4; i++) {
    let btn = document.getElementById(`m${i}`);
    console.log(`m${i}`);
    let move = pk1.moves[i];
    console.log(move);
    function addHandler(btn, move, pk1, pk2) {
        btn.addEventListener('click', function (e) {
            // pkm that comes first is the attacher , second one is the recipient, hp2 is the points that are adjusted, '' is its owner
            attack(move, pk1, pk2, 'hp2', '');
            // commentary to show if the opponent is attacking us , it will have the string 'foe' prepended in front of it
            // opponent will wait 2 second before attacking us
            // here , we are being attached and our HP is adjusted
            setTimeout(attack, 2000, pk1.moves[Math.floor(Math.random() * 3)], pk2, pk1, 'hp1', 'Foe ');
        });
    }
    addHandler(btn, move, pk1, pk2);
}

function attack(move, attacker, receiver, hp, owner) {
    document.getElementById('comment').innerHTML = '<p>' + owner + attacker.name + ' used ' + move[0] + '!</p>';
    // define its accuracy (conditionalising "hits" and "misses")
    // 4th element in each move array defines accuracy 
    // if they have a high accuracy (eg 95% accuracy) it will define a number between 0 and 1 if under 0.95 will HIT 
    if (Math.random() < move[3]) {
        //base power varied, incremented by a value between 0 - 1 for variation
        //represent critical hit
        let power = move[2] += Math.floor(Math.random() * 10);
        //defining type matching
        //power of the move depends on its typing and the typing receiving the attack
        let rtype = typeMatch[receiver.name];
        let mtype = move[1];
        let scale = 1; // scale is a multiply factor - adjusts the power level of each move

        //iterating through array.
        // each pkm is a key in the obj and each key has a value which is comprised of 3 arrays
        //each array represents a particular match up.
        // array 1 immunity of pkm // arr 2 weaknesses // arr3 resistances
        //this is why we use a switch case 
        for (i = 0; i < rtype.length; i++) {
            if (rtype[i].includes(mtype)) {
                switch (i) {
                    //array 0 immunity
                    case 0:
                        scale = 0;
                        setTimeout(function () {
                            document.getElementById('comment').innerHTML = '<p>It has no effect!</p>';
                        }, 1000);
                        break;
                    // array weaknesses
                    case 1:
                        scale = 2; //times by 2
                        setTimeout(function () {
                            document.getElementById('comment').innerHTML = '<p>It was super effective!</p>';
                        }, 1000);
                        break;
                    // array resistances
                    case 2:
                        scale = 0.5;
                        setTimeout(function () {
                            document.getElementById('comment').innerHTML = '<p>It was not very effective!</p>';
                        }, 1000);
                        break;
                }
                break; //end loop
            }

        }

        power *= scale;
        receiver.hp -= Math.floor(power);
        //update hp statice
        document.getElementById(hp).innerHTML = '<p>HP: ' + receiver.hp + '/' + receiver.fullhp + '</p>';

    }
    else {
        setTimeout(function () {
            document.getElementById('comment').innerHTML = '<p>Attack missed!</p>';
        })
    }
    checkWinner(hp);
}
//determine winner
// defining checkWinner() - the 'hp' param is the id of the HTML element holding the pkm's health status
function checkWinner(hp) {
    // pkm 1 hp is lower then 0 , if pk2 hp reaches 0 first, then will define pk 2 as false
    let f = (pk1.hp <= 0) ? pk1 : (pk2.hp <= 0) ? pk2 : false;
    if (f != false) {
        alert('GAME OVER: ' + f.name + ' fainted!');
        //update health status
        document.getElementById(hp).innerHTML = '<p>HP: 0/' + f.fullhp + '</p>'
        setTimeout(function () {
            location.reload();
        }, 1500)
    }
}