CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` TEXT NOT NULL,
  `body` TEXT NULL,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NULL,
  `opened` INT NULL DEFAULT 0,
  `important` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `posts_tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_posts_tags_posts_idx` (`post_id` ASC),
  INDEX `fk_posts_tags_tags1_idx` (`tag_id` ASC),
  CONSTRAINT `fk_posts_tags_posts`
    FOREIGN KEY (`post_id`)
    REFERENCES `posts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_tags_tags1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `relative_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tag_id` INT NOT NULL,
  `relative_tag_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_relative_tag_tags1_idx` (`tag_id` ASC),
  INDEX `fk_relative_tag_tags2_idx` (`relative_tag_id` ASC),
  CONSTRAINT `fk_relative_tag_tags1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_relative_tag_tags2`
    FOREIGN KEY (`relative_tag_id`)
    REFERENCES `tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

ALTER TABLE posts ADD `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '1-active\n0-draft\n8-deleted';

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `email` VARCHAR(45) NOT NULL COMMENT '',
  `password` VARCHAR(80) NOT NULL COMMENT '',
  `status` TINYINT(1) UNSIGNED NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)  COMMENT '',
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)  COMMENT '')
ENGINE = InnoDB;
