const fs = require("fs");
const https = require("https");
const path = require("path");

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, "public", "fonts");
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// SF Pro Display font files to download
const fontFiles = [
  {
    url: "https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg",
    output: path.join(fontsDir, "SF-Pro.dmg"),
    name: "SF Pro",
  },
];

// Function to download a file
function downloadFile(url, output, name) {
  console.log(`Downloading ${name}...`);

  const file = fs.createWriteStream(output);

  https
    .get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Download of ${name} completed.`);
        console.log(
          `\nNote: Since SF Pro is an Apple font, you need to manually extract and convert the font files.`
        );
        console.log(`1. Mount the SF-Pro.dmg file`);
        console.log(`2. Install the font`);
        console.log(
          `3. Copy the following font files to your public/fonts directory:`
        );
        console.log(`   - SF-Pro-Display-Regular.woff2`);
        console.log(`   - SF-Pro-Display-Medium.woff2`);
        console.log(`   - SF-Pro-Display-Semibold.woff2`);
        console.log(`   - SF-Pro-Display-Bold.woff2`);
        console.log(
          `\nAlternatively, you can download SF Pro Font from fonts websites and convert to WOFF2 format.`
        );
      });
    })
    .on("error", (err) => {
      fs.unlink(output, () => {});
      console.error(`Error downloading ${name}: ${err.message}`);
    });
}

// Download each file
fontFiles.forEach((file) => {
  downloadFile(file.url, file.output, file.name);
});
