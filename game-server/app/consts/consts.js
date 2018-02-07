module.exports = {
	AttackResult: {
		SUCCESS: 1,
		KILLED: 2,
		MISS: 3,
		NOT_IN_RANGE: 4,
		NO_ENOUGH_MP: 5,
		NOT_COOLDOWN: 6,
		ATTACKER_CONFUSED: 7,
		ERROR: -1
	},
	EntityType: {
		PLAYER: 'player',
		SOLDIER: 'soldier',
		HERO: 'hero',
		WATCHER: 'watcher'
	},
	CampType: {
		WE: 'we',
		ENEMY: 'enemy'
	},
	ARENA: {
		CREATE_ARENA_CODE: {
			OK: 1
		},

		OK: 1,
		FAILED: 0
	}
}