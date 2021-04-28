import path from "path";
import fs from "fs";
import { exec } from "child_process";
import cowsay from "cowsay";

fs.writeFileSync(
  path.join(__dirname, "server/__test__/assets/requirements.json"),
  JSON.stringify({ token: "", count: 0 })
);

exec("rm test.sqlite");
exec("touch test.sqlite");

console.log(
  cowsay.say({
    text: "Reset has been Successfull",
    e: "oO",
    T: "U ",
  })
);
