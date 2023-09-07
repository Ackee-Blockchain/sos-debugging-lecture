import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaErrors } from "../target/types/solana_errors";
import { Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

describe("solana-errors", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  let connection = anchor.getProvider().connection;

  const program = anchor.workspace.SolanaErrors as Program<SolanaErrors>;
  const user = Keypair.generate();
  const data = Keypair.generate();

  before("prepare", async () => {
    await airdrop(anchor.getProvider().connection, user.publicKey)
  })

  it("Is initialized!", async () => {

    console.log("user balance = " + await connection.getBalance(user.publicKey))
    const tx = await program.methods
      .initialize()
      .accounts({
        user: user.publicKey,
        data: data.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([user])
      // .transaction()
      .rpc();

    // await sendAndConfirmTransaction(connection, tx, [user, data], { commitment: "confirmed" });

    console.log("Your transaction signature", tx);
  });
});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}
