require('dotenv').config();
const server = require('./models/server');
const port = process.env.PORT;

server.listen(port, () => {
    console.log(`server listen on port ${port}`);
});
