#!/usr/bin/env bash
# Copy production Account row(s) for the admin email into theqrcode-dev, linked to the
# existing dev User (same email). No User or Subscription copy — dev user must already exist.
# Run from host: ./scripts/copy-prod-user-to-dev.sh
# Requires: postgres container, PGPASSWORD=password

set -e
CONTAINER="${POSTGRES_CONTAINER:-postgres}"
ADMIN_EMAIL="${ADMIN_EMAIL:-adam.lee.williams.1989@gmail.com}"

docker exec -e PGPASSWORD=password "$CONTAINER" bash -c "
  PROD_UID=\$(psql -U postgres -d theqrcode -t -A -c \"SELECT id FROM \\\"User\\\" WHERE email = '$ADMIN_EMAIL' LIMIT 1\")
  DEV_UID=\$(psql -U postgres -d theqrcode-dev -t -A -c \"SELECT id FROM \\\"User\\\" WHERE email = '$ADMIN_EMAIL' LIMIT 1\")
  if [ -z \"\$PROD_UID\" ]; then echo 'No production user found for $ADMIN_EMAIL'; exit 1; fi
  if [ -z \"\$DEV_UID\" ]; then echo 'No dev user found for $ADMIN_EMAIL (create the User in theqrcode-dev first)'; exit 1; fi

  echo \"Linking prod Account(s) to dev user \$DEV_UID\"
  psql -U postgres -d theqrcode-dev -c \"DELETE FROM \\\"Account\\\" WHERE \\\"userId\\\" = '\$DEV_UID';\"

  psql -U postgres -d theqrcode -t -A -c \"
    SELECT 'INSERT INTO \\\"Account\\\" (id, \\\"userId\\\", type, provider, \\\"providerAccountId\\\", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES ('
      || quote_literal(id) || ', ' || quote_literal('\$DEV_UID') || ', ' || quote_literal(type) || ', ' || quote_literal(provider) || ', ' || quote_literal(\\\"providerAccountId\\\")
      || ', ' || COALESCE(quote_literal(refresh_token), 'NULL') || ', ' || COALESCE(quote_literal(access_token), 'NULL') || ', ' || COALESCE(expires_at::text, 'NULL') || ', ' || COALESCE(quote_literal(token_type), 'NULL') || ', ' || COALESCE(quote_literal(scope), 'NULL') || ', ' || COALESCE(quote_literal(id_token), 'NULL') || ', ' || COALESCE(quote_literal(session_state), 'NULL')
      || ');'
    FROM \\\"Account\\\" WHERE \\\"userId\\\" = '\$PROD_UID'
  \" | psql -U postgres -d theqrcode-dev -q

  echo \"Done. Sign in at dev.theqrcode.io with $ADMIN_EMAIL\"
"
