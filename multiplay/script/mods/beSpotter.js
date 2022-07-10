include("multiplay/script/mods/geometry.js");
namespace("biSpotter_");
const PAUSE = 5*1000;
const COUNT = 30;

var topology = [
	{op: 2, reflection: "axial"},
	{op: 3, reflection: "centr"},
	{op: 0, reflection: "axial"},
	{op: 1, reflection: "centr"}
];


function spotterUpdate()
{
	const x = syncRandom(mapWidth);
	const y = syncRandom(mapHeight);
	let reachable = [];
	for (let playnum = 0; playnum < maxPlayers; ++playnum)
	{
		if (playerMap[playnum] && playerMap[playnum][x][y] != Infinity)
		{
			reachable.push(playnum);
			debug(playnum);
		}
	}
	if (reachable.length > 0)
	{
		for (let playnum = 0; playnum < maxPlayers; ++playnum)
		{
			if (!reachable.includes(playnum))
			{
				addSpotter(x, y, playnum, 3*128, 0, gameTime+PAUSE*COUNT);
				const {x:x2,y:y2} = transform(x,y);
				addSpotter(x2, y2, playnum, 3*128, 0, gameTime+PAUSE*COUNT);
				debug("x",x,"y",y,"x2",x2,"y2",y2);
			}
		}
	}
	else
	{
		spotterUpdate();
	}
}


function centr(player1, player2)
{
	return {
		x: (startPositions[player1].x + startPositions[player2].x)/2,
		y: (startPositions[player1].y + startPositions[player2].y)/2
	};
}

function axial(player1, player2)
{
	const pos1 = {x: startPositions[player1].x, y: startPositions[player1].y};
	const pos2 = {x: startPositions[player2].x, y: startPositions[player2].y};
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

function transform(x,y)
{
	let player;
	for (let playnum = 0; playnum < maxPlayers; ++playnum)
	{
		if (playerMap[playnum] && playerMap[playnum][x][y] <= 1024)
		{
			player = playnum;
			break;
		}
	}
	const reflection = topology[player].reflection;
	const player2 = topology[player].op;
	let x2, y2;
	if (reflection === "centr")
	{
		const c = centr(player, player2);
		x2 = c.x*2 - x;
		y2 = c.y*2 - y;
	}
	if (reflection === "axial")
	{
		const axis = axial(player, player2);
		if (axis.x)
		{
			y2 = y;
			x2 = x*2-x;
		}
		if (axis.y)
		{
			x2 = x;
			y2 = y*2-y;
		}
	}
	return {x:x2, y:y2};
}

function biSpotter_eventGameInit()
{
	setTimer("spotterUpdate", PAUSE);
}
