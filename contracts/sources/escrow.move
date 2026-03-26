module micro_escrow::escrow {
    use std::string::{Self, String};
    use one::event;

    /// Escrow agreement stored on-chain
    public struct Escrow has key, store {
        id: object::UID,
        depositor: address,
        recipient: address,
        amount: u64,
        description: String,
        status: u8,   // 0=pending, 1=released, 2=refunded
        epoch: u64,
    }

    public struct EscrowCreated has copy, drop {
        depositor: address,
        recipient: address,
        amount: u64,
        description: String,
        epoch: u64,
    }

    public struct EscrowReleased has copy, drop {
        depositor: address,
        recipient: address,
        amount: u64,
        epoch: u64,
    }

    public struct EscrowRefunded has copy, drop {
        depositor: address,
        amount: u64,
        epoch: u64,
    }

    const E_NOT_DEPOSITOR: u64 = 0;
    const E_ALREADY_SETTLED: u64 = 1;
    const E_ZERO_AMOUNT: u64 = 2;

    const STATUS_PENDING: u8 = 0;
    const STATUS_RELEASED: u8 = 1;
    const STATUS_REFUNDED: u8 = 2;

    public fun create(
        recipient: address,
        amount: u64,
        raw_desc: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(amount > 0, E_ZERO_AMOUNT);
        let depositor = ctx.sender();
        let epoch = ctx.epoch();
        let description = string::utf8(raw_desc);

        event::emit(EscrowCreated { depositor, recipient, amount, description, epoch });

        transfer::transfer(Escrow {
            id: object::new(ctx),
            depositor,
            recipient,
            amount,
            description,
            status: STATUS_PENDING,
            epoch,
        }, depositor);
    }

    public fun release(escrow: &mut Escrow, ctx: &mut TxContext) {
        assert!(escrow.depositor == ctx.sender(), E_NOT_DEPOSITOR);
        assert!(escrow.status == STATUS_PENDING, E_ALREADY_SETTLED);
        escrow.status = STATUS_RELEASED;
        event::emit(EscrowReleased { depositor: escrow.depositor, recipient: escrow.recipient, amount: escrow.amount, epoch: ctx.epoch() });
    }

    public fun refund(escrow: &mut Escrow, ctx: &mut TxContext) {
        assert!(escrow.depositor == ctx.sender(), E_NOT_DEPOSITOR);
        assert!(escrow.status == STATUS_PENDING, E_ALREADY_SETTLED);
        escrow.status = STATUS_REFUNDED;
        event::emit(EscrowRefunded { depositor: escrow.depositor, amount: escrow.amount, epoch: ctx.epoch() });
    }

    public fun depositor(e: &Escrow): address { e.depositor }
    public fun recipient(e: &Escrow): address { e.recipient }
    public fun amount(e: &Escrow): u64 { e.amount }
    public fun status(e: &Escrow): u8 { e.status }
}
