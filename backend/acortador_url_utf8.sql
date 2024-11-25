-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: acortador_url
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_request`
--

DROP TABLE IF EXISTS `api_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `request_time` datetime NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `request_type` enum('api','shorten') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `api_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_request`
--

LOCK TABLES `api_request` WRITE;
/*!40000 ALTER TABLE `api_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_requests`
--

DROP TABLE IF EXISTS `api_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `request_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `endpoint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_requests`
--

LOCK TABLES `api_requests` WRITE;
/*!40000 ALTER TABLE `api_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clicks`
--

DROP TABLE IF EXISTS `clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clicks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url_id` int NOT NULL,
  `click_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url_id` (`url_id`),
  CONSTRAINT `clicks_ibfk_1` FOREIGN KEY (`url_id`) REFERENCES `urls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clicks`
--

LOCK TABLES `clicks` WRITE;
/*!40000 ALTER TABLE `clicks` DISABLE KEYS */;
INSERT INTO `clicks` VALUES (1,1,'2024-11-22 12:34:48');
/*!40000 ALTER TABLE `clicks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20241110110931-initial-migration.js'),('20241110111642-add-qr-code-to-urls.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urls`
--

DROP TABLE IF EXISTS `urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_url` varchar(255) NOT NULL,
  `short_url` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  `userId` int NOT NULL,
  `click_count` int DEFAULT '0',
  `qr_code` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `urls_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urls`
--

LOCK TABLES `urls` WRITE;
/*!40000 ALTER TABLE `urls` DISABLE KEYS */;
INSERT INTO `urls` VALUES (1,'https://icons.getbootstrap.com/icons/x-lg/','bNUH5r','2024-11-22 12:34:46',NULL,18,1,NULL,'2024-11-22 12:34:46','2024-11-22 12:34:48');
/*!40000 ALTER TABLE `urls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_paid_user` tinyint(1) DEFAULT '0',
  `subscriptionType` enum('basic','platino','diamante') DEFAULT 'basic',
  `api_token` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `idx_unique_email` (`email`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'https://ejemplsdo.com','$2b$10$tIK/jZ7J3/sL.dnlX2fsBe8VyI2rXA58K0KM6/9/CI8AZhlwenTNG','perry29615943@gmail.com','643486830','2024-10-20 12:08:43','2024-10-20 12:08:43',0,'basic',NULL),(15,'nombre_usuario','$2b$10$Iqni05ziCN2x6O5G0nLxUu2yRgudvCrCoXobZ3Q7XGeol/IL0ZBEa','correo@example.com','123456789','2024-10-20 12:08:43','2024-10-20 12:08:43',0,'basic',NULL),(17,'willis','$2b$10$hQnXu0PDVQMRHlxeMxFdz.52jlPMXZDRusA1lYPtmbuZyEM/kpv5.','perry2943@gmail.com','643486930','2024-10-20 12:08:43','2024-10-20 12:08:43',0,'basic',NULL),(18,'williams','$2b$10$yBqNHrd5LnpP4DDKNQ80I.BfkeCMvUb4rf/NqDa1eQDSgTvLLXFgC','lobo@gmail.com','645654423','2024-10-20 12:08:43','2024-11-18 08:31:45',1,'diamante','19fdbfca42396a4768e24fc5ec7beaccbef013f7e0d102fe79d63230286941ca'),(19,'williams1','lobo2609','logo@gmial.com','654123423','2024-10-20 10:13:23','2024-10-20 10:13:23',0,'basic',NULL),(23,'williams2','lobo2609','lobwo@gmail.com','4612312322','2024-10-20 10:16:08','2024-10-20 10:16:08',0,'basic',NULL),(24,'williams23','$2b$10$Sc5M.0VElcmNlkhi8NfEieoKLF7ZfudFKn0Ti5rVUNMzvjjabQ3Dq','lobwo1@gmail.com','4612312322','2024-10-20 10:19:06','2024-10-20 10:19:06',0,'basic',NULL),(25,'williamsca','$2b$10$DhsApDy5UbdP0pGeBPOpserJbwpwz4mJdAJu79j0Ju7aDhmNAYT62','perry@gmail.com','4512421421','2024-10-24 17:50:16','2024-10-24 17:50:16',0,'basic',NULL),(26,'willianx .','$2b$10$vk1fsYV6xSY1C6Bo9lIdz.zHUMpm8uEuITbytpaM4FuAOxI90FBy2','gabrielabaque97@icloud.com','6645451','2024-10-24 18:12:23','2024-10-24 18:12:23',0,'basic',NULL),(27,'','$2b$10$lOCyupnE7lnmL8B/gT63Pus2UXCiuczgNx24Jy1d60hTwUaVv8paC','','','2024-10-24 18:13:25','2024-10-24 18:13:25',0,'basic',NULL),(28,'willianxs','$2b$10$cbDMyTpECDjv3CSOlxNC6OmCLRR3Cle1I16jstj34M35C8G65az8S','gabrielasabaque97@icloud.com','251252134','2024-10-24 18:23:31','2024-10-24 18:23:31',0,'basic',NULL),(29,'Williams2612','$2b$10$06S.zBgJ/mTNXusBFA.rteBjqOIKQriUdOuTfBFsCRh2TR4OxsQsy','gabrielabaquesa97@icloud.com','643486830','2024-10-25 16:35:11','2024-10-25 16:35:11',0,'basic',NULL),(30,'willi','$2b$10$NDrQSJCBiBMwS5rgzq5lx.hWxkqfB0ZJ7RS1W/J68z4onLefJ.s6K','lobocuentadetibia@gmail.com','643486830','2024-11-01 12:19:34','2024-11-11 09:34:13',1,'platino',NULL),(31,'lobito','$2b$10$QX901zCZzaCHAEGjU8EO0eYnw1CmM5v4GJlh3Il7NtrnbyIL9DpKa','isaac2004baque@gmail.com','565645451','2024-11-01 18:38:22','2024-11-01 18:38:22',0,'basic',NULL),(32,'willisa','$2b$10$5Sy0CMpCia1WqCYWYb9Uue.f6CpIDSpSWhWX0LCphL6Xybh2kg0PK','lobocuentadetibiaa@gmail.com','643486830','2024-11-11 09:31:22','2024-11-11 09:31:22',0,'basic',NULL),(33,'willisss','$2b$10$E5YpB74t9XFIOI3Wp2woNurx5lyuNvJICkFUL013ZEMoNF7B4GICq','lobocuentadetibia11@gmail.com','643486830','2024-11-11 09:32:07','2024-11-15 09:07:25',0,'basic','6f21204c6fde2e60c578bfbba00e7b854ce8e27a64f23a3e6abbeee7b7a6a01a'),(34,'lobote','$2b$10$YuHKd8WIpCmv2gn3GeHPHelZllBGUClQWlUMY/el4DzK9KgPa5awm','perry21412safasf4124@gmail.com','643486830','2024-11-11 10:16:42','2024-11-11 10:16:42',0,'basic',NULL),(35,'testuser','$2b$10$fs6Kjp.hUjDVajFSlNP0.usRRd6TVxXwaKfjFXYurN.z9y4WBVYsK','test@example.com','123456789','2024-11-19 12:43:27','2024-11-19 12:43:27',0,'basic',NULL),(36,'testuusaer','$2b$10$TguztajupWYqUo04m8kSqumHFwipyJE90hxwJ.2RpoEx33eqlDjTa','tesast@example.com','123456789','2024-11-19 12:52:07','2024-11-19 12:52:07',0,'basic',NULL),(37,'testuuassaer','$2b$10$nDUfVWNl3nNb79PECH4de.PbcxCrkHSbIhWBnJ5hrl/CKE1rhkgOS','tesasast@example.com','123456789','2024-11-19 12:57:10','2024-11-19 12:57:10',0,'basic',NULL),(38,'teaeuassaer','$2b$10$SI08UeIsPZ.Pjr2boclHeeBSVIEQuBoZOlHmIfBAceBKNvcEwvvT6','tesassaasast@example.com','123456789','2024-11-19 13:26:40','2024-11-19 13:26:40',0,'basic',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-23 22:11:14
