# Zero Clawd — top-level build orchestration.
#
# Zero Clawd is a fork of the Zero terminal coding agent, specialized as a
# blockchain-finance + stock trading/analysis agent. It has two pieces:
#
#   zero-main/     the Zero agent (Go) — builds to zero-main/zero
#   zero-service/  the Node SSE bridge that drives the agent headless with
#                  finance/trading MCP tools
#
# Common targets:
#   make build     build the Go agent binary
#   make service   install the Node service deps
#   make all       build both
#   make smoke     read-only end-to-end smoke test (needs zero-service/.env)
#   make run       start the SSE service on :8787
#   make clean     remove build artifacts

.DEFAULT_GOAL := all
.PHONY: all build service smoke run clean help

AGENT_DIR    := zero-main
SERVICE_DIR  := zero-service
ZERO_BIN     := $(abspath $(AGENT_DIR)/zero)

## Build the Zero Clawd agent binary (-buildvcs=false so it builds without git).
build:
	cd $(AGENT_DIR) && go build -buildvcs=false -o zero ./cmd/zero
	@echo "built $(ZERO_BIN)"

## Install the Node service dependencies.
service:
	cd $(SERVICE_DIR) && npm install --no-audit --no-fund

## Build the agent and install the service.
all: build service
	@echo "Zero Clawd ready. Configure $(SERVICE_DIR)/.env then 'make run'."

## Read-only end-to-end smoke test through the agent.
smoke: build
	cd $(SERVICE_DIR) && ZERO_BIN=$(ZERO_BIN) node src/smoke.mjs "what is the agent wallet balance?"

## Start the SSE bridge (:8787).
run: build
	cd $(SERVICE_DIR) && ZERO_BIN=$(ZERO_BIN) npm start

clean:
	rm -f $(AGENT_DIR)/zero
	rm -rf $(SERVICE_DIR)/node_modules

help:
	@echo "Targets: all (default), build, service, smoke, run, clean"
