CREATE TABLE `sounds` (
	`id`	INTEGER,
	`rank`	INTEGER NOT NULL,
	`displayName`	TEXT NOT NULL,
	`localSoundPath`	TEXT NOT NULL,
	`remoteSoundPath`	TEXT,
	`duration`	INTEGER,
	`volume`	INTEGER NOT NULL DEFAULT 100,
	`remote`	INTEGER NOT NULL DEFAULT 0,
	`loop`	INTEGER NOT NULL DEFAULT 0,
	`volumeMax`	INTEGER NOT NULL DEFAULT 100,
	`volumeMin`	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY(`id`)
);