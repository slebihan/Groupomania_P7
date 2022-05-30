-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: groupomania
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `messageId` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_userId_idx` (`userId`),
  KEY `comment_messageid_idx` (`messageId`),
  CONSTRAINT `comment_userId` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (8,57,196,'mais que c\'est beau !!',NULL,'2022-05-16 13:17:28','2022-05-16 13:17:28'),(12,58,196,'C\'est superbe !',NULL,'2022-05-23 10:55:12','2022-05-23 10:55:12'),(15,58,207,'Bienvenue :)',NULL,'2022-05-23 18:45:48','2022-05-23 18:45:48');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dislikes`
--

DROP TABLE IF EXISTS `dislikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dislikes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `dislikes_messageid_ibfk_1_idx` (`messageId`),
  KEY `dislikes_userid_ibfk1_1_idx` (`userId`),
  CONSTRAINT `dislikes_messageid_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dislikes_userid_ibfk1_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dislikes`
--

LOCK TABLES `dislikes` WRITE;
/*!40000 ALTER TABLE `dislikes` DISABLE KEYS */;
INSERT INTO `dislikes` VALUES (172,207,15,'2022-05-21 18:53:59','2022-05-21 18:53:59'),(176,207,21,'2022-05-29 15:57:22','2022-05-29 15:57:22');
/*!40000 ALTER TABLE `dislikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userid_ibfk_1_idx` (`userId`),
  KEY `likes_message_ibfk_1` (`messageId`),
  CONSTRAINT `likes_message_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_userid_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=455 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (375,201,57,'2022-05-19 22:54:20','2022-05-19 22:54:20'),(394,201,15,'2022-05-20 11:33:31','2022-05-20 11:33:31'),(446,201,58,'2022-05-23 20:30:56','2022-05-23 20:30:56'),(451,233,21,'2022-05-29 15:56:39','2022-05-29 15:56:39'),(454,196,15,'2022-05-30 09:45:54','2022-05-30 09:45:54');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `dislikes` int NOT NULL DEFAULT '0',
  `likes` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId_idx` (`userId`),
  CONSTRAINT `UserId` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (196,57,'Test','1er Post','http://localhost:3000/images/photoholgic-hudyM48SzEo-unsplash.jpeg__1652360116206.jpeg',0,3,'2022-05-12 12:55:16','2022-05-30 09:45:54'),(201,58,'Quelle belle journée','☀️',NULL,0,3,'2022-05-18 17:59:34','2022-05-23 20:30:56'),(207,15,'Test de Présentation','ceci est un test',NULL,2,0,'2022-05-20 00:00:07','2022-05-29 15:57:22'),(230,58,'Test','Ceci est un test ? ??',NULL,0,1,'2022-05-23 20:05:21','2022-05-30 08:39:22'),(233,58,'Waouh !','j\'adore cette entreprise ?',NULL,0,2,'2022-05-23 20:13:25','2022-05-29 15:56:39');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20220407151756-create-user.js'),('20220407152035-create-message.js'),('20220428080611-create-like.js'),('20220507214701-create-dislike.js'),('20220515111921-create-comment.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `attachment` varchar(255) DEFAULT 'https://www.recia.fr/wp-content/uploads/2018/10/default-avatar-300x300.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (15,'test@groupomania.fr','test','$2b$10$RMcZFANT3oIj3yVMa9Ch1.GjoEJ7x/K.Inq/F/zqYohpzh3ojiNCO','groupomania',0,'2022-04-12 08:04:45','2022-05-24 15:59:08','http://localhost:3000/images/jeremy-hynes-vQaaj95gGTU-unsplash.jpeg__1653407948070.jpeg'),(21,'admin@groupomania.fr','Admin','$2b$10$TquBE0nhAZYiAfWUN1DwZu4RfBcNhlWcJ6veQSLQwpyMB0LARFvAS','Admin',1,'2022-04-14 10:12:35','2022-04-14 10:12:35','https://www.recia.fr/wp-content/uploads/2018/10/default-avatar-300x300.png'),(56,'testbis@groupomania.fr','testbis','$2b$10$zGCX5LHf03F1PJMKUI45eeZxSbgkHAiWpIXw6bGtXjwpRgK7OCJtC','testbis',0,'2022-04-29 12:25:51','2022-04-29 12:25:51','https://www.recia.fr/wp-content/uploads/2018/10/default-avatar-300x300.png'),(57,'testmodif@groupomania.fr','test2','$2b$10$3VW7/CWJylyQo79L1CYJnOYDsS5nkY9WRNUDoSP7QOn3imuAZxfpi','test2',0,'2022-05-02 12:34:27','2022-05-11 17:14:34','http://localhost:3000/images/srikant-sahoo-r2L6vCKaVRk-unsplash.jpeg__1652289274390.jpeg'),(58,'testcreation@groupomania.fr','testcreation','$2b$10$ai9yp8QTmRZL8bRO/nwULe6I8Jhypx.By44tNQoLmFZSc8FJQsRLe','testcreation',0,'2022-05-17 20:12:55','2022-05-18 18:12:15','http://localhost:3000/images/shreyas-sane-1ICYT1IqOQI-unsplash.jpeg__1652897535695.jpeg');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-30 12:23:52
