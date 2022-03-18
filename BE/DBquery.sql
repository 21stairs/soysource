CREATE TABLE `room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `nowMember` int DEFAULT NULL,
  `maxMember` int DEFAULT NULL,
  `state` varchar(1) NOT NULL DEFAULT 'w',
  `isPrivate` tinyint NOT NULL DEFAULT '0',
  `password` varchar(20) DEFAULT NULL,
  `whoIsMaster` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `whoIsMaster_idx` (`whoIsMaster`),
  CONSTRAINT `whoIsMaster` FOREIGN KEY (`whoIsMaster`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `userName` varchar(20) NOT NULL,
  `ranking` int DEFAULT NULL,
  `userOrder` int DEFAULT NULL,
  `ready` tinyint DEFAULT NULL,
  `score` double DEFAULT NULL,
  `userId` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;