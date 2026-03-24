CREATE DATABASE  IF NOT EXISTS `vacanza` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vacanza`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: vacanza
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `vacation_id` int NOT NULL,
  KEY `user_id_idx` (`user_id`),
  KEY `vacation_id_idx` (`vacation_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_vacation_id` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (14,39),(14,36),(14,35),(14,46);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'David','Veryutin','davids199005@gmail.com','$2b$10$P8jQj1Yd4AqHF0zNdulNjukfeo8lELVM44Z.FG20ivemDTTysJcuC','admin',NULL),(15,'Admin','User','admin2@test.com','$2b$10$IcZ/.xpcpbs/HMKzE4.bO.JN4B5Mmug1TOOawozSRALmKkJDRShi6','user',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (35,'Paris, France','Explore the City of Light with visits to the Eiffel Tower, Louvre Museum, and charming Montmartre streets. Enjoy world-class cuisine and romantic Seine river cruises.','2025-11-30','2025-12-09',2800.00,'1773748182817-1zouxsowcmg.jpg'),(36,'Tokyo, Japan','Discover the perfect blend of ancient temples and futuristic technology. Visit Shibuya crossing, Senso-ji temple, and taste authentic ramen in hidden alleyways.','2025-11-13','2025-11-26',3500.00,'1773748203135-1ogwox54mkd.jpg'),(37,'New York, USA','Experience the city that never sleeps. Broadway shows, Central Park walks, Statue of Liberty, and the best pizza you will ever taste.','2026-01-04','2026-01-14',3200.00,'1773748192750-j0wezp3mos.jpg'),(38,'Rome, Italy','Walk through thousands of years of history. The Colosseum, Vatican City, Trevi Fountain, and incredible Italian gelato await you in the Eternal City.','2026-01-19','2026-01-31',2500.00,'1773748215739-l9ps39qkp3p.jpg'),(39,'Barcelona, Spain','Gaudi architecture, La Rambla strolls, tapas bars, and beautiful Mediterranean beaches. Barcelona offers art, culture, and nightlife like nowhere else.','2025-10-08','2025-10-18',2200.00,'1773875501394-b3nr0y1y50u.jpg'),(40,'London, England','Royal palaces, world-class museums, West End theatre, and traditional pubs. Explore Big Ben, Tower Bridge, and the vibrant neighborhoods of Camden and Shoreditch.','2026-01-31','2026-02-11',2900.00,'1773748227492-js4u5qvktf.jpg'),(41,'Bali, Indonesia','Tropical paradise with stunning rice terraces, ancient temples, and pristine beaches. Perfect for yoga retreats, surfing, and exploring vibrant local markets.','2026-02-28','2026-03-24',1800.00,'1773748236252-uk7pd6l4i8.jpg'),(42,'Maldives','Overwater bungalows, crystal-clear turquoise waters, and world-class snorkeling. The ultimate luxury beach escape with stunning coral reefs and marine life.','2026-03-04','2026-03-19',5500.00,'1773748259150-spst2mge548.jpg'),(43,'Dubai, UAE','Futuristic skyscrapers, luxury shopping, desert safaris, and golden beaches. Visit the Burj Khalifa, Dubai Mall, and experience the opulence of the Arabian Gulf.','2026-03-09','2026-03-21',4200.00,'1773748432575-bk6hl4sp734.jpg'),(44,'Cancun, Mexico','White sand beaches, ancient Mayan ruins, cenotes, and vibrant nightlife. Swim in turquoise Caribbean waters and explore the underwater museum of art.','2026-03-07','2026-03-23',2100.00,'1773748271228-4r7awq1z6ce.jpg'),(45,'Santorini, Greece','Iconic white-washed buildings with blue domes overlooking the Aegean Sea. Breathtaking sunsets, volcanic beaches, and delicious Mediterranean cuisine.','2026-03-11','2026-03-25',3100.00,'1773748296561-jousregl1oj.jpg'),(46,'Phuket, Thailand','Stunning beaches, vibrant night markets, Buddhist temples, and world-renowned Thai cuisine. Island hopping, elephant sanctuaries, and affordable luxury.','2026-03-01','2026-03-17',1500.00,'1773748248612-n8c2a6lv59c.jpg'),(47,'Swiss Alps, Switzerland','Majestic mountain scenery, world-class skiing, charming alpine villages, and scenic train rides. Fondue, chocolate, and breathtaking panoramic views await.','2026-05-31','2026-06-13',4800.00,'1773748327470-i5ybxrkwn0q.jpg'),(48,'Machu Picchu, Peru','Trek the legendary Inca Trail to the ancient citadel in the clouds. Explore Cusco, the Sacred Valley, and immerse yourself in rich Andean culture.','2026-05-09','2026-05-21',3800.00,'1773748317365-d2v4au3e09.jpg'),(49,'Safari, Kenya','Witness the Great Migration in the Masai Mara. Lions, elephants, giraffes in their natural habitat. Luxury safari lodges and unforgettable sunrises over the savanna.','2026-06-30','2026-07-11',5200.00,'1773748336529-02atxoai02fd.jpg'),(50,'Amalfi Coast, Italy','Dramatic coastal cliffs, colorful villages perched above the sea, and the best limoncello in the world. Drive the winding coastal road and swim in hidden coves.','2026-08-04','2026-08-17',3600.00,'1773748344442-9678tc0t8dj.jpg'),(51,'Iceland','Northern lights, volcanic landscapes, hot springs, and glaciers. Drive the Golden Circle, visit the Blue Lagoon, and witness the raw power of nature.','2026-08-31','2026-09-11',4100.00,'1773748353522-5ws4ifuja3t.jpg'),(52,'Kyoto, Japan','Ancient capital of Japan with thousands of temples, bamboo forests, traditional tea ceremonies, and stunning autumn foliage. Experience authentic Japanese culture.','2026-03-31','2026-04-13',3300.00,'1773748305423-xwkv5key2x.jpg'),(53,'Haifa, Israel','Haifa is the largest city in northern Israel and the country\'s third-largest urban center, with a population of approximately 295,000 as of late 2025. Known as a global hub for coexistence between its Jewish (72%) and Arab (12%) residents, it is famously described by the local saying: \"Jerusalem prays, Tel Aviv plays, and Haifa works\"','2026-08-18','2026-08-30',2300.00,'1773872512002-ix4vl73zsx.jpg'),(54,'Madrid,Spain','Madrid is the capital of Spain and has been voted the European Best Destination 2026 by over 1.3 million travelers. As of early 2026, the city proper has a population of approximately 3.4 million, while the broader Community of Madrid is home to roughly 7.2 million people','2026-05-05','2026-05-10',1300.00,'1773872617973-90kt4ncwtof.jpg'),(55,'Moscow,Russia','Moscow, founded in 1147, is Europe\'s most populous city (over 19 million) and a massive northern megacity. It features the world\'s largest medieval fortress (the Kremlin), the deepest metro station (84m), and some of Europe’s tallest skyscrapers. The city offers a unique mix of history, with thousands of old alleyways and 2,700+ restaurants','2026-09-13','2026-09-20',6000.00,'1773872787919-1zs02r6b7ab.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'vacanza'
--

--
-- Dumping routines for database 'vacanza'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-22 11:32:03
