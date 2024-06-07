-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-06-2024 a las 18:50:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `heehee-db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `budget`
--

CREATE TABLE `budget` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `state` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `total` double NOT NULL,
  `create_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `budget`
--

INSERT INTO `budget` (`id`, `project_id`, `state`, `title`, `total`, `create_date`) VALUES
(1, 5, 'paid', 'Presupuesto Cesáreo', 4864.2, '2024-06-07 16:32:52'),
(2, 2, 'accepted', 'Presupuesto Higinio', 38743.58, '2024-06-07 16:45:38'),
(3, 10, 'paid', 'Presupuesto Deogracias', 3388, '2024-06-07 16:49:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chapter`
--

CREATE TABLE `chapter` (
  `id` int(11) NOT NULL,
  `budget_id` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `quantity` double NOT NULL,
  `price_per_unit` double NOT NULL,
  `total` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `chapter`
--

INSERT INTO `chapter` (`id`, `budget_id`, `description`, `unit`, `quantity`, `price_per_unit`, `total`) VALUES
(1, 1, 'Retirada de gotelé', 'm²', 15, 8, 120),
(2, 1, 'Demolición de paredes', 'm', 15, 100, 1500),
(3, 1, 'Pintura', 'ml', 300, 8, 2400),
(4, 2, 'Demolición de tabiques', 'm', 75.7, 100, 7570),
(5, 2, 'Colocación de tabiques', 'm', 75.7, 245.7, 18599.49),
(6, 2, 'Instalación del suelo radiante', 'm²', 100, 8.5, 850),
(7, 2, 'Levantado y colocación del suelo', 'm²', 100, 50, 5000),
(8, 3, 'Separación de tabiquería - vertical', 'm', 8, 10, 80),
(9, 3, 'Traslado de tabiquería', 'u', 2, 100, 200),
(10, 3, 'Reunión de tabiquería', 'm', 28, 40, 1120),
(11, 3, 'Separación de tabiquería - horizontal superior', 'm', 10, 50, 500),
(12, 3, 'Separación de tabiquería - horizontal inferior', 'm²', 10, 90, 900);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20240607151753', '2024-06-07 17:17:57', 366);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `meeting`
--

CREATE TABLE `meeting` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `place` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `meeting`
--

INSERT INTO `meeting` (`id`, `project_id`, `created_by_id`, `date`, `place`, `state`) VALUES
(1, 1, 2, '2024-06-10 17:30:00', 'Avenida del Centenario', 'accepted'),
(2, 2, 3, '2024-06-12 10:15:00', 'Avenida de Júpiter', 'accepted'),
(3, 2, 3, '2024-06-15 17:30:00', 'Avenida de Júpiter', 'canceled'),
(4, 3, 4, '2024-06-11 11:45:00', 'Calle del Viento', 'rejected'),
(5, 4, 5, '2024-06-18 12:30:00', 'Calle Semilla de Cera', 'accepted'),
(6, 5, 6, '2024-05-08 17:48:00', 'Calle Semilla de Cera', 'done'),
(7, 5, 6, '2024-05-12 17:48:00', 'Calle del Viento', 'canceled'),
(8, 5, 6, '2024-05-20 17:48:00', 'Calle Semilla de Cera', 'rejected'),
(9, 5, 6, '2024-05-22 17:50:00', 'Calle Semilla de Cera', 'notdone'),
(10, 5, 6, '2024-06-07 17:50:00', 'Calle Semilla de Cera', 'done'),
(11, 6, 8, '2024-06-11 10:00:00', 'Plaza de las Dos Lunas', 'done'),
(12, 8, 10, '2024-06-25 10:15:00', 'Avenida del Centenario', 'pending');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `news`
--

INSERT INTO `news` (`id`, `project_id`, `title`, `description`, `date`) VALUES
(1, 5, 'Demolidos los tabiques', 'Habiendo tenido un problema con la instalación eléctrica debido a su antigüedad, hemos terminado la demolición de los dos tabiques que separaban la futura habitación', '2024-06-07 16:27:44'),
(2, 5, 'Terminados los detalles', 'Se ha pintado las paredes, quitado el gotelé y puesto una puerta nueva', '2024-06-07 16:29:20'),
(3, 2, 'Actualizados los planos', 'Se ha hablado con el arquitecto y se ha visto la nueva distribución de las habitaciones', '2024-05-26 16:38:45'),
(4, 2, 'Demolidos los tabiques', 'Se han retirado los primeros tabiques de la casa', '2024-05-29 16:39:35'),
(5, 2, 'Colocación de nuevos tabiques', 'Se han cercado las estancias que se habían planeado con el arquitecto', '2024-06-01 16:40:02'),
(6, 2, 'Retirada de últimos tabiques', 'Se han retirado los tabiques que quedaban por demoler', '2024-06-03 16:40:20'),
(7, 2, 'Levantado del suelo', 'Se ha levantado el suelo para proceder a colocar el suelo radiante', '2024-06-07 16:40:26'),
(8, 2, 'Colocado el suelo radiante', 'Se ha instalado el suelo y se ha puesto de nuevo el suelo', '2024-06-09 16:41:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `state` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `surface` double NOT NULL,
  `ownership` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `project`
--

INSERT INTO `project` (`id`, `client_id`, `state`, `address`, `surface`, `ownership`, `type`, `description`) VALUES
(1, 2, 'created', 'Avenida del Centenario', 90, 'owner', 'partial', 'Reforma completa del baño'),
(2, 3, 'wip', 'Avenida del Río', 100, 'owner', 'complete', 'Cambiar la distribución de las habitaciones y colocar suelo radiante'),
(3, 4, 'rejected', 'Calle del Viento', 70, 'rent', 'partial', 'Derribar tabique entre el salón y la cocina'),
(4, 5, 'wip', 'Plaza de Nuestra Señora del Rostro Robado', 35, 'owner', 'partial', 'Levantar parte del suelo de la esquina del salón'),
(5, 6, 'finished', 'Calle Torre Cercenada', 70, 'rent', 'partial', 'Demoler tabiques de tres habitaciones para hacer una más grande'),
(6, 8, 'abandoned', 'Plaza de las Dos Lunas', 65, 'rent', 'partial', 'Convertir parte del suelo de la habitación de matrimonio en un espejo'),
(7, 9, 'rejected', 'Avenida de Radamés', 40, 'rent', 'complete', 'Colocar suelo radiante, redistribuir las habitaciones e instalación de luces led'),
(8, 10, 'accepted', 'Patio de los Caminares Sordos', 120, 'rent', 'partial', 'Remodelación y modernización de cocina'),
(9, 11, 'paused', 'Plaza de Nuestra Señora del Rostro Robado', 80, 'rent', 'complete', 'Sustitución completa de tejado, techo y suelo'),
(10, 12, 'finished', 'Patio de los Caminares Sordos', 60, 'rent', 'partial', 'Trasladar tabique que separa dos espacios para hacer el salón más grande');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `name`, `phone`, `address`) VALUES
(1, 'crisostomo@gmail.com', '[\"ROLE_ADMIN\"]', '$2y$13$CJVIGt3q9mlYJZG8qq.CPudIAAtqzadt7OyUFqBJtThvxGluvEmha', 'Crisóstomo Saavedra', '655655655', 'Calle Torre Cercenada'),
(2, 'eliodoro@gmail.com', '[]', '$2y$13$PQJ1bFZe3CFRFXCSHBJtZesuN1ePaJ1IP/.7B1R5/4ToKSwFWrqbq', 'Eliodoro Galdós', '63372727', 'Avenida del Centenario'),
(3, 'higinio@gmail.com', '[]', '$2y$13$ZXJ9.dQsCb/uMDcAN8OYcOTcv4g7BKRKUdm5UUduVcDhiAKmw4a5G', 'Higinio Machado', '666554488', 'Paseo de los Rosales'),
(4, 'silfredo@gmail.com', '[]', '$2y$13$f16Toa0bmYQXcB22hgt4wepz3Te6uLKUkAueiexDXKsCluykGu4D6', 'Silfredo Unamuno', '69932233', 'Calle del Viento'),
(5, 'regula@gmail.com', '[]', '$2y$13$s4J6KqHxr90zFtZmuzhva./W6xQULdRaW7e2FkPNOQKddAuZZLXzu', 'Régula Deza', '698989898', 'Plaza de Nuestra Señora del Rostro Robado'),
(6, 'cesareo@gmail.com', '[]', '$2y$13$F.zbAnggtTS9GIPAviFeheNmdpRUCcM2Z47F9yK241.7AMLEkbOH2', 'Cesáreo Escudero', '610293012', 'Calle Semilla de Cera'),
(7, 'crisanta@gmail.com', '[\"ROLE_AGENT\"]', '$2y$13$KgP4uNixMRM9HkVZeaslRO76OhJ.zvmVWCbIzJ15FwwG3pC71ug9u', 'Crisanta Escribar', '677889453', 'Altos de la Archicatedral'),
(8, 'svsona@gmail.com', '[]', '$2y$13$rhxPuTsaTo9J7AwdNjV4ueoed0ndCIdVlSc.9CQNSvkpg3hP8p3BC', 'Svsona Alhambra', '645090122', 'Plaza de las Dos Lunas'),
(9, 'yerma@gmail.com', '[]', '$2y$13$HXk0k1EHVsUSp7qe9/V9kuv26rk5FUNVGCdp1hLNik3Xil3pZyDgK', 'Yerma Montalbán', '679344674', 'Plaza de los Sagrados Sepulcros'),
(10, 'perpetva@gmail.com', '[]', '$2y$13$kWeUPhibZ4aVeTsr3U8aDurI43qP4zLc8H8gQj/0svzzC2vN4pPMi', 'Perpetva Expósito', '657439210', 'Patio de los Caminares Sordos'),
(11, 'anunciada@gmail.com', '[]', '$2y$13$zK7LnmyUxkFq5AJmVcdkg.x7ThSVc5sAm6H7Y/qY.Lt1ZSF9BCxbu', 'Anunciada Garcés', '685858585', 'Avenida de la Santa Línea'),
(12, 'deogracias@gmail.com', '[]', '$2y$13$1y6geuKrKXQnWDVoWtxHU.ZVvH0Ek.R6l2eZUAeW75gGJWlJNOtPO', 'Deogracias Malaspina', '692039182', 'Plaza de la Santa Línea');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_73F2F77B166D1F9C` (`project_id`);

--
-- Indices de la tabla `chapter`
--
ALTER TABLE `chapter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F981B52E36ABA6B8` (`budget_id`);

--
-- Indices de la tabla `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indices de la tabla `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F515E139166D1F9C` (`project_id`),
  ADD KEY `IDX_F515E139B03A8386` (`created_by_id`);

--
-- Indices de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indices de la tabla `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_1DD39950166D1F9C` (`project_id`);

--
-- Indices de la tabla `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_2FB3D0EE19EB6921` (`client_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `budget`
--
ALTER TABLE `budget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `chapter`
--
ALTER TABLE `chapter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `meeting`
--
ALTER TABLE `meeting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `FK_73F2F77B166D1F9C` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`);

--
-- Filtros para la tabla `chapter`
--
ALTER TABLE `chapter`
  ADD CONSTRAINT `FK_F981B52E36ABA6B8` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`id`);

--
-- Filtros para la tabla `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `FK_F515E139166D1F9C` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `FK_F515E139B03A8386` FOREIGN KEY (`created_by_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `FK_1DD39950166D1F9C` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`);

--
-- Filtros para la tabla `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `FK_2FB3D0EE19EB6921` FOREIGN KEY (`client_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
