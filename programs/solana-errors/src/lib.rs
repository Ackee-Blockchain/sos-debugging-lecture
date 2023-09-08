#![allow(clippy::result_large_err)]
use anchor_lang::error_code;
use anchor_lang::prelude::*;

declare_id!("Gp3jcr7dqCcgp3QbQdcwjS5p5n5usRLoxesQuNaHm4GD");

#[program]
pub mod solana_errors {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, count: u8) -> Result<()> {
        let data = &mut ctx.accounts.data;

        data.authority = ctx.accounts.user.key();

        data.counter = 10 - count;

        msg!("data.conter = {}", data.counter);
        msg!("data pubkey = {}", data.key().to_string());
        msg!("user pubkey = {}", data.authority.key().to_string());

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    user: Signer<'info>,

    #[account(init,
        space = 8 + 32 + 1,
        payer = user,
        seeds = [b"data"],
        bump
    )]
    data: Account<'info, MyData>,

    system_program: Program<'info, System>,
}

#[account]
pub struct MyData {
    authority: Pubkey,
    counter: u8,
}

#[error_code]
pub enum MyError {
    #[msg("invalid value of counter instruction data")]
    InvalidCounter,
}
