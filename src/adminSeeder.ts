import bcrypt from "bcrypt";
import User from "./database/models/userModel";
const adminSeeder = async (): Promise<void> => {
  const [data] = await User.findAll({
    where: {
      email: "r1admin@gmail.com",
    },
  });
  if (!data) {
    await User.create({
      email: "r1admin@gmail.com",
      password: await bcrypt.hash("adminIsCool", 10),
      userName: "R1",
      role: "admin",
    });
  } else {
    console.log("successfully seeded");
  }
  return;
};
export default adminSeeder;
