# @prefabs.tech/saas
A set of saas libraries by prefabs.tech.

## Packages
  - @prefabs.tech/saas-fastify (https://www.npmjs.com/package/@prefabs.tech/saas-fastify)
  - @prefabs.tech/saas-react (https://www.npmjs.com/package/@prefabs.tech/saas-react)

# Installation & Usage
## Install dependencies
Install dependencies recursively with this command
```bash
make install
```

## Build all packages
```bash
make build
```

## Lint code
```bash
make lint
```

## Typecheck code
```bash
make typecheck
```

## Test
```bash
make test
```

# Developing locally & testing
You can test these libraries locally without releasing using the `pnpm link` command. This allows your application to use the local version of the library instead of the published one. [More on pnpm link](https://pnpm.io/cli/link).

To link a library locally, run this command from the respective app directory:
```bash
pnpm link ./<path_to_libraries_monorepo>/packages/<library_name>
```

To unlink the library:
```bash
pnpm unlink ./<path_to_libraries_monorepo>/packages/<library_name>
```

## Troubleshooting
  - Make sure that `package.json` and `pnpm-lock.yml` are synchronized.
  - You may need to restart your apps before link and unlink to see the changes.
  - All the libraries that defines or uses context has to be linked in order to link one libraries that use the context or defines it.
