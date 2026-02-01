cat > db/README.md << 'EOF'
## Deni Database

### Create database
psql -U <your_db_user> -d postgres -c "CREATE DATABASE deni;"

### Load schema
psql -U <your_db_user> -d deni -f db/schema.sql

### (Optional) Load seed data
psql -U <your_db_user> -d deni -f db/seed.sql

### Verify
psql -U <your_db_user> -d deni -c "\dt"
EOF
