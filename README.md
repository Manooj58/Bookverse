<p align="center">
        <img src="assets/logoMain.png" align="center" alt="bookverse-icon" height="200px"/>
</p>
<h1 align="center" style="border: 0;">Bookverse</h1>

Bookverse is a project based on blockchain technology more specifically, is a opensea clone but for the book author. In our site, an author can shortlist any of their books for sale at the desired amount of ether and allows any other user exploring the website to buy them. The latest buyer who has ownership of the book is only able to read it. After reading if they want to, they can resell on the site.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Manooj58/Bookverse
```

Go to the project directory

```bash
  cd Bookverse
```

Install dependencies present in [package.json](https://github.com/Manooj58/Bookverse/blob/master/package.json) file.

```bash
  npm install
```
Now, run the hardhat network for conneting the wallet run

```bash
  npx hardhat node
```

Deploy the smart contract by running

```bash
  npx hardhat run scripts/deploy.js --network localhost
```

Finally, you can start the next.js server
```bash
  npm run dev
```