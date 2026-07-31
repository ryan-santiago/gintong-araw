import { execSync } from 'child_process'

const name = process.argv[2]

if (!name) {
	throw new Error('Usage: npm run db:push <migration_name>')
}

const safeName = name.replace(/\s+/g, '-').toLowerCase()

execSync(`drizzle-kit generate --name=${safeName}`, { stdio: 'inherit' })
execSync(`drizzle-kit migrate`, { stdio: 'inherit' })
