import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaErrors } from "../target/types/solana_errors";
import { Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

describe("solana-errors", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  let connection = anchor.getProvider().connection;

  const program = anchor.workspace.SolanaErrors as Program<SolanaErrors>;
  const user = Keypair.generate();
  const [data] = PublicKey.findProgramAddressSync([Buffer.from("data")], program.programId)
  const data2 = Keypair.generate();

  before("prepare", async () => {
    await airdrop(anchor.getProvider().connection, user.publicKey)
  })

  it("Is initialized!", async () => {

    // Now we have new input parameter and added bad code causing subtraction overflow for count > 10
    // so we get the "Program failed to complete" error
    // it is possible to see the error in logs is you skip preflight checks - we fix it by addding a require! macro that checks the input or using checked arithmetics
    // if the error is not obvious, than it is possible to use msg! logging macro to write variables in the log

    const tx = await program.methods
      .initialize(11)
      .accounts({
        user: user.publicKey,
        data: data,
        systemProgram: SystemProgram.programId
      })
      .signers([user])
      .rpc({ skipPreflight: true });

    console.log("Your transaction signature", tx);

  });
});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}
