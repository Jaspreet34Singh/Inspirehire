import axios from 'axios';

try{
  // const user_Id = localStorage.getItem("User_ID")
  const user_Id = 10008
  const response = await axios.get(`http://localhost:3000/apply/${user_Id}`);
  console.log(response)
  const userData = response.data.user;
}catch(error){
  console.error("Can not fetch user" + error)
}