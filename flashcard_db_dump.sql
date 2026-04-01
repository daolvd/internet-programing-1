-- MySQL dump 10.13  Distrib 8.4.8, for Linux (aarch64)
--
-- Host: localhost    Database: flashcard_db
-- ------------------------------------------------------
-- Server version	8.4.8

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
-- Current Database: `flashcard_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `flashcard_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `flashcard_db`;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `deck_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6k0or7dj9m5qhnshnk9fpg8r1` (`deck_id`),
  CONSTRAINT `FK6k0or7dj9m5qhnshnk9fpg8r1` FOREIGN KEY (`deck_id`) REFERENCES `deck` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=342 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (1,'2026-03-28 17:27:52.459831','2026-03-28 17:27:52.459831','2121','1212','Don\'t know',2),(2,'2026-03-28 17:27:52.479564','2026-03-28 17:27:52.479564','2121','2121','Don\'t know',2),(3,'2026-03-28 17:27:52.492233','2026-03-28 17:27:52.492233','2121','2121','Don\'t know',2),(230,'2026-03-30 06:59:42.986504','2026-03-30 06:59:42.986504','Good morning.','How do you greet someone in the morning?','new',34),(231,'2026-03-30 06:59:42.990774','2026-03-30 06:59:42.990774','Are you okay?','How do you ask someone if they are okay?','new',34),(232,'2026-03-30 06:59:42.995203','2026-03-30 06:59:42.995203','You are welcome.','How do you respond to \'Thank you\'?','new',34),(233,'2026-03-30 06:59:42.998996','2026-03-30 06:59:42.998996','Could you say that again?','How do you politely ask for repetition?','new',34),(234,'2026-03-30 06:59:43.003250','2026-03-30 06:59:43.003250','Excuse me, where is ...?','How do you ask for directions?','new',34),(235,'2026-03-30 06:59:43.005592','2026-03-30 06:59:43.005592','What time is it?','How do you ask the time?','new',34),(236,'2026-03-30 06:59:43.009475','2026-03-30 06:59:43.009475','See you later.','How do you say goodbye casually?','new',34),(237,'2026-03-30 06:59:43.011844','2026-03-30 06:59:43.011844','Can you help me, please?','How do you ask for help?','new',34),(238,'2026-03-30 06:59:43.014193','2026-03-30 06:59:43.014193','I agree.','How do you agree in conversation?','new',34),(239,'2026-03-30 06:59:43.017789','2026-03-30 06:59:43.017789','I am not sure I agree.','How do you disagree politely?','new',34),(240,'2026-03-30 06:59:43.030733','2026-03-30 06:59:43.030733','Dear [Name],','What is a formal email opening?','new',35),(241,'2026-03-30 06:59:43.034268','2026-03-30 06:59:43.034268','I am writing to...','How do you state email purpose briefly?','new',35),(242,'2026-03-30 06:59:43.036947','2026-03-30 06:59:43.036947','Could we schedule a meeting?','How do you request a meeting?','new',35),(243,'2026-03-30 06:59:43.039203','2026-03-30 06:59:43.039203','Please find the attachment.','How do you attach a file politely?','new',35),(244,'2026-03-30 06:59:43.041321','2026-03-30 06:59:43.041321','Please confirm receipt.','How do you ask for confirmation?','new',35),(245,'2026-03-30 06:59:43.043870','2026-03-30 06:59:43.043870','I am following up on...','How do you follow up on pending work?','new',35),(246,'2026-03-30 06:59:43.045764','2026-03-30 06:59:43.045764','Best regards,','How do you close an email professionally?','new',35),(247,'2026-03-30 06:59:43.048167','2026-03-30 06:59:43.048167','The deadline is [date].','How do you mention a deadline?','new',35),(248,'2026-03-30 06:59:43.050621','2026-03-30 06:59:43.050621','I apologize for the delay.','How do you apologize for delay?','new',35),(249,'2026-03-30 06:59:43.052693','2026-03-30 06:59:43.052693','Thank you for your support.','How do you thank a colleague in email?','new',35),(250,'2026-03-30 06:59:43.062828','2026-03-30 06:59:43.062828','Where is the check-in counter?','How do you ask airport check-in counter location?','new',36),(251,'2026-03-30 06:59:43.064661','2026-03-30 06:59:43.064661','How much is the fare?','How do you ask taxi fare estimate?','new',36),(252,'2026-03-30 06:59:43.066541','2026-03-30 06:59:43.066541','I have a reservation under [name].','How do you ask for hotel check-in?','new',36),(253,'2026-03-30 06:59:43.068666','2026-03-30 06:59:43.068666','Do you accept credit cards?','How do you ask if card payment is accepted?','new',36),(254,'2026-03-30 06:59:43.070203','2026-03-30 06:59:43.070203','What places do you recommend?','How do you ask for local recommendation?','new',36),(255,'2026-03-30 06:59:43.072677','2026-03-30 06:59:43.072677','Where is the restroom?','How do you ask where the restroom is?','new',36),(256,'2026-03-30 06:59:43.075854','2026-03-30 06:59:43.075854','What do you recommend here?','How do you ask for menu recommendation?','new',36),(257,'2026-03-30 06:59:43.077990','2026-03-30 06:59:43.077990','What is the Wi-Fi password?','How do you ask for Wi-Fi password?','new',36),(258,'2026-03-30 06:59:43.079850','2026-03-30 06:59:43.079850','Can we split the bill?','How do you ask to split bill?','new',36),(259,'2026-03-30 06:59:43.081718','2026-03-30 06:59:43.081718','Please call an ambulance.','How do you ask emergency help?','new',36),(260,'2026-03-30 06:59:43.094477','2026-03-30 06:59:43.094477','class','What keyword creates a class in Java?','new',37),(261,'2026-03-30 06:59:43.096280','2026-03-30 06:59:43.096280','public static void main(String[] args)','What method is the Java entry point?','new',37),(262,'2026-03-30 06:59:43.098087','2026-03-30 06:59:43.098087','extends','What keyword is used for inheritance?','new',37),(263,'2026-03-30 06:59:43.113923','2026-03-30 06:59:43.113923','new','What keyword creates an object?','new',37),(264,'2026-03-30 06:59:43.116354','2026-03-30 06:59:43.116354','Java Virtual Machine','What is JVM short for?','new',37),(265,'2026-03-30 06:59:43.118321','2026-03-30 06:59:43.118321','Set','Which collection stores unique values?','new',37),(266,'2026-03-30 06:59:43.121406','2026-03-30 06:59:43.121406','Its value cannot be reassigned.','What does final mean for a variable?','new',37),(267,'2026-03-30 06:59:43.123781','2026-03-30 06:59:43.123781','A contract of methods without implementation details.','What does interface define?','new',37),(268,'2026-03-30 06:59:43.126616','2026-03-30 06:59:43.126616','Checked exception','What exception type is checked at compile time?','new',37),(269,'2026-03-30 06:59:43.128668','2026-03-30 06:59:43.128668','A method overrides a parent method.','What does @Override indicate?','new',37),(270,'2026-03-30 06:59:43.137138','2026-03-30 06:59:43.137138','SELECT','SQL command to read data?','new',38),(271,'2026-03-30 06:59:43.139205','2026-03-30 06:59:43.139205','INSERT','SQL command to insert a row?','new',38),(272,'2026-03-30 06:59:43.141001','2026-03-30 06:59:43.141001','Filters rows by condition.','What does WHERE clause do?','new',38),(273,'2026-03-30 06:59:43.143341','2026-03-30 06:59:43.143341','A unique identifier for each row.','What is a primary key?','new',38),(274,'2026-03-30 06:59:43.145081','2026-03-30 06:59:43.145081','A reference to a primary key in another table.','What is a foreign key?','new',38),(275,'2026-03-30 06:59:43.146624','2026-03-30 06:59:43.146624','Combines rows from related tables.','What does JOIN do?','new',38),(276,'2026-03-30 06:59:43.149087','2026-03-30 06:59:43.149087','Query performance.','What does index improve?','new',38),(277,'2026-03-30 06:59:43.151099','2026-03-30 06:59:43.151099','Reliable and consistent database operations.','What does transaction ACID guarantee?','new',38),(278,'2026-03-30 06:59:43.152807','2026-03-30 06:59:43.152807','DELETE removes selected rows; TRUNCATE removes all rows quickly.','Difference between DELETE and TRUNCATE?','new',38),(279,'2026-03-30 06:59:43.154402','2026-03-30 06:59:43.154402','Organizing data to reduce redundancy.','What is normalization?','new',38),(280,'2026-03-30 06:59:43.161774','2026-03-30 06:59:43.161774','GET','HTTP method for reading data?','new',39),(281,'2026-03-30 06:59:43.163496','2026-03-30 06:59:43.163496','POST','HTTP method for creating resource?','new',39),(282,'2026-03-30 06:59:43.166065','2026-03-30 06:59:43.166065','PUT','HTTP method for full update?','new',39),(283,'2026-03-30 06:59:43.167694','2026-03-30 06:59:43.167694','DELETE','HTTP method for delete?','new',39),(284,'2026-03-30 06:59:43.169256','2026-03-30 06:59:43.169256','200 OK','What status code means success?','new',39),(285,'2026-03-30 06:59:43.171119','2026-03-30 06:59:43.171119','201 Created','What status code means created?','new',39),(286,'2026-03-30 06:59:43.173427','2026-03-30 06:59:43.173427','404 Not Found','What status code means not found?','new',39),(287,'2026-03-30 06:59:43.176022','2026-03-30 06:59:43.176022','401 Unauthorized','What status code means unauthorized?','new',39),(288,'2026-03-30 06:59:43.177894','2026-03-30 06:59:43.177894','Data exchange format.','What is JSON used for in APIs?','new',39),(289,'2026-03-30 06:59:43.180003','2026-03-30 06:59:43.180003','Stateless authentication token.','What is JWT used for?','new',39),(290,'2026-03-30 06:59:43.192004','2026-03-30 06:59:43.192004','Tokyo','Capital of Japan?','new',40),(291,'2026-03-30 06:59:43.194150','2026-03-30 06:59:43.194150','Paris','Capital of France?','new',40),(292,'2026-03-30 06:59:43.196754','2026-03-30 06:59:43.196754','Canberra','Capital of Australia?','new',40),(293,'2026-03-30 06:59:43.198998','2026-03-30 06:59:43.198998','Ottawa','Capital of Canada?','new',40),(294,'2026-03-30 06:59:43.202047','2026-03-30 06:59:43.202047','Berlin','Capital of Germany?','new',40),(295,'2026-03-30 06:59:43.204181','2026-03-30 06:59:43.204181','Seoul','Capital of South Korea?','new',40),(296,'2026-03-30 06:59:43.205918','2026-03-30 06:59:43.205918','Brasilia','Capital of Brazil?','new',40),(297,'2026-03-30 06:59:43.208456','2026-03-30 06:59:43.208456','Bangkok','Capital of Thailand?','new',40),(298,'2026-03-30 06:59:43.210523','2026-03-30 06:59:43.210523','Jakarta','Capital of Indonesia?','new',40),(299,'2026-03-30 06:59:43.212634','2026-03-30 06:59:43.212634','Hanoi','Capital of Vietnam?','new',40),(300,'2026-03-30 06:59:43.220477','2026-03-30 06:59:43.220477','Heart','Which organ pumps blood?','new',41),(301,'2026-03-30 06:59:43.222203','2026-03-30 06:59:43.222203','Lungs','Which organ helps us breathe?','new',41),(302,'2026-03-30 06:59:43.224186','2026-03-30 06:59:43.224186','Skin','Largest human organ?','new',41),(303,'2026-03-30 06:59:43.225616','2026-03-30 06:59:43.225616','Skull','Bone that protects the brain?','new',41),(304,'2026-03-30 06:59:43.227060','2026-03-30 06:59:43.227060','Red blood cells','What carries oxygen in blood?','new',41),(305,'2026-03-30 06:59:43.228608','2026-03-30 06:59:43.228608','Small intestine','Where is food primarily digested?','new',41),(306,'2026-03-30 06:59:43.229986','2026-03-30 06:59:43.229986','Brain','What controls body movement and thought?','new',41),(307,'2026-03-30 06:59:43.231756','2026-03-30 06:59:43.231756','Around 37 C','What is the normal body temperature in Celsius?','new',41),(308,'2026-03-30 06:59:43.233045','2026-03-30 06:59:43.233045','Vitamin D','What vitamin is produced from sunlight?','new',41),(309,'2026-03-30 06:59:43.234562','2026-03-30 06:59:43.234562','Immune system','What system fights infection?','new',41),(310,'2026-03-30 06:59:43.241635','2026-03-30 06:59:43.241635','Mars','Planet known as the Red Planet?','new',42),(311,'2026-03-30 06:59:43.244980','2026-03-30 06:59:43.244980','The Sun','Closest star to Earth?','new',42),(312,'2026-03-30 06:59:43.246928','2026-03-30 06:59:43.246928','Earth rotation','What causes day and night?','new',42),(313,'2026-03-30 06:59:43.249013','2026-03-30 06:59:43.249013','Earth tilt and orbit around the Sun','What causes seasons?','new',42),(314,'2026-03-30 06:59:43.251968','2026-03-30 06:59:43.251968','Jupiter','Largest planet in our solar system?','new',42),(315,'2026-03-30 06:59:43.254653','2026-03-30 06:59:43.254653','Moon','Natural satellite of Earth?','new',42),(316,'2026-03-30 06:59:43.256782','2026-03-30 06:59:43.256782','Our galaxy','What is the Milky Way?','new',42),(317,'2026-03-30 06:59:43.260407','2026-03-30 06:59:43.260407','Magnetic field and atmosphere','What protects Earth from harmful solar radiation?','new',42),(318,'2026-03-30 06:59:43.262328','2026-03-30 06:59:43.262328','When one celestial body blocks another\'s light','What is an eclipse?','new',42),(319,'2026-03-30 06:59:43.264407','2026-03-30 06:59:43.264407','About 4.5 billion years','Approximate age of Earth?','new',42),(320,'2026-03-30 09:10:27.807706','2026-03-30 09:10:27.807706','class','What keyword creates a class in Java?','new',45),(321,'2026-03-30 09:10:27.811025','2026-03-30 09:10:27.811025','public static void main(String[] args)','What method is the Java entry point?','new',45),(322,'2026-03-30 09:10:27.812980','2026-03-30 09:10:27.812980','extends','What keyword is used for inheritance?','new',45),(323,'2026-03-30 09:10:27.814821','2026-03-30 09:10:27.814821','new','What keyword creates an object?','new',45),(324,'2026-03-30 09:10:27.816731','2026-03-30 09:10:27.816731','Java Virtual Machine','What is JVM short for?','new',45),(325,'2026-03-30 09:10:27.818590','2026-03-30 09:10:27.818590','Set','Which collection stores unique values?','new',45),(326,'2026-03-30 09:10:27.820232','2026-03-30 09:10:27.820232','Its value cannot be reassigned.','What does final mean for a variable?','new',45),(327,'2026-03-30 09:10:27.822185','2026-03-30 09:10:27.822185','A contract of methods without implementation details.','What does interface define?','new',45),(328,'2026-03-30 09:10:27.823911','2026-03-30 09:10:27.823911','Checked exception','What exception type is checked at compile time?','new',45),(329,'2026-03-30 09:10:27.825796','2026-03-30 09:10:27.825796','A method overrides a parent method.','What does @Override indicate?','new',45),(330,'2026-03-30 09:10:27.832355','2026-03-30 09:10:27.832355','SELECT','SQL command to read data?','new',46),(331,'2026-03-30 09:10:27.833850','2026-03-30 09:10:27.833850','INSERT','SQL command to insert a row?','new',46),(332,'2026-03-30 09:10:27.835407','2026-03-30 09:10:27.835407','Filters rows by condition.','What does WHERE clause do?','new',46),(333,'2026-03-30 09:10:27.837029','2026-03-30 09:10:27.837029','A unique identifier for each row.','What is a primary key?','new',46),(334,'2026-03-30 09:10:27.838595','2026-03-30 09:10:27.838595','A reference to a primary key in another table.','What is a foreign key?','new',46),(335,'2026-03-30 09:10:27.840252','2026-03-30 09:10:27.840252','Combines rows from related tables.','What does JOIN do?','new',46),(336,'2026-03-30 09:10:27.841861','2026-03-30 09:10:27.841861','Query performance.','What does index improve?','new',46),(337,'2026-03-30 09:10:27.843346','2026-03-30 09:10:27.843346','Reliable and consistent database operations.','What does transaction ACID guarantee?','new',46),(338,'2026-03-30 09:10:27.844779','2026-03-30 09:10:27.844779','DELETE removes selected rows; TRUNCATE removes all rows quickly.','Difference between DELETE and TRUNCATE?','new',46),(339,'2026-03-30 09:10:27.846224','2026-03-30 09:10:27.846224','Organizing data to reduce redundancy.','What is normalization?','new',46);
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_review`
--

DROP TABLE IF EXISTS `card_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `is_correct` bit(1) NOT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `response_time_ms` bigint DEFAULT NULL,
  `review_at` bigint DEFAULT NULL,
  `card_id` bigint DEFAULT NULL,
  `study_session_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3kq09m7p65ra3viay42sukx6b` (`card_id`),
  KEY `FKna07okcn1qin52tbvrcoymbuv` (`study_session_id`),
  CONSTRAINT `FK3kq09m7p65ra3viay42sukx6b` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`),
  CONSTRAINT `FKna07okcn1qin52tbvrcoymbuv` FOREIGN KEY (`study_session_id`) REFERENCES `study_session` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_review`
--

LOCK TABLES `card_review` WRITE;
/*!40000 ALTER TABLE `card_review` DISABLE KEYS */;
INSERT INTO `card_review` VALUES (67,'2026-03-30 09:04:16.382887','2026-03-30 09:04:16.382887',_binary '\0','again',2882,1774861456348,280,31),(68,'2026-03-30 09:04:16.392040','2026-03-30 09:04:16.392040',_binary '\0','again',683,1774861456348,281,31),(69,'2026-03-30 09:04:16.393694','2026-03-30 09:04:16.393694',_binary '\0','again',595,1774861456348,282,31),(70,'2026-03-30 09:04:16.395010','2026-03-30 09:04:16.395010',_binary '\0','again',548,1774861456348,283,31),(71,'2026-03-30 09:04:16.396133','2026-03-30 09:04:16.396133',_binary '\0','again',525,1774861456348,284,31),(72,'2026-03-30 09:04:16.397257','2026-03-30 09:04:16.397257',_binary '\0','again',394,1774861456348,285,31),(73,'2026-03-31 07:20:44.230734','2026-03-31 07:20:44.230734',_binary '','good',1338,1774941644204,260,32),(74,'2026-03-31 07:36:52.367836','2026-03-31 07:36:52.367836',_binary '','good',1805,1774942612291,310,33),(75,'2026-03-31 07:36:52.370221','2026-03-31 07:36:52.370221',_binary '\0','again',9959,1774942612291,310,33),(76,'2026-03-31 07:36:52.372060','2026-03-31 07:36:52.372060',_binary '\0','again',1004,1774942612291,311,33),(77,'2026-03-31 07:36:52.374276','2026-03-31 07:36:52.374276',_binary '\0','again',721,1774942612291,312,33),(78,'2026-03-31 07:36:52.376274','2026-03-31 07:36:52.376274',_binary '\0','again',346,1774942612291,313,33),(79,'2026-03-31 07:36:52.378829','2026-03-31 07:36:52.378829',_binary '\0','again',372,1774942612291,314,33),(80,'2026-03-31 07:36:52.381135','2026-03-31 07:36:52.381135',_binary '\0','again',406,1774942612291,315,33),(81,'2026-03-31 07:36:52.383984','2026-03-31 07:36:52.383984',_binary '\0','again',224,1774942612291,316,33),(82,'2026-03-31 07:36:52.386439','2026-03-31 07:36:52.386439',_binary '\0','again',240,1774942612291,317,33),(83,'2026-03-31 07:36:52.389618','2026-03-31 07:36:52.389618',_binary '\0','again',207,1774942612291,317,33),(84,'2026-03-31 07:36:52.392904','2026-03-31 07:36:52.392904',_binary '\0','again',705,1774942612291,318,33),(85,'2026-03-31 07:36:58.140715','2026-03-31 07:36:58.140715',_binary '','good',1805,1774942618073,310,34),(86,'2026-03-31 07:36:58.142601','2026-03-31 07:36:58.142601',_binary '\0','again',9959,1774942618073,310,34),(87,'2026-03-31 07:36:58.143693','2026-03-31 07:36:58.143693',_binary '\0','again',1004,1774942618073,311,34),(88,'2026-03-31 07:36:58.144395','2026-03-31 07:36:58.144395',_binary '\0','again',721,1774942618073,312,34),(89,'2026-03-31 07:36:58.144961','2026-03-31 07:36:58.144961',_binary '\0','again',346,1774942618073,313,34),(90,'2026-03-31 07:36:58.145575','2026-03-31 07:36:58.145575',_binary '\0','again',372,1774942618073,314,34),(91,'2026-03-31 07:36:58.147198','2026-03-31 07:36:58.147198',_binary '\0','again',406,1774942618073,315,34),(92,'2026-03-31 07:36:58.148852','2026-03-31 07:36:58.148852',_binary '\0','again',224,1774942618073,316,34),(93,'2026-03-31 07:36:58.149802','2026-03-31 07:36:58.149802',_binary '\0','again',240,1774942618073,317,34),(94,'2026-03-31 07:36:58.151197','2026-03-31 07:36:58.151197',_binary '\0','again',207,1774942618073,317,34),(95,'2026-03-31 07:36:58.152218','2026-03-31 07:36:58.152218',_binary '\0','again',705,1774942618073,318,34),(96,'2026-03-31 07:36:58.153258','2026-03-31 07:36:58.153258',_binary '\0','again',1058,1774942618073,319,34),(97,'2026-03-31 08:28:46.613607','2026-03-31 08:28:46.613607',_binary '','easy',8651,1774945726557,260,35),(98,'2026-03-31 08:28:46.617606','2026-03-31 08:28:46.617606',_binary '','good',7708,1774945726557,261,35),(99,'2026-03-31 08:28:46.619926','2026-03-31 08:28:46.619926',_binary '\0','again',888,1774945726557,262,35),(100,'2026-03-31 08:28:46.621473','2026-03-31 08:28:46.621473',_binary '\0','again',661,1774945726557,263,35),(101,'2026-03-31 08:28:46.622607','2026-03-31 08:28:46.622607',_binary '\0','again',542,1774945726557,264,35),(102,'2026-03-31 08:28:46.623835','2026-03-31 08:28:46.623835',_binary '\0','again',511,1774945726557,265,35),(103,'2026-03-31 08:28:46.624933','2026-03-31 08:28:46.624933',_binary '\0','again',486,1774945726557,266,35),(104,'2026-03-31 08:28:46.625835','2026-03-31 08:28:46.625835',_binary '\0','again',1012,1774945726557,267,35),(105,'2026-03-31 08:28:46.626447','2026-03-31 08:28:46.626447',_binary '\0','again',746,1774945726557,268,35),(106,'2026-03-31 08:28:50.388824','2026-03-31 08:28:50.388824',_binary '','easy',8651,1774945730328,260,36),(107,'2026-03-31 08:28:50.390354','2026-03-31 08:28:50.390354',_binary '','good',7708,1774945730328,261,36),(108,'2026-03-31 08:28:50.391441','2026-03-31 08:28:50.391441',_binary '\0','again',888,1774945730328,262,36),(109,'2026-03-31 08:28:50.392854','2026-03-31 08:28:50.392854',_binary '\0','again',661,1774945730328,263,36),(110,'2026-03-31 08:28:50.394123','2026-03-31 08:28:50.394123',_binary '\0','again',542,1774945730328,264,36),(111,'2026-03-31 08:28:50.395189','2026-03-31 08:28:50.395189',_binary '\0','again',511,1774945730328,265,36),(112,'2026-03-31 08:28:50.395848','2026-03-31 08:28:50.395848',_binary '\0','again',486,1774945730328,266,36),(113,'2026-03-31 08:28:50.397048','2026-03-31 08:28:50.397048',_binary '\0','again',1012,1774945730328,267,36),(114,'2026-03-31 08:28:50.397769','2026-03-31 08:28:50.397769',_binary '\0','again',746,1774945730328,268,36),(115,'2026-03-31 08:28:50.398500','2026-03-31 08:28:50.398500',_binary '\0','again',596,1774945730328,269,36),(116,'2026-03-31 09:23:12.584014','2026-03-31 09:23:12.584014',_binary '\0','again',2386,1774948992503,260,37),(117,'2026-03-31 09:23:12.587147','2026-03-31 09:23:12.587147',_binary '\0','again',210,1774948992503,260,37),(118,'2026-03-31 09:23:12.589425','2026-03-31 09:23:12.589425',_binary '\0','again',434,1774948992503,261,37),(119,'2026-03-31 09:23:12.591167','2026-03-31 09:23:12.591167',_binary '\0','again',204,1774948992503,261,37),(120,'2026-03-31 09:23:12.592465','2026-03-31 09:23:12.592465',_binary '\0','again',421,1774948992503,262,37),(121,'2026-03-31 09:23:12.593832','2026-03-31 09:23:12.593832',_binary '\0','again',211,1774948992503,262,37),(122,'2026-03-31 09:23:12.595301','2026-03-31 09:23:12.595301',_binary '\0','again',420,1774948992503,263,37),(123,'2026-03-31 09:23:12.597031','2026-03-31 09:23:12.597031',_binary '\0','again',191,1774948992503,263,37),(124,'2026-03-31 09:23:12.599254','2026-03-31 09:23:12.599254',_binary '\0','again',586,1774948992503,264,37),(125,'2026-03-31 09:23:12.601098','2026-03-31 09:23:12.601098',_binary '\0','again',188,1774948992503,264,37),(126,'2026-04-01 07:14:17.323074','2026-04-01 07:14:17.323074',_binary '','good',629,1775027657307,263,38);
/*!40000 ALTER TABLE `card_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ffrpnxaflomhdh0qfk2jcndo` (`user_id`),
  CONSTRAINT `FK7ffrpnxaflomhdh0qfk2jcndo` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'2026-03-28 15:19:51.601145','2026-03-28 15:19:51.601145','General',1),(3,'2026-03-28 17:04:21.263039','2026-03-28 17:04:21.263039','General',5),(4,'2026-03-28 17:10:33.620121','2026-03-28 17:10:33.620121','General',6),(5,'2026-03-28 17:11:03.394352','2026-03-28 17:11:03.394352','General',7),(8,'2026-03-28 17:29:07.499514','2026-03-28 17:29:07.499514','dsdsds',7),(9,'2026-03-28 17:30:29.565169','2026-03-28 17:30:29.565169','ádsds',7),(11,'2026-03-28 17:32:33.397822','2026-03-28 17:32:33.397822','dsdsds',7),(12,'2026-03-28 18:00:20.577896','2026-03-28 18:00:20.577896','General',8),(13,'2026-03-28 18:00:55.029726','2026-03-28 18:00:55.029726','General',9),(14,'2026-03-28 18:07:57.749997','2026-03-28 18:07:57.749997','Test 2',9),(15,'2026-03-29 05:16:27.846458','2026-03-29 05:16:27.846458','General',10),(16,'2026-03-29 05:20:41.132374','2026-03-29 05:20:41.132374','General',11),(22,'2026-03-30 06:59:42.931242','2026-03-30 06:59:42.931242','English',11),(23,'2026-03-30 06:59:43.086635','2026-03-30 06:59:43.086635','Computer Science',11),(24,'2026-03-30 06:59:43.184928','2026-03-30 06:59:43.184928','General Knowledge',11);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deck`
--

DROP TABLE IF EXISTS `deck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deck` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp9mag3654d10bc1m49su5cwst` (`category_id`),
  CONSTRAINT `FKp9mag3654d10bc1m49su5cwst` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deck`
--

LOCK TABLES `deck` WRITE;
/*!40000 ALTER TABLE `deck` DISABLE KEYS */;
INSERT INTO `deck` VALUES (1,'2026-03-28 17:27:40.582266','2026-03-28 17:59:44.779931','sdsds',9),(2,'2026-03-28 17:27:52.428984','2026-03-28 17:59:36.975972','djdsds',8),(3,'2026-03-28 18:07:49.990316','2026-03-28 18:08:34.745357','Test 1',14),(34,'2026-03-30 06:59:42.976915','2026-03-30 06:59:42.976915','Daily Conversation',22),(35,'2026-03-30 06:59:43.023723','2026-03-30 06:59:43.023723','Business Email',22),(36,'2026-03-30 06:59:43.058325','2026-03-30 06:59:43.058325','Travel Phrases',22),(37,'2026-03-30 06:59:43.090182','2026-03-30 09:15:16.396545','Java Basics',16),(38,'2026-03-30 06:59:43.133138','2026-03-30 09:15:16.436379','Database Essentials',16),(39,'2026-03-30 06:59:43.158481','2026-03-30 06:59:43.158481','Web API Concepts',23),(40,'2026-03-30 06:59:43.188198','2026-03-30 06:59:43.188198','World Capitals',24),(41,'2026-03-30 06:59:43.216661','2026-03-30 06:59:43.216661','Human Body Basics',24),(42,'2026-03-30 06:59:43.238198','2026-03-30 06:59:43.238198','Earth and Space',24),(43,'2026-03-30 08:30:54.829421','2026-03-30 08:30:54.829421','ddddđa11',22),(45,'2026-03-30 09:10:27.781175','2026-03-30 09:10:27.781175','Java Basics',23),(46,'2026-03-30 09:10:27.829550','2026-03-30 09:10:27.829550','Database Essentials',23);
/*!40000 ALTER TABLE `deck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_session`
--

DROP TABLE IF EXISTS `study_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_session` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `deck_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoep8t449qbs2jrrmnphddt4pb` (`deck_id`),
  KEY `FK3bkr0f6m9dbckmbh3yt4dcpwd` (`user_id`),
  CONSTRAINT `FK3bkr0f6m9dbckmbh3yt4dcpwd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKoep8t449qbs2jrrmnphddt4pb` FOREIGN KEY (`deck_id`) REFERENCES `deck` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_session`
--

LOCK TABLES `study_session` WRITE;
/*!40000 ALTER TABLE `study_session` DISABLE KEYS */;
INSERT INTO `study_session` VALUES (31,'2026-03-30 09:04:16.315270','2026-03-30 09:04:16.315270','2026-03-30 09:04:16.229000','2026-03-30 09:03:42.737000',39,11),(32,'2026-03-31 07:20:44.130137','2026-03-31 07:20:44.130137','2026-03-31 07:20:44.024000','2026-03-31 07:20:21.227000',37,11),(33,'2026-03-31 07:36:52.257760','2026-03-31 07:36:52.257760','2026-03-31 07:36:52.172000','2026-03-31 07:36:09.437000',42,11),(34,'2026-03-31 07:36:58.050132','2026-03-31 07:36:58.050132','2026-03-31 07:36:57.995000','2026-03-31 07:36:54.176000',42,11),(35,'2026-03-31 08:28:46.522933','2026-03-31 08:28:46.522933','2026-03-31 08:28:46.450000','2026-03-31 08:28:33.834000',37,11),(36,'2026-03-31 08:28:50.315236','2026-03-31 08:28:50.315236','2026-03-31 08:28:50.267000','2026-03-31 08:28:48.868000',37,11),(37,'2026-03-31 09:23:12.472057','2026-03-31 09:23:12.472057','2026-03-31 09:23:12.433000','2026-03-31 09:23:10.029000',37,11),(38,'2026-04-01 07:14:17.250514','2026-04-01 07:14:17.250514','2026-04-01 07:14:17.182000','2026-04-01 07:14:09.583000',37,11);
/*!40000 ALTER TABLE `study_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `client_seed` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKfh1531vbkdlgs54hwvo2ep8ut` (`client_seed`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-03-28 15:19:51.565924','2026-03-28 15:19:51.565924','sample-2',NULL,NULL),(5,'2026-03-28 17:04:21.220604','2026-03-28 17:04:21.220604','141fef49-8659-4604-8241-be872d577a73',NULL,NULL),(6,'2026-03-28 17:10:33.602795','2026-03-28 17:10:33.602795','532d1abd-10bc-4c04-8df5-0f58984b88b0',NULL,NULL),(7,'2026-03-28 17:11:03.386201','2026-03-28 17:11:03.386201','5176d1bf-f782-4ce7-9345-6667b84ff5c9',NULL,NULL),(8,'2026-03-28 18:00:20.553544','2026-03-28 18:00:20.553544','f2cffee8-ee34-4ede-a024-17974710ff08',NULL,NULL),(9,'2026-03-28 18:00:55.020636','2026-03-28 18:00:55.020636','a8d13bfc-f284-4d7c-83ef-3b0dc5f3de50',NULL,NULL),(10,'2026-03-29 05:16:27.811985','2026-03-29 05:16:27.811985','ac884d54-9b50-4638-a3e0-2ebf4f174d70',NULL,NULL),(11,'2026-03-29 05:20:41.124979','2026-03-29 05:20:41.124979','073b1b16-2aec-4d82-aea0-9090ed06a9c6',NULL,NULL);
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

-- Dump completed on 2026-04-01  7:42:23
