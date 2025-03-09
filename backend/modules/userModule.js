import pool from "../config/database.js";
import bcrypt from "bcrypt";

export async function checkEmail(email) {
  const emailCheckQuery = "SELECT * FROM user WHERE email = ?";
  return new Promise((resolve, reject) => {
    pool.query(emailCheckQuery, [email], (err, results) => {
      if (err) {
        reject(err);
      } else if (results.length > 0) {
        resolve(false); // Email already exists
      } else {
        resolve(true); // Email is available
      }
    });
  });
}

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function enterData(Name, Email, hashedPassword, Image, DateOfBirth, Phone) {
  const insertQuery =
    "INSERT INTO `inspirehire`.`user` (Role_ID, Name, WorkingID, Email, Password, Image, First_Login, DateOfBirth, Phone) VALUES ('1', ?, 'null', ?, ?, 'null', NOW(), ?, ?);";

  return new Promise((resolve, reject) => {
    pool.query(insertQuery, [Name, Email, hashedPassword, Image, DateOfBirth, Phone], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
