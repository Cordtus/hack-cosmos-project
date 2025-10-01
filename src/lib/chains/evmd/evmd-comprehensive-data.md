# EVMD Comprehensive CLI and Parameters Dataset

This document provides a comprehensive analysis of all `evmd` CLI commands, module parameters, governance proposals, and configuration options extracted from the cosmos/evm codebase.

## Table of Contents
1. [CLI Command Structure](#cli-command-structure)
2. [Module Parameters](#module-parameters)
3. [Governance Proposals](#governance-proposals)
4. [Precompiled Contracts](#precompiled-contracts)
5. [Configuration Files](#configuration-files)

---

## CLI Command Structure

### Core Commands

#### Node Operations
- **`evmd init [moniker]`** - Initialize node configuration
  - Flags: `--chain-id`, `--home`

- **`evmd start`** - Run the full node
  - JSON-RPC Flags:
    - `--json-rpc.enable` - Enable JSON-RPC server
    - `--json-rpc.address` - Address (default: `127.0.0.1:8545`)
    - `--json-rpc.ws-address` - WebSocket address (default: `127.0.0.1:8546`)
    - `--json-rpc.api` - API namespaces (default: `eth,net,web3`)
    - `--json-rpc.enable-indexer` - Enable tx indexer
    - `--json-rpc.enable-profiling` - Enable debug profiling
    - `--json-rpc.filter-cap` - Filter cap (default: `200`)
    - `--json-rpc.gas-cap` - Gas cap (default: `25000000`)
    - `--json-rpc.txfee-cap` - Transaction fee cap (default: `1`)
    - `--json-rpc.batch-request-limit` - Batch request limit (default: `1000`)
    - `--json-rpc.evm-timeout` - EVM call timeout (default: `5s`)
    - `--json-rpc.logs-cap` - Logs result cap (default: `10000`)
    - `--json-rpc.block-range-cap` - Block range cap (default: `10000`)

- **`evmd status`** - Get node status
- **`evmd index-eth-tx [backward|forward]`** - Index historical Ethereum transactions
- **`evmd testnet`** - Create testnet configurations
- **`evmd genesis`** - Genesis file operations
  - `add-genesis-account [address] [coins]`
  - `collect-gentxs`
  - `gentx [key-name] [amount]`

#### Key Management
- **`evmd keys add [name]`** - Add new key
  - Flags: `--recover`, `--algo`, `--coin-type`
- **`evmd keys list`** - List all keys
- **`evmd keys list-key-types`** - List supported key types
- **`evmd keys show [name|address]`** - Display key information
- **`evmd keys export [name]`** - Export private key
- **`evmd keys import [name] [keyfile]`** - Import private key
- **`evmd keys unsafe-export-eth-key [name]`** - Export Ethereum private key (UNSAFE)
- **`evmd keys unsafe-import-eth-key [name] [pk]`** - Import Ethereum private key (UNSAFE)

### Query Commands

#### EVM Module (`evmd query vm`)
- **`evmd query vm account [address]`** - Get account information
- **`evmd query vm balance-bank [0x-address] [denom]`** - Get bank balance for 0x address
- **`evmd query vm balance-erc20 [0x-address] [erc20-address]`** - Get ERC20 token balance
- **`evmd query vm code [address]`** - Get smart contract code
- **`evmd query vm storage [address] [key]`** - Get storage value at key
- **`evmd query vm config`** - Get EVM configuration values
- **`evmd query vm params`** - Get EVM module parameters
- **`evmd query vm 0x-to-bech32 [0x-address]`** - Convert 0x to bech32 address
- **`evmd query vm bech32-to-0x [bech32-address]`** - Convert bech32 to 0x address

#### ERC20 Module (`evmd query erc20`)
- **`evmd query erc20 token-pairs`** - Get all registered token pairs
  - Supports pagination flags
- **`evmd query erc20 token-pair [token-address-or-denom]`** - Get specific token pair
- **`evmd query erc20 params`** - Get ERC20 module parameters

#### Fee Market Module (`evmd query feemarket`)
- **`evmd query feemarket base-fee`** - Get base fee at given height
- **`evmd query feemarket block-gas`** - Get block gas used at given height
- **`evmd query feemarket params`** - Get fee market parameters

#### Precise Bank Module (`evmd query precisebank`)
- **`evmd query precisebank remainder`** - Get remainder amount
- **`evmd query precisebank fractional-balance [address]`** - Get fractional balance of account

#### Standard Cosmos Modules

##### Bank Module (`evmd query bank`)
- **`evmd query bank balances [address]`** - Get account balances
- **`evmd query bank balance [address] [denom]`** - Get specific denom balance
- **`evmd query bank total`** - Get total supply

##### Staking Module (`evmd query staking`)
- **`evmd query staking validators`** - Get all validators
- **`evmd query staking delegations [delegator-address]`** - Get delegations
- **`evmd query staking unbonding-delegations [delegator-address]`** - Get unbonding delegations

##### Distribution Module (`evmd query distribution`)
- **`evmd query distribution rewards [delegator-address] [validator-address]`** - Get rewards
- **`evmd query distribution commission [validator-address]`** - Get commission

##### Governance Module (`evmd query gov`)
- **`evmd query gov proposals`** - List all proposals
- **`evmd query gov proposal [proposal-id]`** - Get specific proposal
- **`evmd query gov votes [proposal-id]`** - Get votes on proposal

### Transaction Commands

#### EVM Transactions (`evmd tx vm`)
- **`evmd tx vm send [from] [to] [amount]`** - Send funds between accounts
  - Supports both 0x and bech32 addresses
  - Example: `evmd tx vm send 0x7cB6... 0xA2A8... 10utoken`
- **`evmd tx vm raw [hex-encoded-tx]`** - Build Cosmos transaction from raw Ethereum transaction

#### ERC20 Transactions (`evmd tx erc20`)
- **`evmd tx erc20 convert-coin [amount] [receiver]`** - Convert native Cosmos coins to ERC20
  - Optional receiver parameter (defaults to sender)
- **`evmd tx erc20 convert-erc20 [contract-address] [amount] [receiver]`** - Convert ERC20 to native Cosmos coins
  - Optional receiver parameter (defaults to sender)
- **`evmd tx erc20 register-erc20 [contract-address...]`** - Register native ERC20 tokens (governance)
- **`evmd tx erc20 toggle-conversion [token]`** - Enable/disable token pair conversion (governance)

#### Standard Cosmos Transactions

##### Bank (`evmd tx bank`)
- **`evmd tx bank send [from] [to] [amount]`** - Send coins
- **`evmd tx bank multi-send [from] [to1] [amount1] [to2] [amount2] ...`** - Multi-send

##### Staking (`evmd tx staking`)
- **`evmd tx staking create-validator`** - Create validator
- **`evmd tx staking delegate [validator-address] [amount]`** - Delegate
- **`evmd tx staking unbond [validator-address] [amount]`** - Unbond
- **`evmd tx staking redelegate [src-validator] [dst-validator] [amount]`** - Redelegate

##### Governance (`evmd tx gov`)
- **`evmd tx gov submit-proposal [proposal-type]`** - Submit proposal
- **`evmd tx gov vote [proposal-id] [option]`** - Vote on proposal
- **`evmd tx gov deposit [proposal-id] [amount]`** - Deposit on proposal

### Utility Commands

#### Debug (`evmd debug`)
- **`evmd debug addr [address]`** - Get raw bytes for address
- **`evmd debug raw-bytes [hex]`** - Decode raw hex bytes
- **`evmd debug pubkey [pubkey]`** - Convert public key

#### CometBFT (`evmd comet`)
- **`evmd comet show-node-id`** - Show node ID
- **`evmd comet show-validator`** - Show validator info
- **`evmd comet unsafe-reset-all`** - Reset blockchain state

---

## Module Parameters

### VM (EVM) Module Parameters

**Location:** `x/vm/types/params.go`

| Parameter | Type | Default Value | Description | Constraints |
|-----------|------|---------------|-------------|-------------|
| `evm_denom` | string | `"atest"` | Token denomination for EVM state transitions | Valid denom format |
| `allow_unprotected_txs` | bool | `false` | Allow replay-protected (non-EIP155) transactions | true/false |
| `extra_eips` | []int64 | `[]` | Additional EIPs for vm.Config | Must be valid activatable EIPs, no duplicates |
| `active_static_precompiles` | []string | `[]` | Active precompiled contract addresses | Valid hex addresses, sorted, no duplicates |
| `evm_channels` | []string | `[]` | IBC channel IDs for EVM compatible chains | Valid channel identifiers |
| `access_control` | AccessControl | See below | Permission policy for EVM operations | - |

#### AccessControl Structure

```protobuf
message AccessControl {
  AccessControlType create = 1;  // Permission policy for contract creation
  AccessControlType call = 2;    // Permission policy for contract calls
}

message AccessControlType {
  AccessType access_type = 1;           // Type of permission
  repeated string access_control_list = 2;  // Address list (meaning depends on access_type)
}

enum AccessType {
  ACCESS_TYPE_PERMISSIONLESS = 0;  // No restrictions
  ACCESS_TYPE_RESTRICTED = 1;       // Restricted to no one
  ACCESS_TYPE_PERMISSIONED = 2;     // Only specific addresses allowed
}
```

**Default AccessControl:**
```json
{
  "create": {
    "access_type": "ACCESS_TYPE_PERMISSIONLESS",
    "access_control_list": []
  },
  "call": {
    "access_type": "ACCESS_TYPE_PERMISSIONLESS",
    "access_control_list": []
  }
}
```

#### ChainConfig Parameters

**Location:** `x/vm/types/evm.proto`

Ethereum fork activation blocks/timestamps:
- `homestead_block` - Homestead fork block
- `dao_fork_block` - DAO hard-fork block
- `dao_fork_support` - Support for DAO hard-fork
- `eip150_block` - EIP150 (gas price changes) block
- `eip155_block` - EIP155 (replay protection) block
- `eip158_block` - EIP158 block
- `byzantium_block` - Byzantium fork block
- `constantinople_block` - Constantinople fork block
- `petersburg_block` - Petersburg fork block
- `istanbul_block` - Istanbul fork block
- `muir_glacier_block` - Muir Glacier (bomb delay) block
- `berlin_block` - Berlin fork block
- `london_block` - London fork block
- `arrow_glacier_block` - Arrow Glacier (bomb delay) block
- `gray_glacier_block` - Gray Glacier (bomb delay) block
- `merge_netsplit_block` - Merge network splitter block
- `shanghai_time` - Shanghai fork timestamp
- `cancun_time` - Cancun fork timestamp
- `prague_time` - Prague fork timestamp
- `verkle_time` - Verkle fork timestamp
- `osaka_time` - Osaka fork timestamp
- `chain_id` - Chain ID for EIP-155
- `denom` - Denomination used on EVM
- `decimals` - Decimal precision of denomination

### ERC20 Module Parameters

**Location:** `x/erc20/types/params.go`

| Parameter | Type | Default Value | Description |
|-----------|------|---------------|-------------|
| `enable_erc20` | bool | `true` | Enable ERC20 module functionality |
| `permissionless_registration` | bool | `true` | Allow permissionless ERC20 token registration |

**Parameter Store Keys:**
- `ParamStoreKeyEnableErc20` = `[]byte("EnableErc20")`
- `ParamStoreKeyPermissionlessRegistration` = `[]byte("PermissionlessRegistration")`

### Fee Market Module Parameters

**Location:** `x/feemarket/types/params.go`

| Parameter | Type | Default Value | Description | Constraints |
|-----------|------|---------------|-------------|-------------|
| `no_base_fee` | bool | `false` | Disable base fee mechanism | true/false |
| `base_fee_change_denominator` | uint32 | `8` (from go-ethereum) | Base fee adjustment denominator | Cannot be 0 |
| `elasticity_multiplier` | uint32 | `2` (from go-ethereum) | Block gas limit elasticity multiplier | Cannot be 0 |
| `base_fee` | math.LegacyDec | `1000000000` (1 gwei) | Initial base fee | Cannot be negative |
| `enable_height` | int64 | `0` | Height to enable fee market | Cannot be negative |
| `min_gas_price` | math.LegacyDec | `0` | Minimum gas price | Cannot be negative |
| `min_gas_multiplier` | math.LegacyDec | `0.5` | Minimum gas multiplier | 0 ≤ value ≤ 1 |

**Notes:**
- Base fee is enabled when `!no_base_fee && height >= enable_height`
- `base_fee_change_denominator` and `elasticity_multiplier` defaults come from `github.com/ethereum/go-ethereum/params`

### Precise Bank Module Parameters

**Location:** `x/precisebank/types`

The precise bank module handles fractional token balances with sub-unit precision.

**Queries:**
- `remainder` - Get the remainder amount in the module
- `fractional-balance [address]` - Get fractional balance of an account

---

## Governance Proposals

### Module-Specific Governance Messages

#### VM Module

**1. MsgUpdateParams** (`cosmos.evm.vm.v1.MsgUpdateParams`)
- **Authority:** Governance module account
- **Purpose:** Update VM module parameters
- **Required Fields:**
  - `authority` (string) - Governance account address
  - `params` (Params) - Complete parameter set (all parameters must be supplied)

**2. MsgRegisterPreinstalls** (`cosmos.evm.vm.v1.MsgRegisterPreinstalls`)
- **Authority:** Governance module account
- **Purpose:** Register preinstalled contracts directly in EVM state
- **Required Fields:**
  - `authority` (string) - Governance account address
  - `preinstalls` ([]Preinstall) - List of contracts to preinstall

**Preinstall Structure:**
```protobuf
message Preinstall {
  string name = 1;     // Name of the preinstall contract
  string address = 2;  // Hex format address
  string code = 3;     // Hex format bytecode
}
```

#### ERC20 Module

**1. MsgUpdateParams** (`cosmos.evm.erc20.v1.MsgUpdateParams`)
- **Authority:** Governance module account
- **Purpose:** Update ERC20 module parameters
- **Required Fields:**
  - `authority` (string) - Governance account address
  - `params` (Params) - Complete parameter set

**2. MsgRegisterERC20** (`cosmos.evm.erc20.v1.MsgRegisterERC20`)
- **Authority:** Governance or permissionless (if enabled)
- **Purpose:** Register native ERC20 token pairs
- **Required Fields:**
  - `signer` (string) - Address registering the pairs
  - `erc20addresses` ([]string) - ERC20 contract hex addresses

**3. MsgToggleConversion** (`cosmos.evm.erc20.v1.MsgToggleConversion`)
- **Authority:** Governance module account
- **Purpose:** Enable/disable token pair conversion
- **Required Fields:**
  - `authority` (string) - Governance account address
  - `token` (string) - Token identifier (hex contract address or Cosmos denom)

#### Fee Market Module

**1. MsgUpdateParams** (`cosmos.evm.feemarket.v1.MsgUpdateParams`)
- **Authority:** Governance module account
- **Purpose:** Update fee market parameters
- **Required Fields:**
  - `authority` (string) - Governance account address
  - `params` (Params) - Complete parameter set

### Standard Cosmos SDK Proposals

The following standard Cosmos SDK governance proposal types are supported:

1. **Text Proposals** - General governance decisions
2. **Parameter Change Proposals** - Modify module parameters
3. **Software Upgrade Proposals** - Schedule chain upgrades
4. **Community Pool Spend Proposals** - Spend from community pool
5. **Cancel Software Upgrade Proposals** - Cancel pending upgrades

---

## Precompiled Contracts

Cosmos EVM includes native precompiled contracts that provide access to Cosmos SDK functionality from the EVM.

### Available Precompiles

| Precompile | Address | Description |
|------------|---------|-------------|
| **Bank** | TBD | Access to bank module (send, balances) |
| **Bech32** | TBD | Address conversion utilities |
| **Distribution** | TBD | Staking rewards and distribution |
| **ERC20** | TBD | Native ERC20 token operations |
| **Gov** | TBD | Governance voting and proposals |
| **ICS20** | `0x0000000000000000000000000000000000000802` | IBC transfer functionality |
| **P256** | TBD | P256 signature verification |
| **Slashing** | TBD | Validator slashing operations |
| **Staking** | TBD | Validator staking operations |
| **WERC20** | TBD | Wrapped ERC20 functionality |

**Note:** Precompile addresses are configured via the `active_static_precompiles` parameter in the VM module. The list must be:
- Valid hex addresses
- Sorted alphabetically
- Without duplicates

---

## Configuration Files

### Directory Structure

Default configuration directory: `~/.evmd/`

**Key Files:**
- `~/.evmd/config/config.toml` - Node configuration (CometBFT)
- `~/.evmd/config/app.toml` - Application configuration
- `~/.evmd/config/client.toml` - Client configuration
- `~/.evmd/data/` - Blockchain data
- `~/.evmd/keyring-*` - Key storage (backend dependent)

### Client Configuration (`client.toml`)

```toml
# The network chain ID
chain-id = "myapp-1"

# The keyring's backend (os|file|test|memory)
keyring-backend = "os"

# CLI output format (text|json)
output = "text"

# <host>:<port> to CometBFT RPC interface for this chain
node = "tcp://localhost:26657"

# Transaction broadcasting mode (sync|async|block)
broadcast-mode = "sync"
```

### Application Configuration (`app.toml`)

Key sections include:

#### Minimum Gas Prices
```toml
minimum-gas-prices = "0atest"
```

#### JSON-RPC Configuration
```toml
[json-rpc]
enable = true
address = "127.0.0.1:8545"
ws-address = "127.0.0.1:8546"
api = "eth,net,web3,txpool,debug"
enable-indexer = true
filter-cap = 200
gas-cap = 25000000
txfee-cap = 1
batch-request-limit = 1000
evm-timeout = "5s"
logs-cap = 10000
block-range-cap = 10000
```

#### State Sync Configuration
```toml
[state-sync]
snapshot-interval = 0
snapshot-keep-recent = 2
```

### CometBFT Configuration (`config.toml`)

Key sections:
- **P2P Configuration** - Peer connectivity settings
- **Mempool Configuration** - Transaction pool settings
- **Consensus Configuration** - Block creation and validation
- **Storage Configuration** - Database and pruning settings

---

## Global Flags

These flags are available for all `evmd` commands:

| Flag | Description | Default |
|------|-------------|---------|
| `-b, --broadcast-mode` | Transaction broadcasting mode (sync\|async\|block) | `sync` |
| `--chain-id` | Specify Chain ID for sending Tx | - |
| `--fees` | Fees to pay along with transaction (e.g., 10atest) | - |
| `--from` | Name or address of private key to sign with | - |
| `--gas-adjustment` | Adjustment factor for gas estimate | `1` |
| `--gas-prices` | Gas prices to determine transaction fee | - |
| `--home` | Directory for config and data | `~/.evmd` |
| `--keyring-backend` | Select keyring's backend (os\|file\|test\|memory) | `os` |
| `--log_format` | Logging format (json\|plain) | `plain` |
| `--log_level` | Logging level | `info` |
| `--log_no_color` | Disable colored logs | false |
| `--node` | CometBFT RPC interface address | `tcp://localhost:26657` |
| `--trace` | Print full stack trace on errors | false |

---

## Valid EIPs

The `extra_eips` parameter accepts the following activatable EIPs (from go-ethereum):

To get the list of valid EIPs, check `github.com/ethereum/go-ethereum/core/vm.ValidEip()` and `vm.ActivateableEips()`.

Common EIPs include:
- 2200 (Net gas metering)
- 2929 (Gas cost increases for state access)
- 3198 (BASEFEE opcode)
- 3529 (Reduction in refunds)
- 3855 (PUSH0 instruction)
- 4399 (Supplant DIFFICULTY opcode with PREVRANDAO)
- And others as supported by go-ethereum

---

## Parameter Validation Rules

### VM Module
1. **extra_eips**: Must be valid EIPs from go-ethereum, no duplicates
2. **active_static_precompiles**: Valid addresses, sorted, no duplicates
3. **evm_channels**: Valid IBC channel identifiers
4. **access_control**: Valid AccessType enum values, valid addresses in lists

### Fee Market Module
1. **base_fee_change_denominator**: Cannot be 0
2. **elasticity_multiplier**: Cannot be 0
3. **base_fee**: Cannot be negative
4. **enable_height**: Cannot be negative
5. **min_gas_price**: Cannot be negative
6. **min_gas_multiplier**: Must be between 0 and 1 (inclusive)

### ERC20 Module
- Boolean parameters only, no complex validation

---

## Examples

### Query Examples

```bash
# Get EVM config
evmd query vm config

# Get account balance in bank module using 0x address
evmd query vm balance-bank 0xA2A8B87390F8F2D188242656BFb6852914073D06 atest

# Get ERC20 token balance
evmd query vm balance-erc20 0xUserAddr 0xTokenAddr

# Get token pair info
evmd query erc20 token-pair atest

# Get base fee
evmd query feemarket base-fee
```

### Transaction Examples

```bash
# Send tokens using EVM message
evmd tx vm send myaccount 0xReceiverAddr 100atest --gas-prices 10atest

# Convert Cosmos coin to ERC20
evmd tx erc20 convert-coin 100atest 0xReceiverAddr --from myaccount

# Convert ERC20 to Cosmos coin
evmd tx erc20 convert-erc20 0xTokenAddr 100 cosmos1receiver --from myaccount

# Submit governance proposal to update VM params
evmd tx gov submit-proposal [proposal.json] --from myaccount
```

### Governance Proposal JSON Examples

#### Update VM Parameters
```json
{
  "messages": [
    {
      "@type": "/cosmos.evm.vm.v1.MsgUpdateParams",
      "authority": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
      "params": {
        "evm_denom": "atest",
        "allow_unprotected_txs": false,
        "extra_eips": [],
        "active_static_precompiles": [],
        "evm_channels": [],
        "access_control": {
          "create": {
            "access_type": "ACCESS_TYPE_PERMISSIONLESS",
            "access_control_list": []
          },
          "call": {
            "access_type": "ACCESS_TYPE_PERMISSIONLESS",
            "access_control_list": []
          }
        }
      }
    }
  ],
  "metadata": "Update VM parameters",
  "deposit": "10000000atest",
  "title": "Update EVM Module Parameters",
  "summary": "Proposal to update EVM module parameters"
}
```

#### Register Preinstalled Contract
```json
{
  "messages": [
    {
      "@type": "/cosmos.evm.vm.v1.MsgRegisterPreinstalls",
      "authority": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
      "preinstalls": [
        {
          "name": "MyContract",
          "address": "0x0000000000000000000000000000000000001234",
          "code": "0x608060405234801..."
        }
      ]
    }
  ],
  "metadata": "Register preinstalled contracts",
  "deposit": "10000000atest",
  "title": "Register Preinstalled Contracts",
  "summary": "Proposal to register preinstalled contracts in EVM state"
}
```

---

## Additional Notes

### Address Formats
- **Ethereum (0x)**: Used for EVM transactions, typically 20 bytes hex
- **Cosmos (bech32)**: Used for Cosmos SDK transactions, human-readable
- Both formats can be used interchangeably in many commands
- Conversion utilities available: `0x-to-bech32` and `bech32-to-0x`

### Transaction Broadcasting
- **sync**: Returns after CheckTx (recommended)
- **async**: Returns immediately after broadcast
- **block**: Returns after transaction is included in block (deprecated)

### Keyring Backends
- **os**: OS-native keyring (most secure)
- **file**: Encrypted file storage
- **test**: Unencrypted storage (testing only)
- **memory**: In-memory storage (ephemeral)

---

*Generated from cosmos/evm repository analysis*
