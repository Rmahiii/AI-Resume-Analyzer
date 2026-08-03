import { User } from "../models/User.js";

export const demoAccount = {
  name: "Demo Recruiter",
  email: "demo@resumesignal.com",
  password: "Demo@123"
};

export async function ensureDemoAccount() {
  let user = await User.findOne({ email: demoAccount.email }).select("+passwordHash");

  if (!user) {
    user = new User({
      name: demoAccount.name,
      email: demoAccount.email,
      role: "user"
    });
    await user.setPassword(demoAccount.password);
    await user.save();
    return user;
  }

  let changed = false;
  if (user.name !== demoAccount.name) {
    user.name = demoAccount.name;
    changed = true;
  }
  if (user.role !== "user") {
    user.role = "user";
    changed = true;
  }
  if (!(await user.verifyPassword(demoAccount.password))) {
    await user.setPassword(demoAccount.password);
    changed = true;
  }
  if (changed) await user.save();

  return user;
}
