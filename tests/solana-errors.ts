import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaErrors } from "../target/types/solana_errors";
import { Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

describe("solana-errors", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  let connection = anchor.getProvider().connection;

  const program = anchor.workspace.SolanaErrors as Program<SolanaErrors>;
  const user = Keypair.generate();
  const data = Keypair.generate();
  // const [data] = PublicKey.findProgramAddressSync([Buffer.from("data")], program.programId)
  const data2 = Keypair.generate();

  before("prepare", async () => {
    await airdrop(anchor.getProvider().connection, user.publicKey)
  })

  it("Is initialized!", async () => {

    // now we have changed our DataAccount to be a PDA, so we will have two errors:
    // 1. unknown signer - the data account signature is not needed anymore
    // 2. ConstraintSeeds - we need to pass the correct PDA based on seeds

    const tx = await program.methods
      .initialize()
      .accounts({
        user: user.publicKey,
        data: data.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([user])
      .rpc();

    console.log("Your transaction signature", tx);

  });
});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}
