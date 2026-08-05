# Robinhood Agentic account limits

## Trade vs read

| Capability | Scope |
|------------|--------|
| Place orders | **Only** Robinhood **Agentic** account |
| Read positions / balances | May include other Robinhood accounts on the user login |
| Read transactions / order history | May include other accounts |
| Read watchlists / scans | May include other accounts |
| Account numbers / account list | May include all linked Robinhood accounts |

Never tell the user the agent can freely trade every Robinhood account. That is false.

## Account prerequisites

1. Primary individual investing account in good standing
2. Agentic account opened via MCP authentication onboarding
3. Desktop browser for onboarding (mobile: copy URL → desktop)
4. Up to 10 self-directed individual investing accounts total (including Agentic)

## User responsibility

- Investment decisions remain the user’s even when the agent places orders
- Autonomous mode (no per-trade confirmation) is allowed only if the user requested it
- Monitor positions, cancellations, and funding; agents can err or act on stale data
- Brokerage: Robinhood Financial LLC (RHF) / clearing Robinhood Securities, LLC (RHS); not banks; SIPC membership applies to brokerage as described by Robinhood — not a guarantee of profit

## Birth operator note (verbatim intent)

Birth/install seeds `robinhood-trading` → `https://agent.robinhood.com/mcp/trading`.

- Place trades only in the Robinhood **Agentic** account  
- Desktop OAuth and Agentic onboarding required before live tools work  
- You remain responsible for every order the agent places  
