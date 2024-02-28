const express = require('express');
const fs = require('fs');
const cors = require("cors")

const app = express();
app.use(cors());
app.use(express.json());

const blockedIPsFile = './blockedIPs.json';

app.post('/paingiver', function(req, res) {
    const { ip } = req.body;

    // Read existing blocked IPs or initialize as empty array
    fs.readFile(blockedIPsFile, 'utf8', (err, data) => {
        let blockedIPs = [];
        if (!err) {
            try {
                blockedIPs = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing blocked IPs file:', error);
            }
        }

        // Add new IP to the list
        blockedIPs.push({ ip });

        // Save updated list to file
        fs.writeFile(blockedIPsFile, JSON.stringify(blockedIPs), (err) => {
            if (err) {
                console.error('Error saving blocked IPs:', err);
                res.status(500).json({ error: 'Failed to block IP' });
            } else {
                console.log("Blocked " + ip + ", what an idiot for doing that");
                res.status(403).json({ blocked: true, ip: ip });
            }
        });
    });
});

app.post('/painchecker', function(req, res) {
    const { ip } = req.body;

    // Read blocked IPs from file
    fs.readFile(blockedIPsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading blocked IPs file:', err);
            res.status(500).json({ error: 'Failed to check IP' });
            return;
        }

        try {
            const blockedIPs = JSON.parse(data);

            // Check if the IP is in the blockedIPs list
            const isBlocked = blockedIPs.some(blocked => blocked.ip === ip);

            // Set the status code based on whether the IP is blocked or not
            if (isBlocked) {
                console.log(ip + " is blocked");
                res.status(403).json({ blocked: true });
            } else {
                console.log(ip + " is not blocked");
                res.status(200).json({ blocked: false });
            }
        } catch (error) {
            console.error('Error parsing blocked IPs:', error);
            res.status(500).json({ error: 'Failed to check IP' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
