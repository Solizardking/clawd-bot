package solanapolicy

import (
	"fmt"
	"strings"
)

// Evaluate applies doc to req. A nil/empty document denies every action.
func Evaluate(doc Document, req Request) Decision {
	method := strings.TrimSpace(req.Method)
	if method == "" {
		return Decision{Reason: "missing method"}
	}

	switch method {
	case MethodSignAndSend:
		return evaluateTransaction(doc, req)
	default:
		return evaluateAction(doc, req, nil)
	}
}

func evaluateTransaction(doc Document, req Request) Decision {
	if len(req.Instructions) == 0 {
		return Decision{Reason: "transaction has no instructions"}
	}
	for i, ix := range req.Instructions {
		if ix.AddressFromALT && needsAddress(doc, MethodSignAndSend) {
			return Decision{
				Reason: fmt.Sprintf("instruction %d: address lookup tables are not resolved", i),
			}
		}
		d := evaluateAction(doc, req, &ix)
		if !d.Allow {
			if d.Reason == "" {
				d.Reason = fmt.Sprintf("instruction %d (%s) matched no allow rule", i, displayIX(ix))
			}
			return d
		}
	}
	return Decision{Allow: true, Reason: "all instructions allowed"}
}

func evaluateAction(doc Document, req Request, ix *Instruction) Decision {
	for _, rule := range doc.Rules {
		if !methodMatch(rule.Method, req.Method) {
			continue
		}
		if !strings.EqualFold(strings.TrimSpace(rule.Action), ActionDeny) {
			continue
		}
		if ruleMatches(rule, req, ix) {
			name := rule.Name
			if name == "" {
				name = "deny"
			}
			return Decision{Rule: name, Reason: "matched deny rule " + name}
		}
	}
	for _, rule := range doc.Rules {
		if !methodMatch(rule.Method, req.Method) {
			continue
		}
		if !strings.EqualFold(strings.TrimSpace(rule.Action), ActionAllow) {
			continue
		}
		if ruleMatches(rule, req, ix) {
			name := rule.Name
			if name == "" {
				name = "allow"
			}
			return Decision{Allow: true, Rule: name, Reason: "matched allow rule " + name}
		}
	}
	return Decision{Reason: "no matching allow rule"}
}

func methodMatch(ruleMethod, reqMethod string) bool {
	rm := strings.TrimSpace(ruleMethod)
	if rm == "" || rm == MethodAny {
		return true
	}
	return rm == strings.TrimSpace(reqMethod)
}

func ruleMatches(rule Rule, req Request, ix *Instruction) bool {
	if len(rule.Conditions) == 0 {
		return true
	}
	for _, c := range rule.Conditions {
		if !conditionMatches(c, req, ix) {
			return false
		}
	}
	return true
}

func conditionMatches(c Condition, req Request, ix *Instruction) bool {
	src := strings.TrimSpace(c.FieldSource)
	field := strings.TrimSpace(c.Field)
	op := strings.ToLower(strings.TrimSpace(c.Operator))

	switch src {
	case SourceClock:
		if field != "current_unix_timestamp" {
			return false
		}
		return compareUint(op, uint64(req.UnixTime), c)
	case SourceMessage:
		if req.Message == nil {
			return false
		}
		switch field {
		case "content":
			return compareString(op, req.Message.Content, c)
		case "byte_length":
			return compareUint(op, uint64(req.Message.ByteLength), c)
		default:
			return false
		}
	case SourceProgram:
		if ix == nil {
			return false
		}
		if field != "programId" {
			return false
		}
		return compareString(op, ix.ProgramID, c)
	case SourceSystem:
		if ix == nil || ix.ProgramID != SystemProgram {
			return false
		}
		return matchSystemField(op, field, ix, c)
	case SourceToken:
		if ix == nil || (ix.ProgramID != TokenProgram && ix.ProgramID != Token2022Program) {
			return false
		}
		return matchTokenField(op, field, ix, c)
	default:
		return false
	}
}

func matchSystemField(op, field string, ix *Instruction, c Condition) bool {
	switch field {
	case "instructionName":
		return compareString(op, ix.Name, c)
	case "Transfer.lamports":
		if !strings.EqualFold(ix.Name, "Transfer") {
			return false
		}
		return compareUint(op, ix.Lamports, c)
	case "Transfer.to":
		if !strings.EqualFold(ix.Name, "Transfer") {
			return false
		}
		return compareString(op, ix.TransferTo, c)
	case "Transfer.from":
		if !strings.EqualFold(ix.Name, "Transfer") {
			return false
		}
		return compareString(op, ix.TransferFrom, c)
	default:
		return false
	}
}

func matchTokenField(op, field string, ix *Instruction, c Condition) bool {
	switch field {
	case "instructionName":
		return compareString(op, ix.Name, c)
	case "TransferChecked.mint", "Transfer.mint":
		if !isTokenTransfer(ix.Name) {
			return false
		}
		return compareString(op, ix.TokenMint, c)
	case "TransferChecked.amount", "Transfer.amount":
		if !isTokenTransfer(ix.Name) {
			return false
		}
		return compareUint(op, ix.TokenAmount, c)
	default:
		return false
	}
}

func compareString(op, got string, c Condition) bool {
	switch op {
	case "eq":
		return got == c.stringValue()
	case "in":
		want := c.stringList()
		for _, v := range want {
			if got == v {
				return true
			}
		}
		return false
	case "contains":
		return strings.Contains(got, c.stringValue())
	case "starts_with":
		return strings.HasPrefix(got, c.stringValue())
	case "ends_with":
		return strings.HasSuffix(got, c.stringValue())
	default:
		return false
	}
}

func compareUint(op string, got uint64, c Condition) bool {
	want, ok := c.uintValue()
	if !ok {
		return false
	}
	switch op {
	case "eq":
		return got == want
	case "lte":
		return got <= want
	case "lt":
		return got < want
	case "gte":
		return got >= want
	case "gt":
		return got > want
	default:
		return false
	}
}

func needsAddress(doc Document, method string) bool {
	for _, rule := range doc.Rules {
		if !methodMatch(rule.Method, method) {
			continue
		}
		for _, c := range rule.Conditions {
			if c.FieldSource == SourceSystem && (c.Field == "Transfer.to" || c.Field == "Transfer.from") {
				return true
			}
		}
	}
	return false
}

func isTokenTransfer(name string) bool {
	return strings.EqualFold(name, "TransferChecked") || strings.EqualFold(name, "Transfer")
}

func displayIX(ix Instruction) string {
	if ix.Name != "" {
		return ix.Name
	}
	if ix.ProgramID != "" {
		return ix.ProgramID
	}
	return "unknown"
}

// OverrideRisk reports the anti-pattern where a lamports cap is followed by a
// broader ALLOW on System Transfer.instructionName.
func OverrideRisk(doc Document) bool {
	var hasLamportsCap, hasTransferNameAllow bool
	for _, rule := range doc.Rules {
		if !methodMatch(rule.Method, MethodSignAndSend) {
			continue
		}
		if !strings.EqualFold(strings.TrimSpace(rule.Action), ActionAllow) {
			continue
		}
		for _, c := range rule.Conditions {
			if c.FieldSource == SourceSystem && c.Field == "Transfer.lamports" {
				hasLamportsCap = true
			}
			if c.FieldSource == SourceSystem && c.Field == "instructionName" &&
				(c.Operator == "eq" || c.Operator == "in") {
				for _, v := range c.stringList() {
					if strings.EqualFold(v, "Transfer") {
						hasTransferNameAllow = true
					}
				}
			}
		}
	}
	return hasLamportsCap && hasTransferNameAllow
}
