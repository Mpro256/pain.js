const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { appendFile } = require('fs');
const blockips = [];

const app = express();
app.use(cors());
app.use(express.json());

app.post('/paingiver', function(req, res) {
    
    console.log('The IP is' + req.body);
    console.log('If you found this, its for a good reason, blocking unwanted requests');
    const { ip } = req.body;
    blockips.push(ip);
    

    res.status(403).json({ blocked: true, ip: ip })
    console.log("Blocked" + ip + ", what an idiot for doing that")

});

app.post('/painchecker', function(req,res) {
    const { ip2 } = req.body;


    const isBlocked = blockips.includes(ip2);

    res.status(403).json({ blocked: isBlocked });



});

app.listen(3000, () => {
    console.log('Server is running on port 3000, i thinkkkk');
});