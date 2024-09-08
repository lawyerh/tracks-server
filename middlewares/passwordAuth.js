import bcrypt from "bcrypt";

//
export default (candidatePassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};
