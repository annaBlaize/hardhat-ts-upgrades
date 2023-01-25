// This script contains deployment and verification of the `contracts/PositiveEvenSetterUpgradable.sol`.

import hre from "hardhat";
const ethers = hre.ethers;
const upgrades = hre.upgrades;

import type { PositiveEvenSetterUpgradable } from "../../../../typechain-types";

async function deployPositiveEvenSetterUpgradable(): Promise<PositiveEvenSetterUpgradable>{
    /*
     * Hardhat always runs the compile task when running scripts with its command line interface.
     *
     * If this script is run directly using `node`, then it should be called compile manually
     * to make sure everything is compiled.
     */
    // await hre.run("compile");

    const [deployer] = await ethers.getSigners();

    /*
    * In this deployment script plugin `hardhat-upgrades` from openzeppelin is used to deploy the upgradable contract.
    * With it you can:
    * - Deploy a proxy of the contract (deployProxy function).
    * - Deploy the implementation of the contract (also deployProxy function).
    * - Upgrade the proxy to a new implementation (upgradeProxy function).
    * - Get the address of the deployed contract implementation (erc1967.getImplementationAddress).
    * - Selectively disable one or more validation errors while deployment (below about flags).
    * 
    * All deploy and upgrade functions validate that the implementation contract is upgrade-safe.
    */

    /*
    * deployProxy creates a UUPS or Transparent proxy given an ethers contract factory to use as implementation 
    * and returns a contract instance with the proxy address and the implementation interface. 
    * If args is set, will call an initializer function initialize with the supplied args during proxy deployment.
    * 
    * upgradeProxy upgrades a UUPS or Transparent proxy at a specified address to a new implementation contract
    * and returns a contract instance with the proxy address and the new implementation interface.
    */

    /*
    * Flags:
    * - unsafeAllow: 
    * "delegatecall": Allows the use of delegatecall. 
    * "state-variable-assignment": Allows assigning state variables in a contract even though they will be stored in the implementation.
    * "state-variable-immutable": Allows use of immutable variables, which are not unsafe.
    * "constructor": Allows defining a constructor. Note that constructor arguments are not supported regardless of this option.
    * "missing-public-upgradeto": Allow UUPS implementations that do not contain a public upgradeTo function. 
    * 
    * - unsafeAllowLinkedLibraries: allows the use of linked libraries in the implementation contract.
    * 
    * - initializer: set a different initializer function to call or specify false to disable initialization.
    */

    /* Read more about flags and deploy proxy functions in doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades */

    // Get implementation of the contract.
    const PositiveEvenSetterUpgradableImpl = (await ethers.getContractFactory("PositiveEvenSetterUpgradable")).connect(deployer);
    
    // Deploy the proxy and implementation of the contract.
    const positiveEvenSetterUpgradable = await upgrades.deployProxy(PositiveEvenSetterUpgradableImpl, []);
   
    await positiveEvenSetterUpgradable.deployed();

    /*
    * If you want to disable validation error like `delegatecall` while deployment:
    * const positiveEvenSetterUpgradable = await upgrades.deployProxy(PositiveEvenSetterUpgradableImpl, [], { unsafeAllow: ['delegatecall'] });
    * 
    * or if you have more than one error:
    * const positiveEvenSetterUpgradable = await upgrades.deployProxy(PositiveEvenSetterUpgradableImpl, [], { unsafeAllow: ['delegatecall', 'state-variable-assignment'] });
    * 
    * or if you want to use more flags:
    * const positiveEvenSetterUpgradable = await upgrades.deployProxy(PositiveEvenSetterUpgradableImpl, [], { unsafeAllow: ['delegatecall', 'state-variable-assignment'], unsafeAllowLinkedLibraries: true });
    * 
    * use of `initializer` flag:
    * const positiveEvenSetterUpgradable = await upgrades.deployProxy(PositiveEvenSetterUpgradableImpl, [], { initializer: 'initialize' });
    */

    // Get the address of the deployed contract implementation.
    const positiveEvenSetterUpgradableAddressImpl = await upgrades.erc1967.getImplementationAddress(positiveEvenSetterUpgradable.address);
   
    console.log(`\`positiveEvenSetter\` is deployed to ${positiveEvenSetterUpgradable.address}.`);
    console.log(`\`positiveEvenSetterImpl\` is deployed to ${positiveEvenSetterUpgradableAddressImpl}.`);

    // Verification of the deployed contract.
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Sleeping before verification...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds.

        await hre.run("verify:verify", { address: positiveEvenSetterUpgradableAddressImpl, constructorArguments: [] });
    }

    return positiveEvenSetterUpgradable;
}

export { deployPositiveEvenSetterUpgradable };
