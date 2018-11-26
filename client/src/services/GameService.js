export const _getAvailableRooms = gamesAvailable => {
  return fetch("http://localhost:3001/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json());
};

export const _findGame = (id, token) => {
    return fetch(`http://localhost:3001/games/${id}`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
	    body: JSON.stringify({token})
      }).then(res => res.json());
}

export const _joinGame = (currentGame, userId, userName, token) => {
	return fetch(`http://localhost:3001/games/update/${currentGame}`, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({userId, userName, token})
	  }).then(res => res.json());
}

export const _leaveGame = (currentGame, userId, userName, token) => {
	return fetch(`http://localhost:3001/games/leave/${currentGame}`, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({userId, userName, token})
	  }).then(res => res.json());
}
