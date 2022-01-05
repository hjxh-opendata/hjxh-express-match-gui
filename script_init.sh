

# after installing `@prisma/client`, need to generate `schema.prisma`,
# and generate the `.prisma/client/index.js` based on the data model in `schema.prisma`
prisma generate

# modify the `.prisma/client/index.js`, fasten the start speed of mac
sh script_replace_prisma_client_index-2.sh

# build into `release/app`
npm run build

# build the package, and install the native dependencies at the same time
npm run app:dir

sh script_install_binary.sh

