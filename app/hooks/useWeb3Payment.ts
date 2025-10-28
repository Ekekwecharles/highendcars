// import { ethers } from "ethers";

// export async function payWithEther(toAddress: string, amountEth: string) {
//   try {
//     // Request wallet connection
//     // @ts-ignore
//     if (!window.ethereum) throw new Error("No web3 wallet detected");
//     // @ts-ignore
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     // @ts-ignore
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const tx = await signer.sendTransaction({
//       to: toAddress,
//       value: ethers.parseEther(amountEth),
//     });
//     return tx;
//   } catch (e) {
//     throw e;
//   }
// }
