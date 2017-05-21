-- Up
CREATE TABLE `user` (
  `id` INTEGER PRIMARY KEY,
  `user_name` VARCHAR(255) NOT NULL UNIQUE,
  `sessionKey` VARCHAR(255) NOT NULL UNIQUE,
  `createdAt` INTEGER,
  `updatedAt` INTEGER
);
CREATE TABLE `location` (
  `id` INTEGER PRIMARY KEY,
  `userId` INTEGER NOT NULL,
  `latitude` FLOAT NOT NULL,
  `longitude` FLOAT NOT NULL,
  `text` TEXT,
  `createdAt` INTEGER,
  `updatedAt` INTEGER,
  CONSTRAINT `location_fk_userId` FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Down
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `location`;
