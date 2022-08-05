const hre = require('hardhat');

async function main() {
  const Bookverse = await hre.ethers.getContractFactory('Bookverse');
  const bookverse = await Bookverse.deploy();

  await bookverse.deployed();

  console.log('Bookverse deployed to:', bookverse.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });