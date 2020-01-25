import fs from "fs";

WebApp.connectHandlers.use((req, res, next) => {
    try {
        var re = /^\/images\/(.*)$/.exec(req.url);
        if (re !== null) {
            var filePath = process.env.PWD + '/public/.#images/' + re[1];
            var data = fs.readFileSync(filePath);
            res.writeHead(200, {
                    'Content-Type': 'image'
                });
            res.write(data);
            res.end();
        } else {
            next();
        }
    } catch(e) {
        console.log(e);
        next();
    }
});