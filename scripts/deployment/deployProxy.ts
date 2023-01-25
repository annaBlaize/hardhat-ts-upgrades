// This is a script for deployment and automatically verification of all the contracts (`contracts/`).

import { deployPositiveEvenSetterUpgradable } from "./separately/exported-functions/deployPositiveEvenSetterUpgradable";

async function main() {
    // Deployment and verification of the `contracts/PositiveEvenSetterUpgradable.sol`.
    await deployPositiveEvenSetterUpgradable();
}

// This pattern is recommended to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
