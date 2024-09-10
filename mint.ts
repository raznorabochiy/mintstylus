import cli from "cli";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { getTxLink } from "./utils";
import { ABI, CONTRACT_ADDRESS, MINT_AMOUNT, RPC_URL } from "./constants";

const provider = new JsonRpcProvider(RPC_URL);

export async function mint(key: string) {
  const wallet = new Wallet(key, provider);
  const contract = new Contract(CONTRACT_ADDRESS, ABI, wallet);

  const txArgs = [MINT_AMOUNT];

  const gasLimit = await contract.mint.estimateGas(...txArgs);
  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

  const unsignedTx = await contract.mint.populateTransaction(...txArgs);

  cli.spinner("Отправляю транзакцию");

  const tx = await wallet.sendTransaction({
    ...unsignedTx,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  await provider.waitForTransaction(tx.hash);

  cli.spinner(getTxLink(tx.hash), true);
}
