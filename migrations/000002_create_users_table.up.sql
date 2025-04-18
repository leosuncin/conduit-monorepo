CREATE TABLE users (
  user_id BigInt PRIMARY KEY,
  user_email CiText NOT NULL CONSTRAINT email_unique UNIQUE,
  user_password VarChar NULL,
  user_username CiText NOT NULL CONSTRAINT username_unique UNIQUE,
  user_bio Text,
  user_image BpChar
);
