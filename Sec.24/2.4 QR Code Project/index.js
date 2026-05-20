/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import input from "@inquirer/input";
import * as qr from "qr-image";
import * as fs from "fs";

var response = await input({message: "Enter a URL to be given a QR code: "});
var qr_svg = qr.image(response, {type: "svg"});
qr_svg.pipe(fs.createWriteStream("qr_img.svg"));
fs.writeFile("user_input.txt", response, (err) => {
    if(err) throw err;
    console.log("Input saved!");
});