include("multiplay/script/mods/geometry.js");
namespace("biSpotter_");

var topology = [
	{op: 2, reflection: "centr"},
	{op: 3, reflection: "axial"},
	{op: 0, reflection: "centr"},
	{op: 1, reflection: "axial"}
];


function spotterUpdate()
{
	for (let x = 0; x < mapWidth; x=x+6)
	{
		for (let y = 0; y < mapHeight; y=y+6)
		{
			for (let playnum = 0; playnum < maxPlayers; ++playnum)
			{
				if (playerMap[playnum] && playerMap[playnum][x][y] <= 1024)
				{
					let id = addSpotter(x, y, playnum, 2*128, 0, 30*1000);
				}
			}
		}
	}
}


function centr (player1, player2)
{
	return {
		x: (playerData[player1].position.x + playerData[player2].position.x)/2,
		y: (playerData[player1].position.y + playerData[player2].position.y)/2
	};
}

function axial (player1, player2)
{
	const pos1 = {x: playerData[player1].position.x, y: playerData[player1].position.y};
	const pos2 = {x: playerData[player2].position.x, y: playerData[player2].position.y};
	if (pos1.x === pos2.x)
	{
		return {y: (pos1.y+pos2.y)/2};
	}
	if (pos1.y === pos2.y)
	{
		return {x: (pos1.x+pos2.x)/2};
	}
	debug("unsimetrical!!!");
}

function biSpotter_eventGameInit()
{
	queue("spotterUpdate", 500);
}

function biSpotter_eventGameLoaded()
{
	queue("spotterUpdate", 500);
}
