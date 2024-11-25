use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("");

const RIDE_ACCEPTANCE_TIMEOUT: i64 = 15 * 60;
const MAX_NAME_LENGTH: usize = 50;
const MAX_LICENSE_LENGTH: usize = 20;

#[program]
pub mod ride_sharing_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, platform_fee_rate: u16, fee_recipient: Pubkey) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        require!(platform_fee_rate <= 1000, RideSharingError::InvalidFeeRate);
        escrow_account.platform_fee_rate = platform_fee_rate;
        escrow_account.fee_recipient = fee_recipient;
        Ok(())
    }

    pub fn register_driver(
        ctx: Context<RegisterDriver>, 
        name: String, 
        license_number: String
    ) -> Result<()> {
        let driver_account = &mut ctx.accounts.driver_account;
        
        require!(name.len() > 0 && name.len() <= MAX_NAME_LENGTH, RideSharingError::InvalidDriverName);
        require!(license_number.len() > 0 && license_number.len() <= MAX_LICENSE_LENGTH, RideSharingError::InvalidLicenseNumber);
        
        driver_account.driver = *ctx.accounts.driver.key;
        driver_account.name = name;
        driver_account.license_number = license_number;
        driver_account.is_registered = true;
        driver_account.rating = 0;
        driver_account.total_rides = 0;
        
        Ok(())
    }

    pub fn create_ride(
        ctx: Context<CreateRide>,
        source: [i64; 2],
        destination: [i64; 2],
        fare: u64,
    ) -> Result<()> {
        let ride_account = &mut ctx.accounts.ride_account;
        let rider = &ctx.accounts.rider;

        require!(fare > 0, RideSharingError::InvalidFare);

        ride_account.trip_id = ride_account.trip_id.checked_add(1).unwrap();
        ride_account.rider = *rider.key;
        ride_account.driver = Pubkey::default();
        ride_account.fare = fare;
        ride_account.source = source;
        ride_account.destination = destination;
        ride_account.status = RideStatus::Created;
        ride_account.created_at = Clock::get()?.unix_timestamp;
        ride_account.rider_rating = 0;
        ride_account.driver_rating = 0;

        emit!(RideCreated {
            trip_id: ride_account.trip_id,
            rider: rider.key(),
            fare,
        });

        Ok(())
    }

    pub fn accept_ride(ctx: Context<AcceptRide>, trip_id: u64) -> Result<()> {
        let ride_account = &mut ctx.accounts.ride_account;
        let driver = &ctx.accounts.driver;
        let driver_account = &ctx.accounts.driver_account;

        require!(driver_account.is_registered, RideSharingError::UnregisteredDriver);
        require!(ride_account.status == RideStatus::Created, RideSharingError::InvalidRideState);
        require!(
            Clock::get()?.unix_timestamp <= ride_account.created_at + RIDE_ACCEPTANCE_TIMEOUT,
            RideSharingError::RideExpired
        );

        ride_account.driver = *driver.key;
        ride_account.status = RideStatus::Accepted;

        emit!(RideAccepted {
            trip_id,
            driver: driver.key(),
        });

        Ok(())
    }

    pub fn complete_ride(ctx: Context<CompleteRide>, trip_id: u64, driver_rating: u8, rider_rating: u8) -> Result<()> {
        let ride_account = &mut ctx.accounts.ride_account;
        let driver = &ctx.accounts.driver;
        let driver_account = &mut ctx.accounts.driver_account;
        let escrow_account = &ctx.accounts.escrow_account;

        require!(driver_account.is_registered, RideSharingError::UnregisteredDriver);
        require!(ride_account.driver == *driver.key, RideSharingError::UnauthorizedAction);
        require!(ride_account.status == RideStatus::Accepted, RideSharingError::InvalidRideState);
        require!(driver_rating <= 5 && rider_rating <= 5, RideSharingError::InvalidRating);

        let platform_fee = (ride_account.fare * escrow_account.platform_fee_rate as u64) / 10_000;
        let driver_payment = ride_account.fare - platform_fee;

        **ctx.accounts.fee_recipient.to_account_info().try_borrow_mut_lamports()? += platform_fee;
        **ctx.accounts.driver.to_account_info().try_borrow_mut_lamports()? += driver_payment;

        // Update driver rating
        driver_account.total_rides += 1;
        driver_account.rating = ((driver_account.rating * (driver_account.total_rides - 1)) + driver_rating as u32) / driver_account.total_rides;

        ride_account.status = RideStatus::Completed;
        ride_account.driver_rating = driver_rating;
        ride_account.rider_rating = rider_rating;

        emit!(RideCompleted { 
            trip_id,
            driver_rating,
            rider_rating 
        });

        Ok(())
    }

    pub fn cancel_ride(ctx: Context<CancelRide>, trip_id: u64) -> Result<()> {
        let ride_account = &mut ctx.accounts.ride_account;
        let rider = &ctx.accounts.rider;

        require!(ride_account.rider == *rider.key, RideSharingError::UnauthorizedAction);
        require!(
            ride_account.status == RideStatus::Created || ride_account.status == RideStatus::Accepted,
            RideSharingError::InvalidRideState
        );

        ride_account.status = RideStatus::Cancelled;

        **ctx.accounts.rider.to_account_info().try_borrow_mut_lamports()? += ride_account.fare;

        emit!(RideCancelled { trip_id });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + EscrowAccount::LEN)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterDriver<'info> {
    #[account(init, payer = driver, space = 8 + 32 + 4 + MAX_NAME_LENGTH + 4 + MAX_LICENSE_LENGTH + 1 + 4 + 4)]
    pub driver_account: Account<'info, DriverAccount>,
    #[account(mut)]
    pub driver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateRide<'info> {
    #[account(init, payer = rider, space = 8 + RideAccount::LEN)]
    pub ride_account: Account<'info, RideAccount>,
    #[account(mut)]
    pub rider: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptRide<'info> {
    #[account(mut)]
    pub ride_account: Account<'info, RideAccount>,
    #[account(mut)]
    pub driver: Signer<'info>,
    #[account(mut, has_one = driver)]
    pub driver_account: Account<'info, DriverAccount>,
}

#[derive(Accounts)]
pub struct CompleteRide<'info> {
    #[account(mut)]
    pub ride_account: Account<'info, RideAccount>,
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub driver: Signer<'info>,
    #[account(mut, has_one = driver)]
    pub driver_account: Account<'info, DriverAccount>,
    #[account(mut)]
    pub fee_recipient: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CancelRide<'info> {
    #[account(mut)]
    pub ride_account: Account<'info, RideAccount>,
    #[account(mut)]
    pub rider: Signer<'info>,
}

#[account]
pub struct EscrowAccount {
    pub platform_fee_rate: u16,
    pub fee_recipient: Pubkey,
}

#[account]
pub struct DriverAccount {
    pub driver: Pubkey,
    pub name: String,
    pub license_number: String,
    pub is_registered: bool,
    pub rating: u32,
    pub total_rides: u32,
}

#[account]
pub struct RideAccount {
    pub trip_id: u64,
    pub rider: Pubkey,
    pub driver: Pubkey,
    pub fare: u64,
    pub source: [i64; 2],
    pub destination: [i64; 2],
    pub status: RideStatus,
    pub created_at: i64,
    pub driver_rating: u8,
    pub rider_rating: u8,
}

impl EscrowAccount {
    const LEN: usize = 2 + 32;
}

impl RideAccount {
    const LEN: usize = 8 + 32 + 32 + 8 + 16 + 16 + 1 + 8 + 1 + 1;
}

impl DriverAccount {
    const LEN: usize = 32 + 4 + MAX_NAME_LENGTH + 4 + MAX_LICENSE_LENGTH + 1 + 4 + 4;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RideStatus {
    Created,
    Accepted,
    Completed,
    Cancelled,
}

#[error_code]
pub enum RideSharingError {
    #[msg("Invalid fee rate.")]
    InvalidFeeRate,
    #[msg("Invalid fare.")]
    InvalidFare,
    #[msg("Invalid ride state.")]
    InvalidRideState,
    #[msg("Ride expired.")]
    RideExpired,
    #[msg("Unauthorized action.")]
    UnauthorizedAction,
    #[msg("Unregistered driver.")]
    UnregisteredDriver,
    #[msg("Invalid driver name.")]
    InvalidDriverName,
    #[msg("Invalid license number.")]
    InvalidLicenseNumber,
    #[msg("Invalid rating.")]
    InvalidRating,
}

#[event]
pub struct RideCreated {
    pub trip_id: u64,
    pub rider: Pubkey,
    pub fare: u64,
}

#[event]
pub struct RideAccepted {
    pub trip_id: u64,
    pub driver: Pubkey,
}

#[event]
pub struct RideCompleted {
    pub trip_id: u64,
    pub driver_rating: u8,
    pub rider_rating: u8,
}

#[event]
pub struct RideCancelled {
    pub trip_id: u64,
}