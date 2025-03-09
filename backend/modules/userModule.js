import pool from "../config/database.js";
import bcrypt from "bcrypt";

export async function checkEmail(email) {
  
  const emailCheckQuery = "SELECT * FROM user WHERE email = ?";
  
  try{
    const [result] = await pool.query(emailCheckQuery, [email])
    return result[0]
  }
  catch(err){
    console.log("Error while searching for the query")
  }
  
}

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function enterData(Name, Email, hashedPassword, Image, DateOfBirth, Phone) {

  try{
    
    const insertQuery = "INSERT INTO `inspirehire`.`user` (Role_ID, Name, WorkingID, Email, Password, Image, First_Login, DateOfBirth, Phone) VALUES ('1', ?, null, ?, ?, ?, null, ?, ?);";

    const result = await pool.query(insertQuery, [Name, Email, hashedPassword, Image, DateOfBirth, Phone])
    return result
  }

  catch(err){
    console.log("Error occured in module while inserting the data")
    return null
  }

 

}
