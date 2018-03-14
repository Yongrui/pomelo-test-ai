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
		WATCHER: 'watcher',
		BULLET: 'bullet'
	},
	CampType: {
		WE: 'we',
		ENEMY: 'enemy'
	},
	ARENA: {
		ARENA_ID_NONE: 0,
		ENTER_ARENA_CODE: {
			OK: 1,
			ALREADY_IN_ARENA: -1,
			SYS_ERROR: -2
		},

		OK: 1,
		FAILED: 0
	},
	PLAYER: {
		CREATE_SUCCESS: 1,
		ALREADY_EXISTED: -1
	}
}