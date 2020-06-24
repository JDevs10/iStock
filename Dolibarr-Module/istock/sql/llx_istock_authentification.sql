-- Copyright (C) ---Put here your own copyright and developer email---
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see https://www.gnu.org/licenses/.


CREATE TABLE llx_istock_authentification(
	-- BEGIN MODULEBUILDER FIELDS
	rowid integer AUTO_INCREMENT PRIMARY KEY NOT NULL, 
	date_creation datetime NOT NULL, 
	identifiant varchar(255) NOT NULL, 
	last_connexion datetime NOT NULL, 
	device_platform varchar(255) NOT NULL, 
	device_type varchar(255) NOT NULL, 
	fk_user integer NOT NULL
	-- END MODULEBUILDER FIELDS
) ENGINE=innodb;
