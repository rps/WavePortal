const main = async () => {
  const [owner, ...people] = await hre.ethers.getSigners();
  // Grabs the contract and spins up a network(?)
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  // Deploys the smart contract to the network and returns a reference
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();

  console.log('Contract deployed to:', waveContract.address);
  console.log('Contract deployed by: ', owner.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave('Test 1');
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  for (const person of people) {
    waveTxn = await waveContract.connect(person).wave(`Message no: ${Math.random()}`);
    await waveTxn.wait();
  }
  waveCount = await waveContract.getTotalWaves();
  const allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
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
