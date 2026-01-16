#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY is required." >&2
  exit 1
fi

if [[ -z "${INSTRUCTIONS:-}" ]]; then
  echo "INSTRUCTIONS is required." >&2
  exit 1
fi

MODEL="${CODEX_MODEL:-gpt-4.1-mini}"
WORKDIR="${WORKDIR:-$(pwd)}"
PATCH_FILE="${PATCH_FILE:-${WORKDIR}/codex.patch}"

PROMPT=$(cat <<'EOF'
You are an automated code change generator.
Return ONLY a unified diff patch that applies cleanly with `git apply`.
Do not include markdown fences or explanations.
Target repository root is the current working directory.
EOF
)

REQUEST=$(jq -n \
  --arg model "$MODEL" \
  --arg prompt "$PROMPT" \
  --arg instructions "$INSTRUCTIONS" \
  '{
    model: $model,
    input: [
      {role: "user", content: [{type: "text", text: $prompt}]},
      {role: "user", content: [{type: "text", text: $instructions}]}
    ]
  }'
)

RESPONSE=$(curl -sS https://api.openai.com/v1/responses \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "${REQUEST}"
)

PATCH=$(echo "$RESPONSE" | jq -r '[.output[]?.content[]? | select(.type=="output_text") | .text] | join("\n")')

if [[ -z "$PATCH" || "$PATCH" == "null" ]]; then
  echo "No patch returned from OpenAI." >&2
  echo "$RESPONSE" >&2
  exit 1
fi

echo "$PATCH" > "$PATCH_FILE"

if ! git -C "$WORKDIR" apply --whitespace=fix "$PATCH_FILE"; then
  echo "Patch failed to apply." >&2
  exit 1
fi

if [[ -z "$(git -C "$WORKDIR" status --porcelain)" ]]; then
  echo "Patch applied but no changes detected." >&2
  exit 1
fi

echo "Patch applied successfully."
