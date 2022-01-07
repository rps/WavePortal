const main = async () => {
  const [owner, ...people] = await hre.ethers.getSigners();
  // Grabs the contract and spins up a network(?)
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  // Deploys the smart contract to the network and returns a reference
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log('Contract deployed to:', waveContract.address);
  console.log('Contract deployed by: ', owner.address);

  let waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  for (const person of people) {
    waveTxn = await waveContract.connect(person).wave();
    await waveTxn.wait();
  }
  waveCount = await waveContract.getTotalWaves();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
