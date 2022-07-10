include("multiplay/script/mods/queue.js");
const rawMap = createRawMap();
var playerMap = [];
var newCells = new Queue();

for (let playnum = 0; playnum < maxPlayers; ++playnum)
{
	playerMap[playnum] = fillingMap(startPositions[playnum], lim = Infinity);
}
//debug(JSON.stringify(playerMap));

function initMap(value = undefined)
{
	map = [];
	for (let x = 0; x < mapWidth; ++x)
	{
		map[x] = Array(mapHeight).fill(value);
	}
	return map;
}

function createRawMap()
{
	const rawMap = initMap().map((line, x) =>
	{
		const rawLine = line.map((cell, y) =>
		{
			if (!isPassable(x,y)){return [];}
			let matrix = [
				{x: x-1, y: y-1},
				{x: x-1, y: y},
				{x: x-1, y: y+1},
				{x: x, y: y+1},
				{x: x+1, y: y+1},
				{x: x+1, y: y},
				{x: x+1, y: y-1},
				{x: x, y: y-1}
			];
			return matrix.filter((m) =>isPassable(m.x,m.y));

		});
		return rawLine;
	});
	return rawMap;
}

function fillingMap(obj, lim = Infinity)
{
	let map = initMap(Infinity);
	newCells.reset();
	newCells.add(obj);
	map[obj.x][obj.y]=1;
	while (!newCells.isEmpty())
	{
		let {x:x, y:y} = newCells.get();
		let v = map[x][y]+1;
		if (v > lim){break;}
		rawMap[x][y].forEach((c) =>
		{
			if (map[c.x][c.y] > v )
			{
				map[c.x][c.y] = v;
				newCells.add(c);
			}
		});
	}
	return map;
}

function isPassable(x, y)
{
	//TODO добавить проверку есть ли тут объект
	if (x<0 || y < 0 || x >= mapWidth || y >= mapHeight){return false;}
	return (
		terrainType(x, y) !== TER_CLIFFFACE && terrainType(x, y) !== TER_WATER
	);
}

function dumpMap(map)
{
	map.forEach((line, x) =>
	{
		//line.forEach((c) => debug(JSON.stringify(c)));
		debug (line.join(""));
	});
}
